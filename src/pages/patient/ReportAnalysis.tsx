import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Calendar, Brain, CheckCircle2, AlertTriangle, Printer, Loader2, FileText, Info } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function ReportAnalysis() {
    const { reportId } = useParams();
    const [report, setReport] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (reportId) {
            fetchReport();
        }
    }, [reportId]);

    const fetchReport = async () => {
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
        } catch (err: any) {
            console.error('Error fetching report:', err);
            setError('Failed to load report analysis.');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'normal': return { bg: 'bg-green-50', text: 'text-green-700', bar: 'bg-green-400', icon: CheckCircle2 };
            case 'warning': return { bg: 'bg-amber-50', text: 'text-amber-700', bar: 'bg-amber-400', icon: AlertTriangle };
            case 'critical': return { bg: 'bg-red-50', text: 'text-red-700', bar: 'bg-red-400', icon: AlertTriangle };
            default: return { bg: 'bg-gray-50', text: 'text-gray-700', bar: 'bg-gray-400', icon: Info };
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-primary-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Analyzing your report...</p>
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

    // AI placeholder findings for now
    const mockFindings = [
        { name: 'White Blood Cells (WBC)', value: '7.2', unit: '×10³/µL', range: '4.5 - 11.0', status: 'normal' },
        { name: 'Red Blood Cells (RBC)', value: '5.1', unit: '×10⁶/µL', range: '4.5 - 5.5', status: 'normal' },
        { name: 'Hemoglobin', value: '14.2', unit: 'g/dL', range: '13.5 - 17.5', status: 'normal' },
    ];

    const currentStatus = getStatusColor(report.status || 'normal');
    const StatusIcon = currentStatus.icon;

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
                            {report.report_type}
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{report.title}</h1>
                        <p className="text-gray-500 font-medium flex items-center gap-2 mt-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(report.report_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                            <span className="text-gray-300">•</span>
                            {report.hospital_clinic}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 md:ml-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white border-2 border-gray-50 text-gray-600 font-bold hover:bg-gray-50 transition-all text-sm">
                        <Download className="w-4 h-4" />
                        Download
                    </button>
                    <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border-2 border-gray-50 text-gray-600 hover:bg-gray-50 transition-all">
                        <Printer className="w-5 h-5" />
                    </button>
                    <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-all">
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
                                <span className="ml-auto px-3.5 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/30">
                                    98% Confidence Level
                                </span>
                            </div>
                            <p className="text-primary-50 text-lg font-medium leading-relaxed italic opacity-95">
                                "{report.notes || 'No specific notes were added for this report. The AI analysis indicates that your vital markers are in a healthy equilibrium. Continue your current health regimen and schedule periodic checkups.'}"
                            </p>
                        </div>
                    </div>

                    {/* Findings Detail */}
                    <div className="bg-white rounded-[2.5rem] border-2 border-gray-50 p-8 shadow-xl shadow-gray-100/50">
                        <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                            Patient Results Breakdown
                            <span className="text-gray-300 text-xs font-normal">|</span>
                            <span className="text-sm text-gray-400 font-bold uppercase tracking-widest">3 Markers Analyzed</span>
                        </h2>

                        <div className="space-y-6">
                            {mockFindings.map((finding) => {
                                const colors = getStatusColor(finding.status);
                                return (
                                    <div key={finding.name} className="group p-6 rounded-3xl bg-gray-50/50 border-2 border-transparent hover:border-primary-100 hover:bg-white transition-all cursor-default">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="space-y-1">
                                                <span className="text-sm font-bold text-gray-900">{finding.name}</span>
                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Reference: {finding.range} {finding.unit}</p>
                                            </div>
                                            <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest ${colors.bg} ${colors.text} border border-current/10`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${colors.bar.replace('bg-', 'bg-')}`} />
                                                {finding.status}
                                            </div>
                                        </div>
                                        <div className="flex items-end gap-3">
                                            <span className="text-3xl font-black text-gray-900 tracking-tight">{finding.value}</span>
                                            <span className="text-sm text-gray-400 font-bold mb-1.5 uppercase tracking-widest">{finding.unit}</span>
                                            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden ml-4 mb-2.5">
                                                <div className={`h-full ${colors.bar} rounded-full transition-all duration-1000`} style={{ width: '65%' }} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Overall Summary Card */}
                    <div className="bg-white rounded-[2.5rem] border-2 border-gray-50 p-8 text-center shadow-xl shadow-gray-100/50">
                        <div className={`w-20 h-20 rounded-3xl ${currentStatus.bg} flex items-center justify-center mx-auto mb-6 shadow-inner`}>
                            <StatusIcon className={`w-10 h-10 ${currentStatus.text}`} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Status: {report.status || 'Verified'}</h3>
                        <p className="text-gray-500 font-medium leading-relaxed">Everything looks optimal in this analysis based on standard medical benchmarks.</p>
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
