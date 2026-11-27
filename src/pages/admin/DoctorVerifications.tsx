import { useState, useEffect, useCallback } from 'react';
import {
    ShieldCheck,
    Clock,
    XCircle,
    FileText,
    CheckCircle2,
    ExternalLink,
    AlertCircle,
    Loader2,
    Stethoscope,
    Building2,
    Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

interface DoctorVerificationItem {
    id: string;
    specialization: string | null;
    experience_years: number | null;
    license_number: string | null;
    education: string | null;
    hospital_clinic: string | null;
    is_verified: boolean;
    review_status: string | null;
    verification_document_url: string | null;
    rejection_reason: string | null;
    verified_at: string | null;
    profiles?: {
        full_name?: string;
        email?: string;
    } | null;
}

type FilterTab = 'pending' | 'approved' | 'rejected' | 'all';

export default function DoctorVerifications() {
    const { user } = useAuth();
    const [doctors, setDoctors] = useState<DoctorVerificationItem[]>([]);
    const [activeTab, setActiveTab] = useState<FilterTab>('pending');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [rejectingId, setRejectingId] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const fetchDoctors = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data, error: fetchErr } = await supabase
                .from('doctors')
                .select(`
                    id,
                    specialization,
                    experience_years,
                    license_number,
                    education,
                    hospital_clinic,
                    is_verified,
                    review_status,
                    verification_document_url,
                    rejection_reason,
                    verified_at,
                    profiles:id (
                        full_name,
                        email
                    )
                `)
                .order('is_verified', { ascending: true });

            if (fetchErr) throw fetchErr;

            const normalized: DoctorVerificationItem[] = (data || []).map((row) => ({
                ...row,
                profiles: Array.isArray(row.profiles) ? row.profiles[0] : row.profiles,
            }));
            setDoctors(normalized);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to load doctor applications.';
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDoctors();
    }, [fetchDoctors]);

    const handleViewDocument = async (path: string) => {
        try {
            const { data, error: signErr } = await supabase.storage
                .from('doctor-credentials')
                .createSignedUrl(path, 120);

            if (signErr) throw signErr;
            if (data?.signedUrl) {
                window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Unable to generate secure link for document.';
            setError(msg);
        }
    };

    const handleApprove = async (doctorId: string) => {
        if (!user) return;
        setProcessingId(doctorId);
        setError(null);
        try {
            const nowIso = new Date().toISOString();
            const { error: updateErr } = await supabase
                .from('doctors')
                .update({
                    is_verified: true,
                    review_status: 'approved',
                    rejection_reason: null,
                    verified_at: nowIso,
                    verified_by: user.id,
                })
                .eq('id', doctorId);

            if (updateErr) throw updateErr;

            setDoctors((prev) =>
                prev.map((d) =>
                    d.id === doctorId
                        ? { ...d, is_verified: true, review_status: 'approved', rejection_reason: null, verified_at: nowIso }
                        : d
                )
            );
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to approve doctor.';
            setError(msg);
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (doctorId: string) => {
        if (!user) return;
        const trimmedReason = rejectionReason.trim();
        if (!trimmedReason) {
            setError('Please enter a brief rejection reason so the doctor can correct and resubmit.');
            return;
        }
        setProcessingId(doctorId);
        setError(null);
        try {
            const { error: updateErr } = await supabase
                .from('doctors')
                .update({
                    is_verified: false,
                    review_status: 'rejected',
                    rejection_reason: trimmedReason,
                    verified_at: null,
                    verified_by: user.id,
                })
                .eq('id', doctorId);

            if (updateErr) throw updateErr;

            setDoctors((prev) =>
                prev.map((d) =>
                    d.id === doctorId
                        ? { ...d, is_verified: false, review_status: 'rejected', rejection_reason: trimmedReason, verified_at: null }
                        : d
                )
            );
            setRejectingId(null);
            setRejectionReason('');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to reject doctor.';
            setError(msg);
        } finally {
            setProcessingId(null);
        }
    };

    const counts = {
        pending: doctors.filter((d) => !d.is_verified && d.review_status !== 'rejected').length,
        approved: doctors.filter((d) => d.is_verified || d.review_status === 'approved').length,
        rejected: doctors.filter((d) => d.review_status === 'rejected').length,
        all: doctors.length,
    };

    const filteredDoctors = doctors.filter((d) => {
        if (activeTab === 'pending') return !d.is_verified && d.review_status !== 'rejected';
        if (activeTab === 'approved') return d.is_verified || d.review_status === 'approved';
        if (activeTab === 'rejected') return d.review_status === 'rejected';
        return true;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-outfit">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Admin Verification Console
                    </div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Doctor Credential Approvals</h1>
                    <p className="text-gray-500 text-sm mt-1">Review medical licenses and verify clinicians before listing them in the patient directory.</p>
                </div>
                <button
                    onClick={fetchDoctors}
                    disabled={isLoading}
                    className="self-start md:self-auto px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    Refresh Queue
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 text-sm font-medium">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
                {(['pending', 'approved', 'rejected', 'all'] as FilterTab[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold capitalize transition-all border ${
                            activeTab === tab
                                ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-500/20'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-primary-200'
                        }`}
                    >
                        {tab} ({counts[tab]})
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center">
                    <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                    <p className="text-sm text-gray-400 mt-3 font-medium">Loading verification queue...</p>
                </div>
            ) : filteredDoctors.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <ShieldCheck className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <h2 className="text-lg font-bold text-gray-900">No applications in {activeTab}</h2>
                    <p className="text-sm text-gray-500 mt-1">All doctor verification requests matching this filter have been processed.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {filteredDoctors.map((doc) => {
                        const isApproved = doc.is_verified || doc.review_status === 'approved';
                        const isRejected = doc.review_status === 'rejected';
                        const statusBadge = isApproved ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-bold">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                            </span>
                        ) : isRejected ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-bold">
                                <XCircle className="w-3.5 h-3.5" /> Rejected
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold">
                                <Clock className="w-3.5 h-3.5" /> Pending Review
                            </span>
                        );

                        return (
                            <div key={doc.id} className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                    <div className="space-y-3 flex-1">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h3 className="text-xl font-bold text-gray-900">
                                                {doc.profiles?.full_name || 'Doctor Applicant'}
                                            </h3>
                                            {statusBadge}
                                        </div>
                                        <p className="text-sm text-gray-500">{doc.profiles?.email || 'No email recorded'}</p>

                                        <div className="grid sm:grid-cols-3 gap-4 pt-2">
                                            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                                <p className="text-[10px] font-bold uppercase text-gray-400 flex items-center gap-1">
                                                    <Stethoscope className="w-3 h-3 text-primary-500" /> Specialization
                                                </p>
                                                <p className="text-sm font-bold text-gray-900 mt-0.5">{doc.specialization || 'Not provided'}</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                                <p className="text-[10px] font-bold uppercase text-gray-400 flex items-center gap-1">
                                                    <Award className="w-3 h-3 text-primary-500" /> License Number
                                                </p>
                                                <p className="text-sm font-bold text-gray-900 mt-0.5">{doc.license_number || 'Not provided'}</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                                <p className="text-[10px] font-bold uppercase text-gray-400 flex items-center gap-1">
                                                    <Building2 className="w-3 h-3 text-primary-500" /> Clinic / Education
                                                </p>
                                                <p className="text-sm font-bold text-gray-900 mt-0.5 truncate">
                                                    {doc.hospital_clinic || doc.education || 'Not provided'}
                                                </p>
                                            </div>
                                        </div>

                                        {doc.rejection_reason && (
                                            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-700">
                                                <strong>Rejection Reason:</strong> {doc.rejection_reason}
                                            </div>
                                        )}
                                    </div>

                                    {/* Document + Actions */}
                                    <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 lg:w-60">
                                        {doc.verification_document_url ? (
                                            <button
                                                onClick={() => handleViewDocument(doc.verification_document_url!)}
                                                className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                                            >
                                                <FileText className="w-4 h-4 text-primary-600" />
                                                View Credential File
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </button>
                                        ) : (
                                            <div className="py-2.5 px-4 bg-gray-50 text-gray-400 rounded-xl text-xs font-semibold text-center border border-dashed border-gray-200">
                                                No document uploaded yet
                                            </div>
                                        )}

                                        {!isApproved && (
                                            <button
                                                onClick={() => handleApprove(doc.id)}
                                                disabled={processingId === doc.id}
                                                className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                                            >
                                                {processingId === doc.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                                Approve Doctor
                                            </button>
                                        )}

                                        {!isRejected && (
                                            <button
                                                onClick={() => {
                                                    setRejectingId(rejectingId === doc.id ? null : doc.id);
                                                    setRejectionReason(doc.rejection_reason || '');
                                                }}
                                                disabled={processingId === doc.id}
                                                className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                {isApproved ? 'Revoke / Reject' : 'Reject'}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {rejectingId === doc.id && (
                                    <div className="mt-5 pt-5 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                                        <input
                                            type="text"
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            placeholder="Enter reason for rejection (e.g., License number illegible or expired)..."
                                            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                                        />
                                        <button
                                            onClick={() => handleReject(doc.id)}
                                            disabled={processingId === doc.id}
                                            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-60"
                                        >
                                            Confirm Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
