import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, User, ChevronLeft, ChevronRight, MoreVertical, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { clsx } from 'clsx';

export default function DoctorSchedule() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        if (user) {
            fetchSchedule();
        }
    }, [user, currentDate]);

    const fetchSchedule = async () => {
        setIsLoading(true);
        try {
            const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

            const { data, error } = await supabase
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
                .gte('appointment_date', startOfMonth.toISOString())
                .lte('appointment_date', endOfMonth.toISOString())
                .order('appointment_date', { ascending: true });

            if (error) throw error;
            setAppointments(data || []);
        } catch (error) {
            console.error('Error fetching schedule:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-outfit">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Consultation Schedule</h1>
                    <p className="text-gray-500 mt-1 font-medium">Manage your clinical sessions and appointments.</p>
                </div>

                <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border-2 border-gray-50">
                    <button
                        onClick={prevMonth}
                        className="p-2 rounded-xl hover:bg-gray-50 transition-all text-gray-400 hover:text-primary-600"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="px-4 font-bold text-gray-900 min-w-[140px] text-center">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </div>
                    <button
                        onClick={nextMonth}
                        className="p-2 rounded-xl hover:bg-gray-50 transition-all text-gray-400 hover:text-primary-600"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-10">
                {/* Calendar View Placeholder / Summary */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white rounded-[2.5rem] border-2 border-gray-50 p-8 shadow-xl shadow-gray-100/50">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Timeline</h2>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-primary-500" />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Scheduled</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Completed</span>
                                </div>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="py-20 flex justify-center">
                                <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                            </div>
                        ) : appointments.length === 0 ? (
                            <div className="py-24 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100">
                                <CalendarIcon className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-gray-900">No appointments this month</h3>
                                <p className="text-gray-400 text-sm mt-1 max-w-[280px] mx-auto font-medium">You don't have any appointments scheduled for this period.</p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {/* Group appointments by day could be better, but for now linear */}
                                {appointments.map((appt) => {
                                    const date = new Date(appt.appointment_date);
                                    return (
                                        <div key={appt.id} className="relative pl-12 group">
                                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-100 group-last:bg-transparent">
                                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-white bg-primary-500 shadow-sm transition-transform group-hover:scale-125" />
                                            </div>

                                            <div className="flex items-start justify-between gap-6 p-6 bg-white rounded-3xl border-2 border-gray-50 hover:border-primary-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all">
                                                <div className="flex gap-4 min-w-0">
                                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 border-2 border-white">
                                                        <User className="w-6 h-6 text-gray-400" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="font-bold text-gray-900 truncate tracking-tight">{appt.patient?.full_name}</h4>
                                                        <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                                            <span className="flex items-center gap-1">
                                                                <CalendarIcon className="w-3 h-3 text-primary-500" />
                                                                {date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                                            </span>
                                                            <span className="text-gray-200">•</span>
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-3 h-3 text-primary-500" />
                                                                {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-2 line-clamp-1 italic">"{appt.reason || 'General checkup and consultation request.'}"</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-3">
                                                    <span className={clsx(
                                                        "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                                                        appt.status === 'scheduled' ? "bg-primary-50 text-primary-600 border-primary-100" : "bg-green-50 text-green-600 border-green-100"
                                                    )}>
                                                        {appt.status}
                                                    </span>
                                                    <button className="p-2 rounded-xl text-gray-300 hover:text-gray-600 hover:bg-gray-50 transition-all">
                                                        <MoreVertical className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div className="lg:col-span-4 space-y-8 text-font-outfit">
                    <div className="bg-white rounded-[2.5rem] border-2 border-gray-50 p-8 shadow-xl shadow-gray-100/50">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">Summary</h3>
                        <div className="space-y-6">
                            <div className="p-5 rounded-3xl bg-blue-50/50 border-2 border-blue-50">
                                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Total Bookings</p>
                                <p className="text-4xl font-black text-blue-600 tracking-tighter">{appointments.length}</p>
                            </div>
                            <div className="p-5 rounded-3xl bg-green-50/50 border-2 border-green-50">
                                <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest mb-1">Consultation Hours</p>
                                <p className="text-4xl font-black text-green-600 tracking-tighter">{appointments.length * 0.5}h</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        <h3 className="text-xl font-bold mb-4 tracking-tight">Availability Settings</h3>
                        <p className="text-sm text-gray-400 font-medium leading-relaxed mb-8">
                            Set your operational hours and consultation fees to manage incoming bookings automatically.
                        </p>
                        <button className="w-full py-4 bg-primary-600 text-white font-bold rounded-2xl hover:bg-primary-700 transition-all shadow-xl shadow-primary-900/40">
                            Configure Hours
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
