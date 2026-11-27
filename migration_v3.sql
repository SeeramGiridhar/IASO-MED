-- Migration V3: Doctor Verification / Admin Approval Workflow + Patient-Doctor Direct Messaging
-- Idempotent & safe to run on existing Supabase projects.

-- ============================================================================
-- PART 1: ADMIN ROLE & SECURITY HELPERS
-- ============================================================================

-- 1. Expand profiles role constraint to include 'admin'
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('patient', 'doctor', 'admin'));

-- 2. Security-definer helper to check admin role without RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 3. Harden handle_new_user so public signup can NEVER self-assign 'admin'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
BEGIN
  user_role := CASE
    WHEN NEW.raw_user_meta_data->>'role' = 'doctor' THEN 'doctor'
    ELSE 'patient'
  END;

  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    user_role
  )
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name;

  IF user_role = 'doctor' THEN
    INSERT INTO public.doctors (
      id,
      specialization,
      experience_years,
      license_number,
      education,
      hospital_clinic,
      consultation_fee,
      rating,
      is_verified,
      review_status
    )
    VALUES (
      NEW.id,
      NULLIF(NEW.raw_user_meta_data->>'specialization', ''),
      CASE
        WHEN NEW.raw_user_meta_data->>'experience_years' ~ '^[0-9]+$'
        THEN (NEW.raw_user_meta_data->>'experience_years')::INTEGER
        ELSE NULL
      END,
      NULLIF(NEW.raw_user_meta_data->>'license_number', ''),
      NULLIF(NEW.raw_user_meta_data->>'education', ''),
      NULLIF(NEW.raw_user_meta_data->>'hospital_clinic', ''),
      CASE
        WHEN NEW.raw_user_meta_data->>'consultation_fee' ~ '^[0-9]+(\.[0-9]+)?$'
        THEN (NEW.raw_user_meta_data->>'consultation_fee')::NUMERIC(10,2)
        ELSE NULL
      END,
      NULL,
      FALSE,
      'pending'
    )
    ON CONFLICT (id) DO UPDATE
    SET
      specialization = COALESCE(EXCLUDED.specialization, doctors.specialization),
      experience_years = COALESCE(EXCLUDED.experience_years, doctors.experience_years),
      license_number = COALESCE(EXCLUDED.license_number, doctors.license_number),
      education = COALESCE(EXCLUDED.education, doctors.education),
      hospital_clinic = COALESCE(EXCLUDED.hospital_clinic, doctors.hospital_clinic),
      consultation_fee = COALESCE(EXCLUDED.consultation_fee, doctors.consultation_fee);
  ELSE
    INSERT INTO public.patients (
      id,
      date_of_birth,
      gender,
      blood_group,
      emergency_contact,
      allergies
    )
    VALUES (
      NEW.id,
      CASE
        WHEN NEW.raw_user_meta_data->>'date_of_birth' IS NOT NULL AND NEW.raw_user_meta_data->>'date_of_birth' != ''
        THEN (NEW.raw_user_meta_data->>'date_of_birth')::DATE
        ELSE NULL
      END,
      NULLIF(NEW.raw_user_meta_data->>'gender', ''),
      NULLIF(NEW.raw_user_meta_data->>'blood_group', ''),
      CASE
        WHEN NEW.raw_user_meta_data->'emergency_contact' IS NOT NULL
        THEN NEW.raw_user_meta_data->'emergency_contact'
        ELSE NULL
      END,
      COALESCE(
        ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'allergies')),
        '{}'::TEXT[]
      )
    )
    ON CONFLICT (id) DO UPDATE
    SET
      date_of_birth = COALESCE(EXCLUDED.date_of_birth, patients.date_of_birth),
      gender = COALESCE(EXCLUDED.gender, patients.gender),
      blood_group = COALESCE(EXCLUDED.blood_group, patients.blood_group),
      emergency_contact = COALESCE(EXCLUDED.emergency_contact, patients.emergency_contact),
      allergies = COALESCE(EXCLUDED.allergies, patients.allergies);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- PART 2: DOCTOR VERIFICATION & ADMIN APPROVAL WORKFLOW
-- ============================================================================

-- 1. Extend doctors table for credential documents & verification audit trail
ALTER TABLE public.doctors
  ADD COLUMN IF NOT EXISTS verification_document_url TEXT,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
  ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Normalize review_status default and constraint
ALTER TABLE public.doctors ALTER COLUMN review_status SET DEFAULT 'pending';
UPDATE public.doctors SET review_status = 'approved' WHERE is_verified = TRUE AND (review_status IS NULL OR review_status = 'verified');
UPDATE public.doctors SET review_status = 'pending' WHERE is_verified = FALSE AND (review_status IS NULL OR review_status = 'verified');

