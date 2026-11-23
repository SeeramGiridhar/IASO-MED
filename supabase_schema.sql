-- IASO Med Supabase Schema Setup (Production Ready & Fixed)

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

-- 4. Create REPORTS table (includes report_type, hospital_clinic, notes, and compatible status check)
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  category TEXT,
  report_type TEXT,
  hospital_clinic TEXT,
  notes TEXT,
  report_date DATE DEFAULT CURRENT_DATE,
  file_url TEXT NOT NULL,
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

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- 7. Define RLS Policies

-- Profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Doctors
DROP POLICY IF EXISTS "Doctors are viewable by everyone" ON public.doctors;
DROP POLICY IF EXISTS "Doctors can update their own data" ON public.doctors;
CREATE POLICY "Doctors are viewable by everyone" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "Doctors can update their own data" ON public.doctors FOR ALL USING (auth.uid() = id);

-- Patients
DROP POLICY IF EXISTS "Patients can view/update own health data" ON public.patients;
CREATE POLICY "Patients can view/update own health data" ON public.patients FOR ALL USING (auth.uid() = id);

-- Reports
DROP POLICY IF EXISTS "Patients view own reports" ON public.reports;
DROP POLICY IF EXISTS "Patients can upload reports" ON public.reports;
DROP POLICY IF EXISTS "Assigned doctors view reports" ON public.reports;
DROP POLICY IF EXISTS "Patients and assigned doctors update reports" ON public.reports;
DROP POLICY IF EXISTS "Patients can delete own reports" ON public.reports;

CREATE POLICY "Patients view own reports" ON public.reports FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Patients can upload reports" ON public.reports FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Assigned doctors view reports" ON public.reports FOR SELECT USING (EXISTS (
  SELECT 1 FROM public.appointments 
  WHERE appointments.doctor_id = auth.uid() 
  AND appointments.patient_id = reports.patient_id
));
CREATE POLICY "Patients and assigned doctors update reports" ON public.reports FOR UPDATE 
USING (auth.uid() = patient_id OR auth.uid() = doctor_id);
CREATE POLICY "Patients can delete own reports" ON public.reports FOR DELETE 
USING (auth.uid() = patient_id);

-- Appointments
DROP POLICY IF EXISTS "Users view own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Patients book appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users update own appointments" ON public.appointments;

CREATE POLICY "Users view own appointments" ON public.appointments FOR SELECT 
USING (auth.uid() = patient_id OR auth.uid() = doctor_id);
CREATE POLICY "Patients book appointments" ON public.appointments FOR INSERT 
WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Users update own appointments" ON public.appointments FOR UPDATE 
USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

-- 8. Trigger to automatically handle profile, doctor, and patient record creation
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
    INSERT INTO public.doctors (id, specialization, experience_years, hospital_clinic, consultation_fee, rating)
    VALUES (NEW.id, 'General Medicine', 5, 'IASO Healthcare', 100, 4.9)
    ON CONFLICT (id) DO NOTHING;
  ELSE
    INSERT INTO public.patients (id)
    VALUES (NEW.id)
    ON CONFLICT (id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. Storage Buckets & Policies
INSERT INTO storage.buckets (id, name, public) 
VALUES ('medical-reports', 'medical-reports', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Authenticated users upload medical reports" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users read medical reports" ON storage.objects;

CREATE POLICY "Authenticated users upload medical reports" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'medical-reports');

CREATE POLICY "Authenticated users read medical reports" ON storage.objects
FOR SELECT TO authenticated USING (bucket_id = 'medical-reports');
