import { Link } from 'react-router-dom';
import {
    Heart,
    FileText,
    Brain,
    Calendar,
    MessageSquare,
    Shield,
    ArrowRight,
    CheckCircle2,
    Upload,
    Search,
    TrendingUp,
    Star,
    Users,
    Zap,
    Clock,
    ChevronRight,
    Stethoscope,
    BarChart3,
} from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="overflow-hidden">
            {/* Hero Section */}
            <section className="relative min-h-[92vh] flex items-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
                {/* Background decorations */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-50/50 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-100/20 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-0">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Left - Text */}
                        <div className="text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
                                <Zap className="w-4 h-4" />
                                AI-Powered Medical Analysis
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
                                Understand Your
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">
                                    Medical Reports
                                </span>
                                In Seconds
                            </h1>

                            <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
                                IASO Med uses advanced AI to transform complex medical reports
                                into clear, actionable health insights — and connects you with
                                the right doctors instantly.
                            </p>

                            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                                <Link
                                    to="/register"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl hover:from-primary-600 hover:to-primary-700 shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 transition-all group"
                                >
                                    Get Started Free
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    to="/login"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-2xl hover:border-primary-300 hover:text-primary-600 transition-all"
                                >
                                    Sign In
                                </Link>
                            </div>

                            {/* Trust badges */}
                            <div className="mt-10 flex items-center gap-6 justify-center lg:justify-start text-sm text-gray-500">
                                <div className="flex items-center gap-1.5">
                                    <Shield className="w-4 h-4 text-green-500" />
                                    HIPAA Compliant
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    256-bit Encrypted
                                </div>
                            </div>
                        </div>

                        {/* Right - Hero Visual */}
                        <div className="relative">
                            <div className="relative bg-white rounded-3xl shadow-2xl shadow-gray-200/60 border border-gray-100 p-6 lg:p-8">
                                {/* Mini dashboard mockup */}
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                                        <Heart className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Health Report Analysis</p>
                                        <p className="text-xs text-gray-500">Just now • Blood Panel</p>
                                    </div>
                                    <span className="ml-auto px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Normal</span>
                                </div>

                                {/* Stats row */}
                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    {[
                                        { label: 'Hemoglobin', value: '14.2 g/dL', status: 'normal' },
                                        { label: 'Glucose', value: '95 mg/dL', status: 'normal' },
                                        { label: 'Cholesterol', value: '210 mg/dL', status: 'warning' },
                                    ].map((item) => (
                                        <div key={item.label} className="bg-gray-50 rounded-xl p-3 text-center">
                                            <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                                            <p className="text-sm font-bold text-gray-900">{item.value}</p>
                                            <div className={`mt-1.5 h-1.5 rounded-full ${item.status === 'normal' ? 'bg-green-400' : 'bg-amber-400'}`} />
                                        </div>
                                    ))}
                                </div>

                                {/* AI Summary */}
                                <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-4 border border-primary-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Brain className="w-4 h-4 text-primary-600" />
                                        <span className="text-xs font-semibold text-primary-700">AI Summary</span>
                                    </div>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        Your blood panel results are largely within the normal range. Cholesterol is slightly elevated — consider dietary adjustments and a follow-up in 3 months.
                                    </p>
                                </div>
                            </div>

                            {/* Floating elements */}
                            <div className="absolute -top-6 -right-6 px-4 py-2 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center gap-2 animate-[float_3s_ease-in-out_infinite]">
                                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-900">Report Analyzed</p>
                                    <p className="text-xs text-gray-500">2 seconds ago</p>
                                </div>
                            </div>

                            <div className="absolute -bottom-4 -left-4 px-4 py-2 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center gap-2 animate-[float_3s_ease-in-out_infinite_0.5s]">
                                <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                                    <Calendar className="w-4 h-4 text-primary-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-900">Dr. Smith available</p>
                                    <p className="text-xs text-gray-500">Today at 3:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Users, value: '50,000+', label: 'Active Patients' },
                            { icon: Stethoscope, value: '2,000+', label: 'Verified Doctors' },
                            { icon: FileText, value: '500K+', label: 'Reports Analyzed' },
                            { icon: Star, value: '4.9/5', label: 'User Rating' },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-50 mb-3">
                                    <stat.icon className="w-6 h-6 text-primary-600" />
                                </div>
                                <p className="text-2xl lg:text-3xl font-bold text-gray-900">{stat.value}</p>
                                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">Features</span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                            Everything You Need for Your Health Journey
                        </h2>
                        <p className="mt-4 text-gray-600 text-lg">
                            From uploading reports to booking appointments, IASO Med handles every step with AI intelligence.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: Upload, title: 'Smart Report Upload', desc: 'Snap a photo or upload a PDF of any medical report. Our OCR technology extracts all the data instantly.' },
                            { icon: Brain, title: 'AI-Powered Analysis', desc: 'GPT-4o analyzes your reports and provides clear, simple explanations anyone can understand.' },
                            { icon: TrendingUp, title: 'Health Trend Tracking', desc: 'Track your health metrics over time with beautiful charts and get insights on your progress.' },
                            { icon: Search, title: 'Doctor Discovery', desc: 'Find the right specialist based on your report findings, location, ratings, and availability.' },
                            { icon: Calendar, title: 'Easy Booking', desc: 'Book appointments with a few taps. Get reminders and sync with your calendar automatically.' },
                            { icon: MessageSquare, title: 'Secure Messaging', desc: 'Communicate with your doctors securely with HIPAA-compliant end-to-end encrypted messaging.' },
                        ].map((feature) => (
                            <div
                                key={feature.title}
                                className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-100/50 transition-all duration-300"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-primary-50 group-hover:bg-primary-100 flex items-center justify-center mb-5 transition-colors">
                                    <feature.icon className="w-6 h-6 text-primary-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">How It Works</span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                            Three Simple Steps to Better Health Insights
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10 lg:gap-16">
                        {[
                            { step: '01', title: 'Upload Your Report', desc: 'Take a photo or upload your medical report. We support blood tests, X-rays, MRIs, prescriptions, and more.', icon: Upload },
                            { step: '02', title: 'Get AI Analysis', desc: 'Our AI instantly analyzes your report, highlights key findings, and provides an easy-to-understand summary.', icon: Brain },
                            { step: '03', title: 'Connect with Doctors', desc: 'Based on your results, find and book appointments with the right specialists nearby.', icon: Stethoscope },
                        ].map((item) => (
                            <div key={item.step} className="relative text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white text-xl font-bold shadow-lg shadow-primary-500/25 mb-6">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* For Doctors Section */}
            <section id="for-doctors" className="py-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="inline-block px-4 py-1.5 bg-primary-500/20 text-primary-300 rounded-full text-sm font-medium mb-6">For Healthcare Providers</span>
                            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-6">
                                Streamline Your Practice with IASO Med
                            </h2>
                            <p className="text-gray-400 text-lg leading-relaxed mb-10">
                                Manage appointments, review patient reports with AI assistance, and grow your practice — all from one powerful platform.
                            </p>

                            <div className="space-y-6">
                                {[
                                    { icon: BarChart3, title: 'Smart Dashboard', desc: 'Get a complete overview of your appointments, patients, and revenue at a glance.' },
                                    { icon: FileText, title: 'AI-Assisted Reviews', desc: 'Review patient reports faster with AI-generated summaries and insights.' },
                                    { icon: Clock, title: 'Schedule Management', desc: 'Set your availability, manage bookings, and reduce no-shows with automated reminders.' },
                                    { icon: Shield, title: 'HIPAA Compliant', desc: 'All data is encrypted and stored securely following strict healthcare compliance standards.' },
                                ].map((item) => (
                                    <div key={item.title} className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                                            <item.icon className="w-5 h-5 text-primary-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                                            <p className="text-gray-400 text-sm">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Link
                                to="/register"
                                className="mt-10 inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-2xl hover:from-primary-600 hover:to-primary-700 shadow-xl shadow-primary-500/25 transition-all group"
                            >
                                Join as a Doctor
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        {/* Doctor dashboard preview */}
                        <div className="relative">
                            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    {[
                                        { label: "Today's Appointments", value: '8', change: '+2' },
                                        { label: 'Pending Reviews', value: '12', change: '3 urgent' },
                                        { label: 'Messages', value: '5', change: '2 new' },
                                        { label: 'Rating', value: '4.9', change: '120 reviews' },
                                    ].map((stat) => (
                                        <div key={stat.label} className="bg-white/5 rounded-xl p-4 border border-white/10">
                                            <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
                                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                                            <p className="text-xs text-primary-400 mt-1">{stat.change}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                    <p className="text-xs text-gray-400 mb-3">Upcoming Appointments</p>
                                    {['Sarah Johnson — 9:00 AM — Blood Work Review', 'Mike Chen — 10:30 AM — Follow-up', 'Emily Davis — 2:00 PM — New Patient'].map((appt) => (
                                        <div key={appt} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                                            <div className="w-2 h-2 rounded-full bg-primary-400" />
                                            <p className="text-sm text-gray-300">{appt}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">Testimonials</span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                            Trusted by Thousands
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { name: 'Priya Sharma', role: 'Patient', quote: 'IASO Med helped me understand my blood work in seconds. I could finally have an informed conversation with my doctor!', rating: 5 },
                            { name: 'Dr. Rajesh Patel', role: 'Cardiologist', quote: 'The AI-assisted report review saves me hours every week. My patients come in better informed and our consultations are more productive.', rating: 5 },
                            { name: 'Ananya Gupta', role: 'Patient', quote: 'Finding the right specialist used to be so stressful. IASO Med recommended a great doctor based on my report findings. Incredible!', rating: 5 },
                        ].map((testimonial) => (
                            <div key={testimonial.name} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-1 mb-4">
                                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                                    ))}
                                </div>
                                <p className="text-gray-700 leading-relaxed mb-6 italic">"{testimonial.quote}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-sm">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
                                        <p className="text-xs text-gray-500">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-r from-primary-600 to-primary-700">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-4">
                        Ready to Take Control of Your Health?
                    </h2>
                    <p className="text-primary-100 text-lg max-w-2xl mx-auto mb-10">
                        Join thousands of patients and doctors who trust IASO Med for smarter healthcare management.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/register"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-primary-700 bg-white rounded-2xl hover:bg-gray-50 shadow-xl transition-all group"
                        >
                            Create Free Account
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/login"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white border-2 border-white/30 rounded-2xl hover:bg-white/10 transition-all"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
