import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, FileText, Star, TrendingUp, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

export default function DoctorDashboard() {
    const { user } = useAuth();
    const [todayAppointments, setTodayAppointments] = useState<any[]>([]);
    const [pendingReports, setPendingReports] = useState<any[]>([]);
    const [stats, setStats] = useState({
        todayAppts: 0,
        pendingReviews: 0,
        totalPatients: 0,
        rating: '4.9'
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchDoctorData();
        }
    }, [user]);

    const fetchDoctorData = async () => {
        setIsLoading(true);
        try {
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);
            const todayEnd = new Date();
            todayEnd.setHours(23, 59, 59, 999);

            // Fetch today's appointments
            const { data: apptData } = await supabase
                .from('appointments')
                .select(`
                    *,
                    patient:patient_id (
                        id,
                        full_name,
                        avatar_url
                    )
                `)
                .eq('doctor_id', user?.id)
                .gte('appointment_date', todayStart.toISOString())
                .lte('appointment_date', todayEnd.toISOString())
                .order('appointment_date', { ascending: true });

            // Fetch pending reports
            const { data: reportsData } = await supabase
                .from('reports')
                .select(`
                    *,
                    patient:patient_id (
                        id,
                        full_name
                    )
                `)
                .eq('doctor_id', user?.id)
                .eq('status', 'pending')
                .limit(5);

            // Get total unique patients
            const { count: patientCount } = await supabase
                .from('appointments')
                .select('patient_id', { count: 'exact', head: true })
                .eq('doctor_id', user?.id);

            setTodayAppointments(apptData || []);
            setPendingReports(reportsData || []);
            setStats({
                todayAppts: apptData?.length || 0,
                pendingReviews: reportsData?.length || 0,
                totalPatients: patientCount || 0,
                rating: '4.9'
            });
        } catch (error) {
            console.error('Error fetching doctor dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const statsConfig = [
        { label: "Today's Appts", value: stats.todayAppts.toString(), icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Pending Reviews', value: stats.pendingReviews.toString(), icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Total Patients', value: stats.totalPatients.toString(), icon: Users, color: 'text-primary-600', bg: 'bg-primary-50' },
        { label: 'Avg. Rating', value: stats.rating, icon: Star, color: 'text-purple-600', bg: 'bg-purple-50' },
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
                        Welcome back, <span className="text-primary-600">
                            {user?.name?.toLowerCase().startsWith('dr.') ? user.name : `Dr. ${user?.name?.split(' ').pop()}`}
                        </span> 👋
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium">You have {stats.todayAppts} appointments scheduled for today.</p>
                </div>
                <Link
                    to="/doctor/profile"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-primary-100 text-primary-600 font-bold rounded-2xl hover:bg-primary-50 transition-all shadow-xl shadow-primary-500/5 transform hover:-translate-y-0.5 text-sm"
                >
                    <Star className="w-5 h-5" />
                    Professional Profile
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {statsConfig.map((stat: any) => (
                    <div key={stat.label} className="bg-white rounded-[2rem] border-2 border-gray-50 p-6 hover:shadow-2xl hover:shadow-gray-100/50 transition-all duration-300 transform hover:-translate-y-1">
                        <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center mb-4 shadow-inner`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <p className="text-3xl font-black text-gray-900 tracking-tighter">{stat.value}</p>
                        <p className="text-sm text-gray-500 font-bold mt-1 uppercase tracking-widest opacity-60">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
                {/* Today's Schedule */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Today's Schedule</h2>
                        <Link to="/doctor/schedule" className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 group">
                            Full Calendar <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                    <div className="grid gap-4">
                        {todayAppointments.length === 0 ? (
                            <div className="py-16 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
                                <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                <h3 className="text-gray-900 font-bold text-lg">No appointments today</h3>
                                <p className="text-gray-400 text-sm mt-1 max-w-[280px] mx-auto font-medium">Your schedule is currently clear. Take this time to catch up on report reviews.</p>
                            </div>
                        ) : (
                            todayAppointments.map((appt) => (
                                <div
                                    key={appt.id}
                                    className="flex items-center gap-6 p-6 bg-white rounded-3xl border-2 border-gray-50 hover:border-primary-100 transition-all group"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-gray-50 flex flex-col items-center justify-center border-2 border-white shadow-sm overflow-hidden group-hover:border-primary-100 transition-colors">
                                        <span className="text-xs font-bold text-primary-600">{new Date(appt.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors truncate">{appt.patient?.full_name}</h3>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Reason: {appt.reason || 'General Consultation'}</p>
                                    </div>
                                    <Link
                                        to={`/doctor/patients/${appt.patient?.id}`}
                                        className="px-6 py-2.5 rounded-xl bg-primary-50 text-primary-600 text-xs font-bold uppercase tracking-widest hover:bg-primary-600 hover:text-white transition-all shadow-sm"
                                    >
                                        Start
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    {/* Pending Reports */}
                    <div className="bg-white rounded-[2.5rem] border-2 border-gray-50 p-8 shadow-xl shadow-gray-100/50">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Report Queue</h2>
                            <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-amber-100">
                                {stats.pendingReviews} New
                            </span>
                        </div>

                        <div className="space-y-6">
                            {pendingReports.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 rounded-3xl border border-dashed border-gray-100">
                                    <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3 opacity-50" />
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Queue is clear</p>
                                </div>
                            ) : (
                                pendingReports.map((report) => (
                                    <Link key={report.id} to={`/doctor/reports/${report.id}`} className="flex gap-4 group">
                                        <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 shrink-0 group-hover:scale-110 transition-transform">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-gray-900 text-sm group-hover:text-primary-600 transition-colors truncate">{report.patient?.full_name}</h4>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{report.title}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="h-1 flex-1 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-amber-400 w-1/2 rounded-full" />
                                                </div>
                                                <span className="text-[9px] font-bold text-amber-600">Reviewing</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Performance Insight */}
                    <div className="bg-gradient-to-br from-primary-600 to-primary-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                    <TrendingUp className="w-7 h-7" />
                                </div>
                                <h3 className="font-bold text-lg tracking-tight">Practice Growth</h3>
                            </div>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-primary-100 font-medium">New Patients (MTD)</span>
                                    <span className="font-black text-lg">+{stats.totalPatients}</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-white/40 w-2/3" />
                                </div>
                            </div>
                            <button className="w-full py-4 bg-white text-primary-700 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-primary-50 transition-all shadow-xl shadow-black/20 text-sm">
                                View Detailed Analytics
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
