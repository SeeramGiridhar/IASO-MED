import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Stethoscope, Star, Loader2, Award, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const specializations = ['All', 'General Medicine', 'Cardiology', 'Dermatology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Psychiatry', 'Gynecology', 'Ophthalmology', 'Oncology', 'Urology', 'Endocrinology'];

export default function DoctorSearch() {
    const [doctors, setDoctors] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSpec, setSelectedSpec] = useState('All');
    const [sortBy, setSortBy] = useState('rating');

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Join doctors with profiles to get name and avatar
            const { data, error: fetchError } = await supabase
                .from('doctors')
                .select(`
                    *,
                    profiles:id (
                        full_name,
                        avatar_url,
                        email
                    )
                `);

            if (fetchError) throw fetchError;

            // Format data for easier use
            const formatted = (data || []).map((d: any) => ({
                id: d.id,
                name: d.profiles.full_name,
                avatar: d.profiles.avatar_url,
                specialization: d.specialization || 'General Medicine',
                experience: d.experience_years || 0,
                hospital: d.hospital_clinic || 'Private Practice',
                fee: d.consultation_fee || 0,
                rating: d.rating || 0,
                isVerified: d.is_verified,
            }));

            setDoctors(formatted);
        } catch (err: any) {
            console.error('Error fetching doctors:', err);
            setError('Failed to find doctors. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const filtered = doctors
        .filter(d => {
            const matchesSearch = d.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                d.specialization?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesSpec = selectedSpec === 'All' || d.specialization === selectedSpec;
            return matchesSearch && matchesSpec;
        })
        .sort((a, b) => {
            if (sortBy === 'rating') return b.rating - a.rating;
            if (sortBy === 'fee') return a.fee - b.fee;
            if (sortBy === 'experience') return b.experience - a.experience;
            return 0;
        });

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-primary-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Finding verified doctors...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8 font-outfit">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Find a Specialist</h1>
                <p className="text-gray-500 mt-1">Book appointments with top-rated medical professionals</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-medium font-open-sans">
                    <AlertCircle className="w-5 h-5" />
                    <p>{error}</p>
                    <button onClick={fetchDoctors} className="ml-auto text-sm font-bold underline">Retry</button>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search name or specialization..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-100 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none transition-all shadow-sm shadow-gray-100/50"
                    />
                </div>
                <div className="flex gap-2">
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-3.5 bg-white border-2 border-gray-100 rounded-2xl text-gray-700 font-semibold focus:border-primary-500 focus:outline-none cursor-pointer transition-all shadow-sm shadow-gray-100/50">
                        <option value="rating">Top Rated</option>
                        <option value="fee">Lowest Fee</option>
                        <option value="experience">Experience</option>
                    </select>
                </div>
            </div>

            {/* Specialization Scroll */}
            <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2 scroll-smooth">
                {specializations.map(spec => (
                    <button
                        key={spec}
                        onClick={() => setSelectedSpec(spec)}
                        className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${selectedSpec === spec
                            ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-500/30'
                            : 'bg-white border-gray-100 text-gray-500 hover:border-primary-200 hover:text-primary-600'
                            }`}
                    >
                        {spec}
                    </button>
                ))}
            </div>

            {/* Doctor Cards */}
            {filtered.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    {filtered.map((doctor) => (
                        <div key={doctor.id} className="group bg-white rounded-3xl border border-gray-100 p-6 hover:border-primary-100 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="relative">
                                    <div className="w-20 h-20 rounded-2xl bg-primary-50 border-2 border-white overflow-hidden shadow-inner">
                                        {doctor.avatar ? (
                                            <img src={doctor.avatar} alt={doctor.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <User className="w-8 h-8 text-primary-200" />
                                            </div>
                                        )}
                                    </div>
                                    {doctor.isVerified && (
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                                            <Award className="w-3 h-3 text-white" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1 text-primary-600 text-xs font-bold uppercase tracking-wider mb-1">
                                        <Stethoscope className="w-3 h-3" />
                                        {doctor.specialization}
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-primary-600 transition-colors truncate">{doctor.name}</h3>
                                    <div className="flex items-center gap-1 text-amber-500 mt-1">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="text-sm font-bold text-gray-900">{doctor.rating || 'N/A'}</span>
                                        <span className="text-xs text-gray-400 font-medium ml-1">({doctor.experience} yrs exp)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Clinic / Hospital</span>
                                        <span className="text-sm font-semibold text-gray-700 truncate max-w-[140px]">{doctor.hospital}</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Consultation</span>
                                        <span className="text-sm font-bold text-primary-600">${doctor.fee}</span>
                                    </div>
                                </div>

                                <Link
                                    to={`/patient/book/${doctor.id}`}
                                    className="block w-full py-3.5 bg-gray-50 text-gray-900 font-bold rounded-2xl text-center group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm"
                                >
                                    Book Appointment
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-24 text-center bg-white rounded-3xl border border-gray-100 shadow-sm mt-8">
                    <div className="w-20 h-20 bg-primary-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Stethoscope className="w-10 h-10 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No doctors found</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-8 font-open-sans">
                        Try adjusting your filters or search keywords to find the right specialist for your needs.
                    </p>
                    <button onClick={() => { setSelectedSpec('All'); setSearchQuery(''); }} className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 shadow-xl shadow-primary-500/20 transition-all font-outfit">
                        Reset Filters
                    </button>
                </div>
            )}
        </div>
    );
}

function User(props: any) {
    return <Stethoscope {...props} />; // Placeholder icon if User is not imported
}
