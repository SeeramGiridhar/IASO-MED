-- IASO Med Supabase Canonical Schema Setup (Production Ready & Secure)

-- 1. Create PROFILES table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('patient', 'doctor')) NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create DOCTORS table
CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  specialization TEXT,
  experience_years INTEGER,
  license_number TEXT,
  education TEXT,
  bio TEXT,
  hospital_clinic TEXT,
  consultation_fee NUMERIC(10, 2),
  rating NUMERIC(3, 2) DEFAULT 0.00,
  is_verified BOOLEAN DEFAULT FALSE,
  availability JSONB DEFAULT '[]'::jsonb
);

-- 3. Create PATIENTS table
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  date_of_birth DATE,
  gender TEXT,
  blood_group TEXT,
  emergency_contact JSONB,
  medical_history TEXT,
  allergies TEXT[] DEFAULT '{}'
);

-- 4. Create REPORTS table (with multi-file support and patient notes)
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  category TEXT,
  report_type TEXT,
  hospital_clinic TEXT,
  notes TEXT,
  patient_notes TEXT,
  report_date DATE DEFAULT CURRENT_DATE,
  file_url TEXT NOT NULL,
  file_urls TEXT[] DEFAULT '{}',
  ai_summary TEXT,
  ai_analysis JSONB,
  status TEXT CHECK (status IN ('pending', 'analyzed', 'reviewed', 'normal', 'warning', 'critical')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create APPOINTMENTS table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  reason TEXT,
  status TEXT CHECK (status IN ('scheduled', 'completed', 'cancelled')) DEFAULT 'scheduled',
  reports_shared UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_reports_patient_id ON public.reports(patient_id);
CREATE INDEX IF NOT EXISTS idx_reports_doctor_id ON public.reports(doctor_id);
CREATE INDEX IF NOT EXISTS idx_reports_date ON public.reports(report_date);
CREATE INDEX IF NOT EXISTS idx_reports_status_category ON public.reports(status, category);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON public.appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_doctors_specialization ON public.doctors(specialization);

-- 7. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- 8. Profiles RLS Policies (Patient profile privacy strictly enforced)
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

-- 9. Doctors RLS Policies (Public doctor directory)
DROP POLICY IF EXISTS "Doctors are viewable by everyone" ON public.doctors;
DROP POLICY IF EXISTS "Doctors can update their own data" ON public.doctors;

CREATE POLICY "Doctors are viewable by everyone" ON public.doctors 
FOR SELECT USING (true);

CREATE POLICY "Doctors can update their own data" ON public.doctors 
FOR ALL USING (auth.uid() = id);

-- 10. Patients RLS Policies (Private patient health records)
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

-- 11. Reports RLS Policies (Strict ownership and explicit appointment sharing consent)
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

-- 12. Appointments RLS Policies
DROP POLICY IF EXISTS "Users view own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Patients book appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users update own appointments" ON public.appointments;

CREATE POLICY "Users view own appointments" ON public.appointments 
FOR SELECT USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

CREATE POLICY "Patients book appointments" ON public.appointments 
FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users update own appointments" ON public.appointments 
FOR UPDATE USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

-- 13. User Creation Trigger (Saves actual submitted details without inventing credentials)
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 14. Storage Buckets & Policies (Private bucket with folder ownership and explicit consent sharing)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('medical-reports', 'medical-reports', false)
ON CONFLICT (id) DO NOTHING;

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
