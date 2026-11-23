-- Migration V2: Fix Permissions, RLS Policies, Schema, Multi-File Attachments, and Performance Indexes

-- 1. Update reports table schema for existing installations
ALTER TABLE public.reports 
  ADD COLUMN IF NOT EXISTS file_urls TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS patient_notes TEXT,
  ADD COLUMN IF NOT EXISTS report_type TEXT,
  ADD COLUMN IF NOT EXISTS hospital_clinic TEXT;

-- If notes column exists, preserve it in patient_notes
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'reports' AND column_name = 'notes'
  ) THEN
    UPDATE public.reports SET patient_notes = notes WHERE patient_notes IS NULL AND notes IS NOT NULL;
  END IF;
END $$;

-- 2. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_reports_patient_id ON public.reports(patient_id);
CREATE INDEX IF NOT EXISTS idx_reports_doctor_id ON public.reports(doctor_id);
CREATE INDEX IF NOT EXISTS idx_reports_date ON public.reports(report_date);
CREATE INDEX IF NOT EXISTS idx_reports_status_category ON public.reports(status, category);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON public.appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_doctors_specialization ON public.doctors(specialization);

-- 3. Update RLS policies on profiles (Enforce privacy: patient profiles are NOT public)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles view policy" ON public.profiles;

CREATE POLICY "Profiles view policy" ON public.profiles
FOR SELECT TO authenticated, anon USING (
  role = 'doctor'
  OR auth.uid() = id
  OR EXISTS (
    SELECT 1 FROM public.appointments a
    WHERE a.doctor_id = auth.uid()
    AND a.patient_id = profiles.id
  )
);

CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE TO authenticated USING (auth.uid() = id);

-- 4. Update RLS policies on patients
DROP POLICY IF EXISTS "Patients can view/update own health data" ON public.patients;
DROP POLICY IF EXISTS "Patients view own data" ON public.patients;
DROP POLICY IF EXISTS "Doctors view appointed patient data" ON public.patients;
DROP POLICY IF EXISTS "Patients update own data" ON public.patients;

CREATE POLICY "Patients view own data" ON public.patients
FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Doctors view appointed patient data" ON public.patients
FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.appointments a
    WHERE a.doctor_id = auth.uid()
    AND a.patient_id = patients.id
  )
);

CREATE POLICY "Patients update own data" ON public.patients
FOR ALL TO authenticated USING (auth.uid() = id);

-- 5. Update RLS policies on reports (Enforce ownership and explicit consent per report)
DROP POLICY IF EXISTS "Patients view own reports" ON public.reports;
DROP POLICY IF EXISTS "Patients can upload reports" ON public.reports;
DROP POLICY IF EXISTS "Assigned doctors view reports" ON public.reports;
DROP POLICY IF EXISTS "Patients and assigned doctors update reports" ON public.reports;
DROP POLICY IF EXISTS "Patients can delete own reports" ON public.reports;
DROP POLICY IF EXISTS "Doctors view only explicitly shared reports" ON public.reports;

CREATE POLICY "Patients view own reports" ON public.reports
FOR SELECT TO authenticated USING (auth.uid() = patient_id);

CREATE POLICY "Patients can upload reports" ON public.reports
FOR INSERT TO authenticated WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Doctors view only explicitly shared reports" ON public.reports
FOR SELECT TO authenticated USING (
  auth.uid() = doctor_id
  OR EXISTS (
    SELECT 1 FROM public.appointments a
    WHERE a.doctor_id = auth.uid()
    AND a.patient_id = reports.patient_id
    AND reports.id = ANY(a.reports_shared)
  )
);

CREATE POLICY "Patients and assigned doctors update reports" ON public.reports
FOR UPDATE TO authenticated USING (
  auth.uid() = patient_id 
  OR auth.uid() = doctor_id
  OR EXISTS (
    SELECT 1 FROM public.appointments a
    WHERE a.doctor_id = auth.uid()
    AND a.patient_id = reports.patient_id
    AND reports.id = ANY(a.reports_shared)
  )
);

CREATE POLICY "Patients can delete own reports" ON public.reports
FOR DELETE TO authenticated USING (auth.uid() = patient_id);

-- 6. Update storage RLS policies (Enforce folder ownership and explicit consent on files)
DROP POLICY IF EXISTS "Authenticated users upload medical reports" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users read medical reports" ON storage.objects;
DROP POLICY IF EXISTS "Users upload to own folder" ON storage.objects;
DROP POLICY IF EXISTS "Users read own report files or authorized shared files" ON storage.objects;
DROP POLICY IF EXISTS "Users delete own report files" ON storage.objects;

CREATE POLICY "Users upload to own folder" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'medical-reports' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users read own report files or authorized shared files" ON storage.objects
FOR SELECT TO authenticated USING (
  bucket_id = 'medical-reports' AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR EXISTS (
      SELECT 1 FROM public.reports r
      JOIN public.appointments a ON a.patient_id = r.patient_id
      WHERE a.doctor_id = auth.uid()
      AND (r.id = ANY(a.reports_shared) OR r.doctor_id = auth.uid())
      AND (r.file_url = name OR name = ANY(r.file_urls))
    )
  )
);

CREATE POLICY "Users delete own report files" ON storage.objects
FOR DELETE TO authenticated USING (
  bucket_id = 'medical-reports' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 7. Update user creation trigger to preserve actual submitted metadata without inventing credentials
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
BEGIN
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'patient');

  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    user_role
  )
  ON CONFLICT (id) DO UPDATE 
  SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;

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
      is_verified
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
      0.00,
      FALSE
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
