import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Heart, Stethoscope, AlertCircle, Eye, EyeOff, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [userType, setUserType] = useState<'patient' | 'doctor' | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phone: '',
        dob: '',
        gender: '',
        bloodGroup: '',
        allergies: '',
        emergencyName: '',
        emergencyPhone: '',
        specialization: '',
        license: '',
        experience: '',
        education: '',
        clinicName: '',
        clinicAddress: '',
        consultationFee: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userType) return;

        setIsLoading(true);
        setError(null);

        try {
            const { error: signUpError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        role: userType,
                    },
                    emailRedirectTo: `${window.location.origin}/login`
                }
            });

            if (signUpError) throw signUpError;

            // In a real app, we'd wait for email confirmation or create profiles entry
            // But our SQL trigger handles profile creation.
            alert('Registration successful! Please check your email or sign in.');
            navigate('/login');
        } catch (err: any) {
            setError(err.message || 'An error occurred during registration');
        } finally {
            setIsLoading(false);
        }
    };

    const totalSteps = 3;

    if (!userType) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4">
                <div className="relative w-full max-w-lg">
                    <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/60 border border-gray-100 p-8 sm:p-10">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25"><Heart className="w-5 h-5 text-white" /></div>
                                <span className="text-2xl font-bold text-gray-900 tracking-tight">IASO<span className="text-primary-600">Med</span></span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">Create Your Account</h1>
                            <p className="mt-1 text-gray-500">Choose how you want to use IASO Med</p>
                        </div>

                        <div className="grid gap-4">
                            <button
                                onClick={() => setUserType('patient')}
                                className="group flex items-start gap-4 p-5 border-2 border-gray-100 rounded-2xl hover:border-primary-300 hover:bg-primary-50/30 transition-all text-left"
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary-50 group-hover:bg-primary-100 flex items-center justify-center flex-shrink-0 transition-colors">
                                    <User className="w-6 h-6 text-primary-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-lg">I'm a Patient</h3>
                                    <p className="text-sm text-gray-500 mt-0.5">Upload reports, get AI analysis, and book appointments</p>
                                </div>
                            </button>

                            <button
                                onClick={() => setUserType('doctor')}
                                className="group flex items-start gap-4 p-5 border-2 border-gray-200 rounded-2xl hover:border-primary-300 hover:bg-primary-50/30 transition-all text-left"
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary-50 group-hover:bg-primary-100 flex items-center justify-center flex-shrink-0 transition-colors">
                                    <Stethoscope className="w-6 h-6 text-primary-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-lg">I'm a Doctor</h3>
                                    <p className="text-sm text-gray-500 mt-0.5">Manage practice, review reports, and see patients</p>
                                </div>
                            </button>
                        </div>
                        <p className="mt-8 text-center text-sm text-gray-600">
                            Already have an account? <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const renderPatientStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} placeholder="John Doe" className="w-full pl-11 pr-4 py-3 bg-white border-2 border-gray-100 rounded-xl focus:border-primary-500 focus:outline-none transition-all font-medium" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="john@example.com" className="w-full pl-11 pr-4 py-3 bg-white border-2 border-gray-100 rounded-xl focus:border-primary-500 focus:outline-none transition-all font-medium" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type={showPassword ? 'text' : 'password'} name="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full pl-11 pr-11 py-3 bg-white border-2 border-gray-100 rounded-xl focus:border-primary-500 focus:outline-none transition-all font-medium" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Date of Birth</label>
                                <input type="date" name="dob" required value={formData.dob} onChange={handleChange} className="w-full px-4 py-3 bg-white border-2 border-gray-100 rounded-xl focus:border-primary-500 focus:outline-none transition-all font-medium" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Gender</label>
                                <select name="gender" required value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 bg-white border-2 border-gray-100 rounded-xl focus:border-primary-500 focus:outline-none transition-colors font-medium">
                                    <option value="">Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Blood Group</label>
                                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-primary-500 focus:outline-none font-medium">
                                    <option value="">Select</option>
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Phone</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1..." className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-primary-500 focus:outline-none font-medium" />
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Emergency Name</label>
                            <input type="text" name="emergencyName" required value={formData.emergencyName} onChange={handleChange} placeholder="Contact Name" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none font-medium" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Emergency Phone</label>
                            <input type="tel" name="emergencyPhone" required value={formData.emergencyPhone} onChange={handleChange} placeholder="+1..." className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none font-medium" />
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    const renderDoctorStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Professional Name</label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} placeholder="Dr. Jane Smith" className="w-full pl-11 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-primary-500 focus:outline-none font-medium" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="doctor@example.com" className="w-full pl-11 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-primary-500 focus:outline-none font-medium" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type={showPassword ? 'text' : 'password'} name="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full pl-11 pr-11 py-3 border-2 border-gray-100 rounded-xl focus:border-primary-500 focus:outline-none font-medium" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Specialization</label>
                            <input type="text" name="specialization" required value={formData.specialization} onChange={handleChange} placeholder="Cardiology" className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-primary-500 focus:outline-none font-medium" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">License No.</label>
                                <input type="text" name="license" required value={formData.license} onChange={handleChange} placeholder="MD-123456" className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-primary-500 focus:outline-none font-medium" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Years Exp.</label>
                                <input type="number" name="experience" required value={formData.experience} onChange={handleChange} placeholder="10" className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-primary-500 focus:outline-none font-medium" />
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Hospital / Clinic</label>
                            <input type="text" name="clinicName" required value={formData.clinicName} onChange={handleChange} placeholder="City Medical" className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-primary-500 focus:outline-none font-medium" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Clinic Address</label>
                            <textarea name="clinicAddress" required value={formData.clinicAddress} onChange={handleChange} rows={2} placeholder="Address here..." className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none font-medium resize-none" />
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    const stepLabels = userType === 'patient'
        ? ['Account', 'General', 'Finalize']
        : ['Account', 'Credentials', 'Practice'];

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="relative w-full max-w-md">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                    <div className="text-center mb-6">
                        <Link to="/" className="inline-flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg"><Heart className="w-5 h-5 text-white" /></div>
                            <span className="text-2xl font-bold text-gray-900 tracking-tight">IASO<span className="text-primary-600">Med</span></span>
                        </Link>
                        <h1 className="mt-4 text-2xl font-bold text-gray-900">{userType === 'patient' ? 'Patient Join' : 'Doctor Join'}</h1>
                    </div>

                    <div className="flex gap-2 mb-8">
                        {stepLabels.map((l, i) => (
                            <div key={l} className="flex-1">
                                <div className={`h-1.5 rounded-full ${i + 1 <= step ? 'bg-primary-500' : 'bg-gray-200'}`} />
                                <p className={`text-[10px] mt-1 font-bold uppercase tracking-wider ${i + 1 <= step ? 'text-primary-600' : 'text-gray-400'}`}>{l}</p>
                            </div>
                        ))}
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm font-medium">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={step === totalSteps ? handleSubmit : (e) => { e.preventDefault(); setStep(step + 1); }}>
                        {userType === 'patient' ? renderPatientStep() : renderDoctorStep()}

                        <div className="flex gap-3 mt-8">
                            {step > 1 && (
                                <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-3 border-2 border-gray-100 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all flex items-center gap-2">
                                    <ArrowLeft className="w-4 h-4" />
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 py-3 bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isLoading ? 'Please wait...' : step === totalSteps ? 'Complete Signup' : 'Next Step'}
                                {!isLoading && (step === totalSteps ? <CheckCircle2 className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />)}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
