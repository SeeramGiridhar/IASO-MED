import { useState, useEffect } from 'react';
import { Star, ChevronRight, Camera, Stethoscope, Award, Building2, DollarSign, LogOut, Loader2, Globe, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

export default function DoctorProfile() {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchDoctorProfile();
        }
    }, [user]);

    const fetchDoctorProfile = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('doctors')
                .select(`
                    *,
                    profiles:id (
                        full_name,
                        email,
                        avatar_url
                    )
                `)
                .eq('id', user?.id)
                .single();

            if (error) throw error;
            setProfile(data);
        } catch (error) {
            console.error('Error fetching doctor profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
            </div>
        );
    }

    const doctorName = profile?.profiles?.full_name || user?.name || 'Doctor';

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 font-outfit">
            <div className="grid lg:grid-cols-12 gap-10">
                {/* Left Column: Core Identity Card */}
                <div className="lg:col-span-4">
                    <div className="bg-white rounded-[3rem] border-2 border-gray-50 p-10 shadow-xl shadow-gray-200/50 text-center sticky top-24">
                        <div className="relative inline-block mb-8">
                            <div className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-br from-primary-500 to-primary-800 p-1 shadow-2xl shadow-primary-500/30">
                                <div className="w-full h-full rounded-[2.3rem] bg-white flex items-center justify-center overflow-hidden">
                                    {profile?.profiles?.avatar_url ? (
                                        <img src={profile.profiles.avatar_url} className="w-full h-full object-cover" alt={doctorName} />
                                    ) : (
                                        <span className="text-5xl font-black text-primary-600 bg-primary-50 w-full h-full flex items-center justify-center">
                                            {doctorName.split(' ').pop()?.[0]}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary-600 text-white border-4 border-white rounded-2xl shadow-xl flex items-center justify-center hover:bg-primary-700 transition-all hover:scale-110">
                                <Camera className="w-5 h-5" />
                            </button>
                        </div>

                        <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Dr. {doctorName.split(' ').pop()}</h2>
                        <p className="text-primary-600 font-bold uppercase tracking-widest text-xs mb-8">{profile?.specialization || 'Healthcare Professional'}</p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-gray-50 rounded-3xl p-5 border-2 border-white">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Experience</p>
                                <p className="text-xl font-black text-gray-900">{profile?.experience_years || '--'} Yrs</p>
                            </div>
                            <div className="bg-gray-50 rounded-3xl p-5 border-2 border-white">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Rating</p>
                                <div className="flex items-center justify-center gap-1 font-black text-gray-900 text-xl">
                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                    {profile?.rating || '4.9'}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={logout}
                            className="w-full flex items-center justify-center gap-3 p-5 text-gray-400 font-bold hover:text-red-600 hover:bg-red-50 rounded-3xl transition-all group"
                        >
                            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span>Sign Out Practice</span>
                        </button>
                    </div>
                </div>

                {/* Right Column: Detailed Info */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Credentials Section */}
                    <div className="bg-white rounded-[3rem] border-2 border-gray-50 p-10 shadow-xl shadow-gray-100/30">
                        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50">
                            <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600">
                                <Award className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Credentials & Licensing</h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-green-500" />
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Medical License Number</p>
                                </div>
                                <div className="bg-gray-50 p-5 rounded-2xl text-gray-900 font-bold border-2 border-white">
                                    {profile?.license_number || 'Verification Pending'}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Award className="w-4 h-4 text-primary-500" />
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Educational Background</p>
                                </div>
                                <div className="bg-gray-50 p-5 rounded-2xl text-gray-900 font-bold border-2 border-white">
                                    {profile?.education || 'MBBS, Specialized Residency'}
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 space-y-4">
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-blue-500" />
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Professional Biography</p>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-[2rem] text-gray-600 text-sm font-medium leading-relaxed border-2 border-white italic">
                                "{profile?.bio || 'Clinical professional focused on providing high-quality patient care and diagnostic excellence through IASO Med AI-augmented analysis.'}"
                            </div>
                        </div>
                    </div>

                    {/* Practice Details Selection */}
                    <div className="bg-white rounded-[3rem] border-2 border-gray-50 p-10 shadow-xl shadow-gray-100/30">
                        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50">
                            <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Practice Information</h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-10 mb-10">
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Clinic Affiliation</p>
                                <div className="bg-gray-50 p-5 rounded-2xl text-gray-900 font-bold border-2 border-white flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-primary-500" />
                                    {profile?.hospital_clinic || 'Private Healthcare Provider'}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Consultation Fee</p>
                                <div className="bg-primary-600 p-5 rounded-2xl text-white font-black text-xl flex items-center gap-3 shadow-lg shadow-primary-500/20">
                                    <DollarSign className="w-6 h-6 bg-white/20 rounded-lg p-1" />
                                    ${profile?.consultation_fee || '100'}
                                    <span className="text-xs font-bold text-white/60 ml-auto uppercase tracking-tighter">Per Session</span>
                                </div>
                            </div>
                        </div>

                        <button className="w-full py-6 bg-gray-900 text-white rounded-[1.8rem] font-bold hover:bg-primary-600 transition-all flex items-center justify-center gap-4 group shadow-xl shadow-gray-200">
                            <Stethoscope className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            Manage Clinical Schedule & Availability
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
