import { useState, useEffect } from 'react';
import { FileText, Search, Filter, ChevronRight, Loader2, Calendar, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function DoctorReportsReview() {
    const { user } = useAuth();
    const [reports, setReports] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (user) {
            fetchReports();
        }
    }, [user]);

    const fetchReports = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('reports')
                .select(`
                    *,
                    patient:patient_id (
                        id,
                        profiles:id (
                            full_name
                        )
                    )
                `)
                .eq('doctor_id', user?.id)
                .order('report_date', { ascending: false });

            if (error) throw error;
            setReports(data || []);
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredReports = reports.filter(report =>
        report.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.patient?.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-outfit">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Patient Reports</h1>
                    <p className="text-gray-500 mt-1 font-medium">Review and analyze reports assigned to you.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl border-2 border-gray-50 mb-8 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by report title or patient name..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-50 focus:border-primary-500 focus:ring-0 transition-all text-sm font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className="px-6 py-3 rounded-xl border-2 border-gray-50 text-gray-600 font-bold flex items-center gap-2 hover:bg-gray-50 transition-all text-sm">
                    <Filter className="w-4 h-4" />
                    Filters
                </button>
            </div>

            {isLoading ? (
                <div className="py-20 flex justify-center">
                    <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                </div>
            ) : filteredReports.length === 0 ? (
                <div className="py-24 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <FileText className="w-10 h-10 text-gray-200" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">No reports found</h3>
                    <p className="text-gray-500 mt-2 max-w-[320px] mx-auto font-medium">
                        Patient reports assigned to you for review will appear here.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredReports.map((report) => (
                        <div
                            key={report.id}
                            className="flex flex-col md:flex-row md:items-center gap-6 p-6 bg-white rounded-3xl border-2 border-gray-50 hover:border-primary-100 transition-all group"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform shadow-inner shrink-0 text-2xl font-black">
                                <FileText className="w-7 h-7" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors truncate">{report.title}</h3>
                                    <span className="px-2.5 py-0.5 rounded-lg bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                                        {report.report_type}
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    <div className="flex items-center gap-1.5">
                                        <User className="w-3.5 h-3.5" />
                                        {report.patient.profiles.full_name}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(report.report_date).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 md:ml-auto">
                                <div className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border ${report.status === 'pending'
                                        ? 'bg-amber-50 text-amber-600 border-amber-100'
                                        : 'bg-green-50 text-green-600 border-green-100'
                                    }`}>
                                    {report.status}
                                </div>
                                <Link
                                    to={`/doctor/reports/${report.id}`}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 group-hover:bg-primary-600 group-hover:text-white transition-all"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
