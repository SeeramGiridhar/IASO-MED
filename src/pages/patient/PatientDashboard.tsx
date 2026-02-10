import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FileText,
    Calendar,
    Upload,
    Heart,
    Activity,
    Droplets,
    Brain,
    ChevronRight,
    Loader2,
    Clock,
    ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

export default function PatientDashboard() {
    const { user } = useAuth();
    const [recentReports, setRecentReports] = useState<any[]>([]);
    const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            // Fetch recent reports
            const { data: reportsData } = await supabase
                .from('reports')
                .select('*')
                .eq('patient_id', user?.id)
                .order('report_date', { ascending: false })
                .limit(3);

            // Fetch upcoming appointments
            const { data: apptData } = await supabase
                .from('appointments')
                .select(`
                    *,
                    doctor:doctor_id (
                        id,
                        specialization,
                        profiles:id (
                            full_name,
                            avatar_url
                        )
                    )
                `)
                .eq('patient_id', user?.id)
                .gte('appointment_date', new Date().toISOString())
                .order('appointment_date', { ascending: true })
                .limit(3);

            setRecentReports(reportsData || []);
            setUpcomingAppointments(apptData || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const healthMetrics: any[] = [
        { label: 'Heart Rate', value: '72', unit: 'bpm', icon: Heart, trend: 'stable', color: 'text-red-500', bg: 'bg-red-50' },
        { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: Activity, trend: 'stable', color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Blood Sugar', value: '95', unit: 'mg/dL', icon: Droplets, trend: 'stable', color: 'text-amber-500', bg: 'bg-amber-50' },
        { label: 'SpO2', value: '98', unit: '%', icon: Activity, trend: 'stable', color: 'text-green-500', bg: 'bg-green-50' },
    ];

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-outfit">
            {/* Welcome Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                        Hello, <span className="text-primary-600">{user?.name?.split(' ')[0] || 'Patient'}</span> 👋
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium">Your health journey is looking great today.</p>
                </div>
                <Link
                    to="/patient/upload"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white font-bold rounded-2xl hover:bg-primary-700 shadow-xl shadow-primary-500/30 transform hover:-translate-y-0.5 transition-all text-sm"
                >
                    <Upload className="w-5 h-5" />
                    Upload New Report
                </Link>
            </div>

            {/* Health Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {healthMetrics.map((metric: any) => (
                    <div key={metric.label} className="bg-white rounded-[2rem] border-2 border-gray-50 p-6 hover:shadow-2xl hover:shadow-gray-100/50 transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-2xl ${metric.bg} flex items-center justify-center shadow-inner`}>
                                <metric.icon className={`w-6 h-6 ${metric.color}`} />
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">
                                <ArrowUpRight className="w-3 h-3" />
                                +2%
                            </div>
                        </div>
                        <p className="text-3xl font-black text-gray-900 tracking-tighter">
                            {metric.value} <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{metric.unit}</span>
                        </p>
                        <p className="text-sm text-gray-500 font-bold mt-1 uppercase tracking-widest opacity-60">{metric.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
                {/* Recent Reports */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Recent Analysis</h2>
                        <Link to="/patient/reports" className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 group">
                            View All <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                    <div className="grid gap-4">
                        {recentReports.length === 0 ? (
                            <div className="py-16 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
                                <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                <h3 className="text-gray-900 font-bold text-lg">No reports yet</h3>
                                <p className="text-gray-400 text-sm mt-1 max-w-[240px] mx-auto font-medium">Upload your medical reports for a detailed AI analysis.</p>
                                <Link to="/patient/upload" className="mt-6 inline-flex items-center gap-2 text-primary-600 font-bold hover:underline">
                                    <Plus className="w-4 h-4" />
                                    Get Started
                                </Link>
                            </div>
                        ) : (
                            recentReports.map((report) => (
                                <Link
                                    key={report.id}
                                    to={`/patient/reports/${report.id}`}
                                    className="flex items-center gap-6 p-6 bg-white rounded-3xl border-2 border-gray-50 hover:border-primary-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all group"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform shadow-inner">
                                        <FileText className="w-7 h-7" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors truncate">{report.title}</h3>
                                        <div className="flex items-center gap-3 text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                                            <span>{report.report_type}</span>
                                            <span className="text-gray-200">•</span>
                                            <span>{new Date(report.report_date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="px-4 py-1.5 rounded-xl bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-widest border border-green-100">
                                        {report.status || 'Analyzed'}
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    {/* Upcoming Appointments */}
                    <div className="bg-white rounded-[2.5rem] border-2 border-gray-50 p-8 shadow-xl shadow-gray-100/50">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Appointments</h2>
                            <Link to="/patient/doctors" className="w-8 h-8 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all">
                                <Plus className="w-5 h-5" />
                            </Link>
                        </div>

                        <div className="space-y-6">
                            {upcomingAppointments.length === 0 ? (
                                <div className="text-center py-6 bg-gray-50 rounded-3xl">
                                    <Calendar className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-tight">No consultations booked</p>
                                </div>
                            ) : (
                                upcomingAppointments.map((appt) => (
                                    <div key={appt.id} className="flex gap-4 group">
                                        <div className="flex flex-col items-center gap-1 pt-1">
                                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex flex-col items-center justify-center border-2 border-white shadow-sm">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase">{new Date(appt.appointment_date).toLocaleString(undefined, { month: 'short' })}</span>
                                                <span className="text-lg font-black text-gray-900 -mt-1">{new Date(appt.appointment_date).getDate()}</span>
                                            </div>
                                            <div className="flex-1 w-0.5 bg-gray-100 group-last:hidden mt-2" />
                                        </div>
                                        <div className="flex-1 pb-6 group-last:pb-0">
                                            <h4 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{appt.doctor.profiles.full_name}</h4>
                                            <p className="text-xs text-primary-600 font-bold uppercase mb-2">{appt.doctor.specialization}</p>
                                            <div className="flex items-center gap-3 text-xs text-gray-400 font-bold">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {new Date(appt.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* AI Coach Promo */}
                    <div className="bg-gradient-to-br from-primary-600 to-primary-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                    <Brain className="w-7 h-7" />
                                </div>
                                <h3 className="font-bold text-lg tracking-tight">AI Insights</h3>
                            </div>
                            <p className="text-primary-100 text-sm font-medium leading-relaxed mb-8 opacity-90">
                                Your medical data is securely processed to reveal trends and potential risks. Upload more reports for high-precision accuracy.
                            </p>
                            <Link
                                to="/patient/upload"
                                className="w-full py-4 bg-white text-primary-700 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-primary-50 transition-all shadow-xl shadow-black/20"
                            >
                                Start Upload <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Plus(props: any) {
    return (
        <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    );
}
