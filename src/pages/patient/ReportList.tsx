import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Database, FileText, Calendar, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { clsx } from 'clsx';

export default function ReportList() {
    const { user } = useAuth();
    const [reports, setReports] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        if (!user) return;
        fetchReports();
    }, [user]);

    const fetchReports = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data, error: fetchError } = await supabase
                .from('reports')
                .select('*')
                .eq('patient_id', user?.id)
                .order('report_date', { ascending: false });

            if (fetchError) throw fetchError;
            setReports(data || []);
        } catch (err: any) {
            console.error('Error fetching reports:', err);
            setError('Failed to load reports. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredReports = reports.filter(report => {
        const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'All' || report.category === filterType;
        const matchesStatus = filterStatus === 'All' || report.status === filterStatus.toLowerCase();
        return matchesSearch && matchesType && matchesStatus;
    });

    const reportTypes = ['All', 'Blood Test', 'X-Ray', 'MRI / CT Scan', 'Prescription', 'Lab Report', 'Other'];

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-primary-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Loading your medical archive...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">My Medical Reports</h1>
                    <p className="text-gray-500 mt-1">Stored securely and analyzed with AI</p>
                </div>
                <Link
                    to="/patient/upload"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Upload New
                </Link>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    <p className="font-medium">{error}</p>
                    <button onClick={fetchReports} className="ml-auto text-sm font-bold underline">Retry</button>
                </div>
            )}

            {/* Filters */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="lg:col-span-2 relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search reports by name or hospital..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                    />
                </div>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-4 py-3 border-2 border-gray-100 rounded-xl text-gray-600 focus:border-primary-500 focus:outline-none transition-colors">
                    {reportTypes.map(type => <option key={type} value={type}>{type === 'All' ? 'All Types' : type}</option>)}
                </select>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-3 border-2 border-gray-100 rounded-xl text-gray-600 focus:border-primary-500 focus:outline-none transition-colors">
                    <option value="All">All Status</option>
                    <option value="Analyzed">Analyzed</option>
                    <option value="Pending">Pending</option>
                </select>
            </div>

            {/* Report Grid / Empty State */}
            {filteredReports.length === 0 ? (
                <div className="py-24 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Database className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {reports.length === 0 ? 'Your medical archive is empty' : 'No matching reports found'}
                    </h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-8">
                        {reports.length === 0
                            ? 'Keep all your medical history in one place. Upload a report to get started with AI-powered insights.'
                            : 'Try adjusting your search or filters to find what you are looking for.'}
                    </p>
                    {reports.length === 0 && (
                        <Link to="/patient/upload" className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 shadow-xl shadow-primary-500/20 transition-all">
                            <Plus className="w-5 h-5" />
                            Upload Your First Report
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredReports.map((report) => (
                        <Link
                            key={report.id}
                            to={`/patient/reports/${report.id}`}
                            className="group bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-xl hover:shadow-gray-100/50 hover:border-primary-100 transition-all"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                                    <FileText className="w-6 h-6 text-primary-600" />
                                </div>
                                <div className={clsx(
                                    "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                    report.status === 'analyzed' ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                                )}>
                                    {report.status}
                                </div>
                            </div>
                            <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors truncate">{report.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{report.category}</p>

                            <div className="mt-6 flex items-center justify-between text-xs text-gray-400 font-medium">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {new Date(report.report_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                                <div className="flex items-center gap-1 text-primary-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                    View Details <ChevronRight className="w-3 h-3" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
