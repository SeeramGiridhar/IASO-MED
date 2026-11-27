import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Star, ChevronRight, Camera, Stethoscope, Award, Building2, DollarSign, LogOut, Loader2, Globe, ShieldCheck, AlertCircle, Upload, Clock, XCircle, CheckCircle2, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

interface DoctorProfileData {
    specialization?: string;
    experience_years?: number;
    license_number?: string;
    education?: string;
    bio?: string;
    hospital_clinic?: string;
    consultation_fee?: number;
    rating?: number;
    is_verified?: boolean;
    review_status?: string;
    verification_document_url?: string | null;
    rejection_reason?: string | null;
    profiles?: {
        full_name?: string;
        email?: string;
        avatar_url?: string;
    } | null;
}

export default function DoctorProfile() {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState<DoctorProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [licenseInput, setLicenseInput] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSubmittingCreds, setIsSubmittingCreds] = useState(false);
    const [credMessage, setCredMessage] = useState<string | null>(null);

    const fetchDoctorProfile = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        setError(null);
        try {
            const { data, error: fetchErr } = await supabase
                .from('doctors')
                .select(`
                    specialization,
                    experience_years,
                    license_number,
                    education,
                    bio,
                    hospital_clinic,
                    consultation_fee,
                    rating,
                    is_verified,
                    review_status,
                    verification_document_url,
                    rejection_reason,
                    profiles:id (
                        full_name,
                        email,
                        avatar_url
                    )
                `)
                .eq('id', user.id)
                .single();

            if (fetchErr) throw fetchErr;
            const profileRecord = Array.isArray(data?.profiles) ? data.profiles[0] : data?.profiles;
            setProfile({
                ...data,
                profiles: profileRecord || null,
            });
            setLicenseInput(data?.license_number || '');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Error fetching doctor profile';
            console.error('Error fetching doctor profile:', msg);
            setError('Failed to load profile. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    const handleCredentialSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        if (!licenseInput.trim()) {
            setCredMessage('Please enter your medical license number.');
            return;
        }

        setIsSubmittingCreds(true);
        setCredMessage(null);
        try {
            let documentPath = profile?.verification_document_url || null;

            if (selectedFile) {
                const fileExt = selectedFile.name.split('.').pop()?.toLowerCase() || 'pdf';
                const path = `${user.id}/license-${Date.now()}.${fileExt}`;
                const { error: uploadErr } = await supabase.storage
                    .from('doctor-credentials')
                    .upload(path, selectedFile, { upsert: true });
                if (uploadErr) throw uploadErr;
                documentPath = path;
            }

            const { error: updateErr } = await supabase
                .from('doctors')
                .update({
                    license_number: licenseInput.trim(),
                    verification_document_url: documentPath,
                    review_status: 'pending',
                })
                .eq('id', user.id);

            if (updateErr) throw updateErr;

            setSelectedFile(null);
            setCredMessage('Credentials submitted for admin verification.');
            await fetchDoctorProfile();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to submit verification documents.';
            setCredMessage(msg);
        } finally {
            setIsSubmittingCreds(false);
        }
    };

    useEffect(() => {
        fetchDoctorProfile();
    }, [fetchDoctorProfile]);

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto px-4 py-20 text-center font-outfit">
                <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Profile</h1>
                <p className="text-gray-500 mb-8">{error}</p>
                <button
                    onClick={fetchDoctorProfile}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-lg"
                >
                    Retry
                </button>
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
                        <p className="text-primary-600 font-bold uppercase tracking-widest text-xs mb-8">{profile?.specialization || 'Not provided'}</p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-gray-50 rounded-3xl p-5 border-2 border-white">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Experience</p>
                                <p className="text-xl font-black text-gray-900">
                                    {profile?.experience_years != null ? `${profile.experience_years} Yrs` : 'Not provided'}
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded-3xl p-5 border-2 border-white">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Rating</p>
                                <div className="flex items-center justify-center gap-1 font-black text-gray-900 text-base">
                                    {profile?.rating != null && Number(profile.rating) > 0 ? (
                                        <>
                                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                            <span className="text-xl">{Number(profile.rating).toFixed(1)}</span>
                                        </>
                                    ) : (
                                        <span className="text-sm font-semibold text-gray-500">No reviews yet</span>
                                    )}
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
                    {/* Verification Status Banner */}
                    {profile?.is_verified || profile?.review_status === 'approved' ? (
                        <div className="p-6 bg-green-50 border border-green-200 rounded-[2rem] flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-green-900">Verified Clinician</h3>
                                <p className="text-sm text-green-700">Your medical credentials are approved. Patients can discover your profile and book consultations.</p>
                            </div>
                        </div>
                    ) : profile?.review_status === 'rejected' ? (
                        <div className="p-6 bg-red-50 border border-red-200 rounded-[2rem] flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                                <XCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-red-900">Verification Needs Attention</h3>
                                <p className="text-sm text-red-700 mt-0.5">
                                    {profile.rejection_reason || 'Your verification request was declined. Please update your license information and upload a clear credential document below.'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 bg-amber-50 border border-amber-200 rounded-[2rem] flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-amber-900">Admin Verification Pending</h3>
                                <p className="text-sm text-amber-800 mt-0.5">
                                    Submit your medical license number and credential certificate below so an administrator can approve your profile for patient bookings.
                                </p>
                            </div>
                        </div>
                    )}

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
                                    {profile?.license_number || 'Not provided'}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Award className="w-4 h-4 text-primary-500" />
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Educational Background</p>
                                </div>
                                <div className="bg-gray-50 p-5 rounded-2xl text-gray-900 font-bold border-2 border-white">
                                    {profile?.education || 'Not provided'}
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 space-y-4">
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-blue-500" />
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Professional Biography</p>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-[2rem] text-gray-600 text-sm font-medium leading-relaxed border-2 border-white">
                                {profile?.bio || 'Not provided'}
                            </div>
                        </div>

                        {/* Credential Submission Form */}
                        <form onSubmit={handleCredentialSubmit} className="mt-10 pt-8 border-t border-gray-100 space-y-5">
                            <div>
                                <h4 className="text-base font-bold text-gray-900">Submit / Update Verification Credentials</h4>
                                <p className="text-xs text-gray-500 mt-1">Upload your medical registration certificate or board license (PDF, PNG, or JPG).</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">License Number</label>
                                    <input
                                        type="text"
                                        value={licenseInput}
                                        onChange={(e) => setLicenseInput(e.target.value)}
                                        placeholder="e.g. MCI-123456"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Credential Document</label>
                                    <label className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary-400 transition-colors">
                                        <Upload className="w-4 h-4 text-primary-600 shrink-0" />
                                        <span className="text-xs font-semibold text-gray-600 truncate">
                                            {selectedFile ? selectedFile.name : profile?.verification_document_url ? 'Replace uploaded document' : 'Choose PDF or Image...'}
                                        </span>
                                        <input
                                            type="file"
                                            accept=".pdf,image/png,image/jpeg,image/webp"
                                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                            className="hidden"
                                        />
                                    </label>
                                    {profile?.verification_document_url && !selectedFile && (
                                        <p className="text-[11px] text-green-600 font-semibold mt-1 flex items-center gap-1">
                                            <FileText className="w-3 h-3" /> Document on file
                                        </p>
                                    )}
                                </div>
                            </div>

                            {credMessage && (
                                <p className="text-xs font-semibold text-primary-700 bg-primary-50 px-4 py-2.5 rounded-xl border border-primary-100">
                                    {credMessage}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmittingCreds}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-60"
                            >
                                {isSubmittingCreds ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                                Submit for Verification
                            </button>
                        </form>
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
                                    {profile?.hospital_clinic || 'Not provided'}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Consultation Fee</p>
                                <div className="bg-primary-600 p-5 rounded-2xl text-white font-black text-xl flex items-center gap-3 shadow-lg shadow-primary-500/20">
                                    <DollarSign className="w-6 h-6 bg-white/20 rounded-lg p-1" />
                                    {profile?.consultation_fee != null ? `$${profile.consultation_fee}` : 'Not provided'}
                                    <span className="text-xs font-bold text-white/60 ml-auto uppercase tracking-tighter">Per Session</span>
                                </div>
                            </div>
                        </div>

                        <Link
                            to="/doctor/schedule"
                            className="w-full py-6 bg-gray-900 text-white rounded-[1.8rem] font-bold hover:bg-primary-600 transition-all flex items-center justify-center gap-4 group shadow-xl shadow-gray-200"
                        >
                            <Stethoscope className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            Manage Clinical Schedule & Availability
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