ALTER TABLE public.doctors DROP CONSTRAINT IF EXISTS doctors_review_status_check;
ALTER TABLE public.doctors ADD CONSTRAINT doctors_review_status_check
  CHECK (review_status IN ('pending', 'approved', 'rejected', 'review_needed'));

CREATE INDEX IF NOT EXISTS idx_doctors_verification ON public.doctors(is_verified, review_status);

-- 2. Trigger preventing non-admin users from self-verifying
CREATE OR REPLACE FUNCTION public.guard_doctor_verification()
RETURNS TRIGGER AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.is_admin() THEN
    IF NEW.is_verified IS DISTINCT FROM OLD.is_verified
       OR NEW.verified_at IS DISTINCT FROM OLD.verified_at
       OR NEW.verified_by IS DISTINCT FROM OLD.verified_by
       OR NEW.rejection_reason IS DISTINCT FROM OLD.rejection_reason
       OR (NEW.review_status IS DISTINCT FROM OLD.review_status AND NEW.review_status != 'pending') THEN
      RAISE EXCEPTION 'Only administrators can modify doctor verification status';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_guard_doctor_verification ON public.doctors;
CREATE TRIGGER trg_guard_doctor_verification
  BEFORE UPDATE ON public.doctors
  FOR EACH ROW EXECUTE FUNCTION public.guard_doctor_verification();

-- 3. Doctors RLS policies (add admin update access)
DROP POLICY IF EXISTS "Admins can update any doctor verification" ON public.doctors;
CREATE POLICY "Admins can update any doctor verification" ON public.doctors
FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 4. Private Storage Bucket for Doctor Credentials
INSERT INTO storage.buckets (id, name, public)
VALUES ('doctor-credentials', 'doctor-credentials', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Doctors upload own credentials" ON storage.objects;
DROP POLICY IF EXISTS "Doctors and admins read credentials" ON storage.objects;
DROP POLICY IF EXISTS "Doctors delete own credentials" ON storage.objects;

CREATE POLICY "Doctors upload own credentials" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'doctor-credentials'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Doctors and admins read credentials" ON storage.objects
FOR SELECT TO authenticated USING (
  bucket_id = 'doctor-credentials' AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR public.is_admin()
  )
);

CREATE POLICY "Doctors delete own credentials" ON storage.objects
FOR DELETE TO authenticated USING (
  bucket_id = 'doctor-credentials'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================================
-- PART 3: PATIENT-DOCTOR IN-APP DIRECT MESSAGING
-- ============================================================================

-- 1. Conversations table (1-to-1 per patient-doctor pair)
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  last_message_preview TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(patient_id, doctor_id)
);

-- 2. Messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL CHECK (char_length(trim(content)) > 0 AND char_length(content) <= 4000),
  is_read BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_conversations_patient ON public.conversations(patient_id, last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_doctor ON public.conversations(doctor_id, last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON public.messages(conversation_id, created_at DESC);

-- 4. Update conversation timestamp & preview automatically on new message
CREATE OR REPLACE FUNCTION public.update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations
  SET
    last_message_at = NEW.created_at,
    last_message_preview = left(NEW.content, 120)
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_update_conversation_on_message ON public.messages;
CREATE TRIGGER trg_update_conversation_on_message
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.update_conversation_on_message();

-- 5. Enable RLS on conversations & messages
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Participants view own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Participants create conversation with appointment" ON public.conversations;

CREATE POLICY "Participants view own conversations" ON public.conversations
FOR SELECT TO authenticated USING (
  auth.uid() = patient_id OR auth.uid() = doctor_id
);

CREATE POLICY "Participants create conversation with appointment" ON public.conversations
FOR INSERT TO authenticated WITH CHECK (
  (auth.uid() = patient_id OR auth.uid() = doctor_id)
  AND EXISTS (
    SELECT 1 FROM public.appointments a
    WHERE a.patient_id = conversations.patient_id
    AND a.doctor_id = conversations.doctor_id
  )
);

DROP POLICY IF EXISTS "Participants view conversation messages" ON public.messages;
DROP POLICY IF EXISTS "Participants send messages" ON public.messages;
DROP POLICY IF EXISTS "Recipients mark messages read" ON public.messages;

CREATE POLICY "Participants view conversation messages" ON public.messages
FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = messages.conversation_id
    AND (c.patient_id = auth.uid() OR c.doctor_id = auth.uid())
  )
);

CREATE POLICY "Participants send messages" ON public.messages
FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = sender_id
  AND EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = messages.conversation_id
    AND (c.patient_id = auth.uid() OR c.doctor_id = auth.uid())
  )
);

CREATE POLICY "Recipients mark messages read" ON public.messages
FOR UPDATE TO authenticated USING (
  sender_id != auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = messages.conversation_id
    AND (c.patient_id = auth.uid() OR c.doctor_id = auth.uid())
  )
);

-- 6. Enable Supabase Realtime on messages table (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
  END IF;
END $$;
