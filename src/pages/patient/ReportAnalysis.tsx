import { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Calendar, Brain, CheckCircle2, AlertTriangle, Printer, Loader2, FileText, Info, Paperclip } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface MarkerItem {
    name: string;
    value: string;
    unit?: string;
    range?: string;
    status: 'normal' | 'warning' | 'critical';
}

interface AIAnalysisPayload {
    summary?: string;
    keyFindings?: string[];
    recommendations?: string[];
    markers?: MarkerItem[];
    severity?: 'normal' | 'warning' | 'critical';
}

interface ReportDetail {
    id: string;
    title: string;
    category?: string;
    report_type?: string;
    report_date: string;
    file_url?: string;
    file_urls?: string[];
    notes?: string;
    patient_notes?: string;
    ai_summary?: string;
    ai_analysis?: AIAnalysisPayload | null;
    status: string;
    hospital_clinic?: string;
}

export default function ReportAnalysis() {
    const { reportId } = useParams();
    const [report, setReport] = useState<ReportDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [downloading, setDownloading] = useState(false);

    const fetchReport = useCallback(async () => {
        if (!reportId) return;
        setIsLoading(true);
        setError(null);
        try {
            const { data, error: fetchError } = await supabase
                .from('reports')
                .select('*')
                .eq('id', reportId)
                .single();

            if (fetchError) throw fetchError;
            setReport(data);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to load report analysis.';
            console.error('Error fetching report:', msg);
            setError('Failed to load report analysis.');
        } finally {
            setIsLoading(false);
        }
    }, [reportId]);

    useEffect(() => {
        fetchReport();
    }, [fetchReport]);

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'normal': return { bg: 'bg-green-50', text: 'text-green-700', bar: 'bg-green-400', icon: CheckCircle2 };
            case 'warning': return { bg: 'bg-amber-50', text: 'text-amber-700', bar: 'bg-amber-400', icon: AlertTriangle };
            case 'critical': return { bg: 'bg-red-50', text: 'text-red-700', bar: 'bg-red-400', icon: AlertTriangle };
            default: return { bg: 'bg-gray-50', text: 'text-gray-700', bar: 'bg-gray-400', icon: Info };
        }
    };

    const handlePrint = () => {
        window.print();
    };

    // Authorized download using short-lived signed URLs for private storage bucket
    const handleDownload = async (targetPath?: string) => {
        const filePath = targetPath || report?.file_url;
        if (!filePath) return;

        setDownloading(true);
        try {
            const { data, error: signError } = await supabase.storage
                .from('medical-reports')
                .createSignedUrl(filePath, 120, { download: true });

            if (signError) throw signError;
            if (data?.signedUrl) {
                window.open(data.signedUrl, '_blank');
            }
        } catch (err) {
            console.error('Download error:', err);
            alert('Failed to generate secure download link. Please check your permissions.');
        } finally {
            setDownloading(false);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: report?.title || 'Medical Report',
                text: `Medical report: ${report?.title}`,
                url: window.location.href,
            }).catch(() => {});
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Report link copied to clipboard!');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-primary-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Loading report details...</p>
                </div>
            </div>
        );
    }

    if (!report || error) {
        return (
            <div className="max-w-md mx-auto px-4 py-20 text-center font-outfit">
                <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Report Not Found</h1>
                <p className="text-gray-500 mb-8">{error || 'This report may have been deleted or is inaccessible.'}</p>
                <Link to="/patient/reports" className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-lg">
                    Back to Reports
                </Link>
            </div>
        );
    }

    const analysis = report.ai_analysis;
    const hasValidAnalysis = Boolean(
        analysis && (
            (analysis.summary && analysis.summary.trim().length > 0) ||
            (analysis.keyFindings && analysis.keyFindings.length > 0) ||
            (analysis.markers && analysis.markers.length > 0)
        )
    );

    const currentStatus = getStatusColor(hasValidAnalysis ? (report.status || 'normal') : 'pending');
    const StatusIcon = currentStatus.icon;

    // Attachments list
    const attachments = report.file_urls && report.file_urls.length > 0 
        ? report.file_urls 
        : report.file_url 
            ? [report.file_url] 
            : [];

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-outfit">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10 pb-10 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <Link to="/patient/reports" className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border-2 border-gray-50 text-gray-400 hover:text-primary-600 hover:border-primary-100 transition-all group">
                        <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 text-primary-600 text-xs font-bold uppercase tracking-widest mb-1">
                            <FileText className="w-3.5 h-3.5" />
                            {report.report_type || report.category || 'Clinical Report'}
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{report.title}</h1>
                        <p className="text-gray-500 font-medium flex items-center gap-2 mt-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(report.report_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                            {report.hospital_clinic && (
                                <>
                                    <span className="text-gray-300">•</span>
                                    {report.hospital_clinic}
                                </>
                            )}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 md:ml-auto">
                    <button
                        onClick={() => handleDownload()}
                        disabled={downloading}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white border-2 border-gray-50 text-gray-600 font-bold hover:bg-gray-50 transition-all text-sm disabled:opacity-50"
                    >
                        {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        Download
                    </button>
                    <button
                        onClick={handlePrint}
                        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border-2 border-gray-50 text-gray-600 hover:bg-gray-50 transition-all"
                        title="Print Report"
                    >
                        <Printer className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleShare}
                        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-all"
                        title="Share Report"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Insights Box */}
                    <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-primary-500/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                                    <Brain className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-lg font-bold tracking-tight">Intelligence Breakdown</h2>
                                {hasValidAnalysis ? (
                                    <span className="ml-auto px-3.5 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/30">
                                        AI Verified
                                    </span>
                                ) : (
                                    <span className="ml-auto px-3.5 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/30 text-amber-200">
                                        Analysis Unavailable
                                    </span>
                                )}
                            </div>

                            {hasValidAnalysis ? (
                                <>
                                    <p className="text-primary-50 text-lg font-medium leading-relaxed italic opacity-95">
                                        "{analysis?.summary || report.ai_summary}"
                                    </p>

                                    {analysis?.recommendations && analysis.recommendations.length > 0 && (
                                        <div className="mt-6 pt-6 border-t border-white/20">
                                            <p className="text-xs font-bold uppercase tracking-widest text-primary-200 mb-3">Recommendations & Next Steps</p>
                                            <ul className="space-y-2">
                                                {analysis.recommendations.map((rec, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-primary-50">
                                                        <span className="text-primary-300 font-bold">•</span>
                                                        <span>{rec}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => {
                                            window.dispatchEvent(new CustomEvent('open-iaso-chat', {
                                                detail: { message: `I have a question about my ${report.report_type || 'medical'} report: ${report.title}. Can you explain it more?` }
                                            }));
                                        }}
                                        className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white text-sm font-bold transition-all border border-white/20"
                                    >
                                        Ask IASO AI for more details
                                        <ArrowLeft className="w-4 h-4 rotate-180" />
                                    </button>
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-primary-100 text-base font-medium leading-relaxed">
                                        Automated AI analysis is unavailable for this document. You can download the uploaded report below to review it directly or share it with a doctor during consultation.
                                    </p>
                                    <button
                                        onClick={() => handleDownload()}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-primary-700 rounded-xl font-bold text-sm hover:bg-primary-50 transition-all shadow-md"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download Report Document
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Patient Notes (if provided by patient) */}
                    {(report.patient_notes || report.notes) && (
                        <div className="bg-white rounded-[2.5rem] border-2 border-gray-50 p-8 shadow-xl shadow-gray-100/50">
                            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary-600" />
                                Patient Notes & Clinical Context
                            </h2>
                            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line bg-gray-50/60 p-4 rounded-2xl border border-gray-100">
                                {report.patient_notes || report.notes}
                            </p>
                        </div>
                    )}

                    {/* Multi-File Attachments */}
                    {attachments.length > 1 && (
                        <div className="bg-white rounded-[2.5rem] border-2 border-gray-50 p-8 shadow-xl shadow-gray-100/50">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Paperclip className="w-5 h-5 text-primary-600" />
                                Report Attachments ({attachments.length})
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {attachments.map((path, idx) => {
                                    const fileName = path.split('/').pop() || `Attachment ${idx + 1}`;
                                    return (
                                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <FileText className="w-5 h-5 text-primary-500 shrink-0" />
                                                <span className="text-xs font-bold text-gray-700 truncate">{fileName}</span>
                                            </div>
                                            <button
                                                onClick={() => handleDownload(path)}
                                                className="p-2 text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                                                title="Download Attachment"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Findings Detail - Dynamic & Truthful Only */}
                    <div className="bg-white rounded-[2.5rem] border-2 border-gray-50 p-8 shadow-xl shadow-gray-100/50">
                        <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                            Patient Results Breakdown
                            <span className="text-gray-300 text-xs font-normal">|</span>
                            <span className="text-sm text-gray-400 font-bold uppercase tracking-widest">
                                {hasValidAnalysis ? 'Report Findings' : 'Status'}
                            </span>
                        </h2>

                        {analysis?.markers && analysis.markers.length > 0 ? (
                            <div className="space-y-6">
                                {analysis.markers.map((marker, idx) => {
                                    const colors = getStatusColor(marker.status);
                                    return (
                                        <div key={idx} className="group p-6 rounded-3xl bg-gray-50/50 border-2 border-transparent hover:border-primary-100 hover:bg-white transition-all cursor-default">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="space-y-1">
                                                    <span className="text-sm font-bold text-gray-900">{marker.name}</span>
                                                    {marker.range && (
                                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Reference: {marker.range} {marker.unit || ''}</p>
                                                    )}
                                                </div>
                                                <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest ${colors.bg} ${colors.text} border border-current/10`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${colors.bar}`} />
                                                    {marker.status}
                                                </div>
                                            </div>
                                            <div className="flex items-end gap-3">
                                                <span className="text-3xl font-black text-gray-900 tracking-tight">{marker.value}</span>
                                                {marker.unit && (
                                                    <span className="text-sm text-gray-400 font-bold mb-1.5 uppercase tracking-widest">{marker.unit}</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : analysis?.keyFindings && analysis.keyFindings.length > 0 ? (
                            <div className="space-y-4">
                                {analysis.keyFindings.map((finding, idx) => (
                                    <div key={idx} className="p-5 rounded-2xl bg-gray-50/70 border border-gray-100 flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm shrink-0">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-gray-900">{finding}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-400">
                                    <Info className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">Analysis Unavailable</h3>
                                <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
                                    No automated biomarkers or findings were generated for this report. Please consult with a doctor to review the original document.
                                </p>
                                <button
                                    onClick={() => handleDownload()}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-primary-700 transition-all shadow-md"
                                >
                                    <Download className="w-4 h-4" />
                                    Download Document
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Overall Summary Card */}
                    <div className="bg-white rounded-[2.5rem] border-2 border-gray-50 p-8 text-center shadow-xl shadow-gray-100/50">
                        <div className={`w-20 h-20 rounded-3xl ${currentStatus.bg} flex items-center justify-center mx-auto mb-6 shadow-inner`}>
                            <StatusIcon className={`w-10 h-10 ${currentStatus.text}`} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
                            Status: {hasValidAnalysis ? (report.status || 'Verified') : 'Pending Review'}
                        </h3>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            {hasValidAnalysis 
                                ? 'Analysis generated from submitted medical documentation.' 
                                : 'Awaiting clinical review or doctor evaluation.'}
                        </p>
                    </div>

                    {/* Action Card */}
                    <Link
                        to="/patient/doctors"
                        className="group flex flex-col gap-4 p-8 bg-white border-2 border-primary-100 rounded-[2.5rem] transition-all hover:bg-primary-50 hover:shadow-2xl hover:shadow-primary-600/10"
                    >
                        <div className="w-12 h-12 bg-primary-600 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-700 transition-colors tracking-tight">Doctor Consultation</h3>
                            <p className="text-sm text-gray-500 font-medium mt-1 leading-relaxed">Book a session with a specialist to discuss these results.</p>
                        </div>
                        <div className="mt-2 text-primary-600 p-2 rounded-xl bg-primary-100/50 self-end transition-all group-hover:bg-primary-600 group-hover:text-white">
                            <ArrowLeft className="w-5 h-5 rotate-180" />
                        </div>
                    </Link>

                    {/* AI Disclaimer */}
                    <div className="p-6 bg-amber-50 rounded-[2rem] border-2 border-amber-100/50">
                        <div className="flex gap-4">
                            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold text-amber-800 uppercase tracking-widest">Medical Disclaimer</h4>
                                <p className="text-xs text-amber-700/80 font-medium leading-relaxed">
                                    IASO Med AI analysis is an assistive tool. Professional clinical review by a certified doctor is always required for diagnosis and treatment.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
