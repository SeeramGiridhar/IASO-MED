import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, CheckCircle2, AlertCircle, Info, Loader2, Stethoscope, DollarSign } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
];

export default function AppointmentBooking() {
    const { doctorId } = useParams();
    const { user } = useAuth();

    const [doctor, setDoctor] = useState<any>(null);
    const [isLoadingDoctor, setIsLoadingDoctor] = useState(true);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [visitReason, setVisitReason] = useState('');
    const [shareReports, setShareReports] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (doctorId) {
            fetchDoctorDetails();
        }
    }, [doctorId]);

    const fetchDoctorDetails = async () => {
        setIsLoadingDoctor(true);
        try {
            const { data, error } = await supabase
                .from('doctors')
                .select(`
                    *,
                    profiles:id (
                        full_name,
                        avatar_url
                    )
                `)
                .eq('id', doctorId)
                .single();

            if (error) throw error;
            setDoctor({
                id: data.id,
                name: data.profiles.full_name,
                avatar: data.profiles.avatar_url,
                specialization: data.specialization,
                rating: data.rating,
                hospital: data.hospital_clinic,
                fee: data.consultation_fee,
                experience: data.experience_years
            });
        } catch (err: any) {
            console.error('Error fetching doctor:', err);
            setError('Could not load doctor details.');
        } finally {
            setIsLoadingDoctor(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !doctorId || !selectedDate || !selectedTime) return;

        setIsSubmitting(true);
        setError(null);

        try {
            let sharedReportIds: string[] = [];

            if (shareReports) {
                const { data: patientReports } = await supabase
                    .from('reports')
                    .select('id')
                    .eq('patient_id', user.id);

                if (patientReports) {
                    sharedReportIds = patientReports.map(r => r.id);

                    // Also assign these reports to the doctor for review
                    await supabase
                        .from('reports')
                        .update({ doctor_id: doctorId })
                        .in('id', sharedReportIds);
                }
            }

            // Combine date and time for storage
            const { error: bookingError } = await supabase
                .from('appointments')
                .insert({
                    patient_id: user.id,
                    doctor_id: doctorId,
                    appointment_date: new Date(`${selectedDate}T${convertTo24Hour(selectedTime)}`).toISOString(),
                    reason: visitReason,
                    status: 'scheduled',
                    reports_shared: sharedReportIds
                });

            if (bookingError) throw bookingError;

            setIsConfirmed(true);
        } catch (err: any) {
            console.error('Booking error:', err);
            setError(err.message || 'Failed to book appointment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const convertTo24Hour = (timeStr: string) => {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        if (hours === '12') hours = '00';
        if (modifier === 'PM') hours = (parseInt(hours, 10) + 12).toString();
        return `${hours}:${minutes}:00`;
    };

    if (isLoadingDoctor) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
            </div>
        );
    }

    if (!doctor || error && !isConfirmed) {
        return (
            <div className="max-w-md mx-auto px-4 py-20 text-center font-outfit">
                <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
                <p className="text-gray-500 mb-8">{error || 'Doctor not found.'}</p>
                <Link to="/patient/doctors" className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-lg">
                    Back to Doctors
                </Link>
            </div>
        );
    }

    if (isConfirmed) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-16 text-center font-outfit">
                <div className="w-24 h-24 bg-green-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Success!</h1>
                <p className="text-gray-500 mb-10 max-w-md mx-auto text-lg">
                    Your appointment with <span className="text-gray-900 font-bold">{doctor.name}</span> has been confirmed.
                </p>

                <div className="bg-white border-2 border-gray-50 rounded-3xl p-8 mb-10 text-left shadow-xl shadow-gray-100/50">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-50">
                        <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center font-bold text-primary-600">
                            {doctor.avatar ? <img src={doctor.avatar} className="w-full h-full object-cover rounded-2xl" /> : doctor.name[0]}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">{doctor.name}</h3>
                            <p className="text-sm text-primary-600 font-semibold">{doctor.specialization}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Date</span>
                            <p className="font-bold text-gray-900">{new Date(selectedDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                        <div className="space-y-1 text-right">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Time</span>
                            <p className="font-bold text-gray-900">{selectedTime}</p>
                        </div>
                        <div className="space-y-1 col-span-2">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Clinic Address</span>
                            <p className="font-bold text-gray-700">{doctor.hospital || 'Consultation Clinic'}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/patient/dashboard" className="px-10 py-4 bg-primary-600 text-white font-bold rounded-2xl hover:bg-primary-700 shadow-xl shadow-primary-500/30 transition-all font-outfit">
                        Back to Dashboard
                    </Link>
                    <button onClick={() => window.print()} className="px-10 py-4 bg-white border-2 border-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-all">
                        Print Details
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 font-outfit">
            <Link to="/patient/doctors" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary-600 mb-8 transition-colors group">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to Specialist Search
            </Link>

            <div className="grid lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Consultation Booking</h1>
                        <p className="text-gray-500">Pick a convenient time slot and tell us why you're visiting.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-semibold">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        {/* Date Selection */}
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-lg font-bold text-gray-900">
                                <span className="w-7 h-7 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center text-sm">1</span>
                                Choose Date
                            </label>
                            <input
                                type="date"
                                required
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-primary-500 focus:outline-none transition-all font-semibold shadow-sm"
                            />
                        </div>

                        {/* Time Selection */}
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-lg font-bold text-gray-900">
                                <span className="w-7 h-7 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center text-sm">2</span>
                                Select Time Slot
                            </label>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                {timeSlots.map((slot) => (
                                    <button
                                        key={slot}
                                        type="button"
                                        onClick={() => setSelectedTime(slot)}
                                        className={`py-3 text-xs font-bold rounded-xl border-2 transition-all ${selectedTime === slot
                                            ? 'border-primary-500 bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                                            : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-primary-200 hover:bg-white hover:text-primary-600'
                                            }`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Reason */}
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-lg font-bold text-gray-900">
                                <span className="w-7 h-7 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center text-sm">3</span>
                                Reason for Visit
                            </label>
                            <textarea
                                value={visitReason}
                                onChange={(e) => setVisitReason(e.target.value)}
                                placeholder="Describe your symptoms or reason for consulting the doctor..."
                                rows={4}
                                className="w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-primary-500 focus:outline-none transition-all font-medium resize-none shadow-sm"
                            />
                        </div>

                        {/* Options */}
                        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 border-2 border-gray-50 shadow-inner">
                            <label className="flex items-start gap-4 cursor-pointer group">
                                <div className="mt-1">
                                    <input
                                        type="checkbox"
                                        checked={shareReports}
                                        onChange={(e) => setShareReports(e.target.checked)}
                                        className="w-5 h-5 rounded-lg border-2 border-gray-200 text-primary-600 focus:ring-primary-500 transition-all cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <span className="text-sm font-bold text-gray-800 group-hover:text-primary-600 transition-colors">Share medical reports automatically</span>
                                    <p className="mt-1 text-xs text-gray-400 font-medium leading-relaxed">
                                        This allows the doctor to review your medical history and recent report analysis before your visit for a more comprehensive consultation.
                                    </p>
                                </div>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || !selectedDate || !selectedTime}
                            className="w-full py-5 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-primary-600/30 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 text-lg"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    Booking Slot...
                                </>
                            ) : (
                                'Complete Booking'
                            )}
                        </button>
                    </form>
                </div>

                {/* Doctor Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white border-2 border-gray-50 rounded-[2.5rem] p-8 shadow-xl shadow-gray-100/50 sticky top-12">
                        <div className="flex flex-col items-center text-center mb-8 pb-8 border-b border-gray-50">
                            <div className="w-24 h-24 rounded-3xl bg-primary-50 flex items-center justify-center mb-4 overflow-hidden shadow-inner border-4 border-white">
                                {doctor.avatar ? <img src={doctor.avatar} className="w-full h-full object-cover" /> : <Stethoscope className="w-10 h-10 text-primary-200" />}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{doctor.name}</h3>
                            <p className="text-sm text-primary-600 font-bold uppercase tracking-wider">{doctor.specialization}</p>

                            <div className="flex items-center gap-1.5 text-amber-500 mt-3 font-bold">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="text-gray-900">{doctor.rating || 'N/A'}</span>
                                <span className="text-gray-300 mx-1 font-normal">|</span>
                                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">{doctor.experience} Yrs Exp</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">Affiliation</span>
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                                    <span className="text-sm font-bold text-gray-700 leading-snug">{doctor.hospital || 'Private Medical Clinic'}</span>
                                </div>
                            </div>

                            <div className="p-5 bg-gray-50 rounded-2xl flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Fee</span>
                                    <span className="text-lg font-bold text-primary-600">${doctor.fee}</span>
                                </div>
                                <div className="p-3 bg-white rounded-xl text-primary-600 shadow-sm">
                                    <DollarSign className="w-5 h-5" />
                                </div>
                            </div>

                            <div className="flex gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100/50">
                                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                <p className="text-[10px] text-amber-800 leading-relaxed font-bold uppercase tracking-tight">
                                    Free cancellation before 24h. Secure payment at clinic.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
