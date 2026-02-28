-- IASO Med Supabase Schema Setup

-- 1. Create PROFILES table
-- This table stores additional user metadata linked to auth.users
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
-- Stores professional credentials and practice details
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
-- Stores patient-specific medical metadata
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  date_of_birth DATE,
  gender TEXT,
  blood_group TEXT,
  emergency_contact JSONB,
  medical_history TEXT,
  allergies TEXT[] DEFAULT '{}'
);

-- 4. Create REPORTS table
-- Stores references to medical documents and analysis
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  category TEXT,
  report_date DATE DEFAULT CURRENT_DATE,
  file_url TEXT NOT NULL,
  ai_summary TEXT,
  ai_analysis JSONB,
  status TEXT CHECK (status IN ('pending', 'analyzed', 'reviewed')) DEFAULT 'pending',
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

-- Profiles: Users can read all profiles (to find doctors), but only update their own
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Doctors: Viewable by everyone, updated by the specific doctor
CREATE POLICY "Doctors are viewable by everyone" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "Doctors can update their own data" ON public.doctors FOR UPDATE USING (auth.uid() = id);

-- Patients: Only viewable by the patient themselves and assigned doctors (future logic)
CREATE POLICY "Patients can view/update own health data" ON public.patients USING (auth.uid() = id);

-- Reports: Only patient and assigned doctor can view
CREATE POLICY "Patients view own reports" ON public.reports FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Patients can upload reports" ON public.reports FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Assigned doctors view reports" ON public.reports FOR SELECT USING (EXISTS (
  SELECT 1 FROM public.appointments 
  WHERE appointments.doctor_id = auth.uid() 
  AND appointments.patient_id = reports.patient_id
));

-- Appointments: Relevant parties can view
CREATE POLICY "Users view own appointments" ON public.appointments FOR SELECT 
USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

CREATE POLICY "Patients book appointments" ON public.appointments FOR INSERT 
WITH CHECK (auth.uid() = patient_id);

-- 8. Trigger to handle profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'patient')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. Storage Buckets (Run manually in Supabase UI if needed)
-- bucket: medical-reports
-- public: false
