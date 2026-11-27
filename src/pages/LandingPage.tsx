import { Link } from 'react-router-dom';
import {
    FileText,
    Brain,
    Calendar,
    Shield,
    ArrowRight,
    CheckCircle2,
    Upload,
    Search,
    TrendingUp,
    Zap,
    Clock,
    ChevronRight,
    Stethoscope,
    BarChart3,
    UserCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getHomeRouteForRole } from '../lib/utils';

export default function LandingPage() {
    const { isAuthenticated, user } = useAuth();
    const dashboardPath = getHomeRouteForRole(user?.role);
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

                            {/* Dynamic CTAs based on login state */}
                            {isAuthenticated ? (
                                <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                                    <Link
                                        to={dashboardPath}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl hover:from-primary-600 hover:to-primary-700 shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 transition-all group"
                                    >
                                        {user?.role === 'admin' ? 'Doctor Approvals Console' : 'Go to Dashboard'}
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    {user?.role !== 'admin' && (
                                        <Link
                                            to={user?.role === 'doctor' ? '/doctor/reports' : '/patient/upload'}
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-2xl hover:border-primary-300 hover:text-primary-600 transition-all"
                                        >
                                            {user?.role === 'doctor' ? 'Review Patient Reports' : 'Upload Medical Report'}
                                        </Link>
                                    )}
                                </div>
                            ) : (
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
                            )}

                            {/* Trust badges */}
                            <div className="mt-10 flex items-center gap-6 justify-center lg:justify-start text-sm text-gray-500">
                                <div className="flex items-center gap-1.5">
                                    <Shield className="w-4 h-4 text-green-500" />
                                    HIPAA-Ready Architecture
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    256-bit Encrypted
                                </div>
                            </div>
                        </div>

                        {/* Right - Hero Visual: Live AI Report Analysis Preview */}
                        <div className="relative">
                            <div className="relative bg-white rounded-3xl shadow-2xl shadow-gray-200/70 border border-gray-100 p-6 sm:p-7 space-y-4">
                                {/* Header */}
                                <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">Comprehensive Metabolic Panel</p>
                                            <p className="text-xs text-gray-600">Sample Lab Analysis &bull; AI Extracted</p>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        Analysis Ready
                                    </span>
                                </div>

                                {/* Biomarker Preview Grid */}
                                <div className="grid grid-cols-2 gap-2.5">
                                    <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-2xl">
                                        <div className="flex justify-between items-start">
                                            <span className="text-[11px] font-medium text-gray-700">Fasting Glucose</span>
                                            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">High</span>
                                        </div>
                                        <p className="text-base font-extrabold text-gray-900 mt-1">108 <span className="text-xs font-normal text-gray-600">mg/dL</span></p>
                                        <p className="text-[10px] text-gray-600 mt-0.5">Ref: 70–99 mg/dL</p>
                                    </div>

                                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl">
                                        <div className="flex justify-between items-start">
                                            <span className="text-[11px] font-medium text-gray-700">Total Cholesterol</span>
                                            <span className="text-[10px] font-bold text-green-800 bg-green-100 px-1.5 py-0.5 rounded">Normal</span>
                                        </div>
                                        <p className="text-base font-extrabold text-gray-900 mt-1">182 <span className="text-xs font-normal text-gray-600">mg/dL</span></p>
                                        <p className="text-[10px] text-gray-600 mt-0.5">Ref: &lt; 200 mg/dL</p>
                                    </div>

                                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl">
                                        <div className="flex justify-between items-start">
                                            <span className="text-[11px] font-medium text-gray-700">Hemoglobin</span>
                                            <span className="text-[10px] font-bold text-green-800 bg-green-100 px-1.5 py-0.5 rounded">Optimal</span>
                                        </div>
                                        <p className="text-base font-extrabold text-gray-900 mt-1">14.6 <span className="text-xs font-normal text-gray-600">g/dL</span></p>
                                        <p className="text-[10px] text-gray-600 mt-0.5">Ref: 13.5–17.5 g/dL</p>
                                    </div>

                                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl">
                                        <div className="flex justify-between items-start">
                                            <span className="text-[11px] font-medium text-gray-700">eGFR (Kidney)</span>
                                            <span className="text-[10px] font-bold text-green-800 bg-green-100 px-1.5 py-0.5 rounded">&gt; 90</span>
                                        </div>
                                        <p className="text-base font-extrabold text-gray-900 mt-1">98 <span className="text-xs font-normal text-gray-600">mL/min</span></p>
                                        <p className="text-[10px] text-gray-600 mt-0.5">Ref: &gt; 60 mL/min</p>
                                    </div>
                                </div>

                                {/* Plain-Language Clinical Summary Box */}
                                <div className="p-3.5 bg-primary-50/60 rounded-2xl border border-primary-100">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary-800 mb-1">
                                        <Brain className="w-3.5 h-3.5 text-primary-700" />
                                        Plain-Language AI Summary
                                    </div>
                                    <p className="text-xs text-gray-700 leading-relaxed">
                                        Blood panel shows optimal kidney &amp; lipid profiles. Fasting glucose is slightly elevated above normal baseline. Consider reviewing diet with a physician.
                                    </p>
                                </div>

                                {/* Specialist Callout */}
                                <div className="flex items-center justify-between pt-1">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-green-100 text-green-800 flex items-center justify-center">
                                            <Stethoscope className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs text-gray-700 font-medium">Recommended: General Physician review</span>
                                    </div>
                                    <Link to="/patient/doctors" className="text-xs font-bold text-primary-700 hover:text-primary-800 hover:underline">
                                        Find Doctors &rarr;
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Platform Highlights Section */}
            <section className="py-16 bg-white border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Shield, title: 'HIPAA Compliant', label: 'Encrypted document storage' },
                            { icon: Brain, title: 'AI Extraction', label: 'Plain-language report summaries' },
                            { icon: Stethoscope, title: 'Doctor Directory', label: 'Find & book specialists' },
                            { icon: FileText, title: 'Personal Archive', label: 'Organize all your records' },
                        ].map((item) => (
                            <div key={item.title} className="text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-50 mb-3">
                                    <item.icon className="w-6 h-6 text-primary-600" />
                                </div>
                                <p className="text-xl font-bold text-gray-900">{item.title}</p>
                                <p className="text-sm text-gray-500 mt-1">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">Features</span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                            Everything You Need for Your Health Journey
                        </h2>
                        <p className="mt-3 text-gray-600 text-base sm:text-lg">
                            From uploading reports to booking appointments, IASO Med handles every step with AI intelligence.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: Upload, title: 'Smart Report Upload', desc: 'Upload photos or multi-page PDFs of lab tests. Advanced OCR extracts all markers and values instantly.' },
                            { icon: Brain, title: 'AI Clinical Explanation', desc: 'Advanced multimodal AI analyzes your reports and provides clear, simple explanations in plain language.' },
                            { icon: TrendingUp, title: 'Health Trend Tracking', desc: 'Track your vital metrics over time with interactive charts to easily monitor your health progress.' },
                            { icon: Search, title: 'Specialist Discovery', desc: 'Find certified doctors and specialists matched to your lab findings, location, and consultation needs.' },
                            { icon: Calendar, title: 'Streamlined Booking', desc: 'Book appointments with specialists effortlessly, choose consultation slots, and receive timely reminders.' },
                            { icon: Shield, title: 'HIPAA-Ready Privacy', desc: 'All documents are secured with 256-bit AES encryption and private consent-gated doctor sharing.' },
                        ].map((feature) => (
                            <div
                                key={feature.title}
                                className="group bg-white rounded-2xl p-6 border border-gray-200/80 hover:border-primary-300 hover:shadow-lg hover:shadow-primary-100/40 transition-all duration-200 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200/50 flex items-center justify-center mb-4 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                        <feature.icon className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-base font-bold text-gray-900 mb-2">{feature.title}</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
                                </div>
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
                                            <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                                            <p className="text-gray-300 text-sm">{item.desc}</p>
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

                        {/* Doctor Practice Portal Preview Card */}
                        <div className="relative">
                            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-white/15 space-y-4 shadow-2xl">
                                {/* Doctor header */}
                                <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary-500/30 border border-primary-400/40 flex items-center justify-center text-primary-200">
                                            <Stethoscope className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white flex items-center gap-1.5">
                                                Dr. Sarah Jenkins, MD
                                                <span className="text-[10px] bg-primary-500/30 text-primary-300 px-2 py-0.5 rounded-full font-medium">Verified</span>
                                            </p>
                                            <p className="text-xs text-gray-400">Cardiology &bull; Active Clinic</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-green-400 font-semibold bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                                        Available Today
                                    </span>
                                </div>

                                {/* Practice Quick Stats */}
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                                        <p className="text-lg font-extrabold text-white">18</p>
                                        <p className="text-[10px] text-gray-400">Appointments</p>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                                        <p className="text-lg font-extrabold text-primary-300">4</p>
                                        <p className="text-[10px] text-gray-400">AI Reports</p>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                                        <p className="text-lg font-extrabold text-amber-300">4.9 &#9733;</p>
                                        <p className="text-[10px] text-gray-400">Rating</p>
                                    </div>
                                </div>

                                {/* Upcoming Patient Queue Item */}
                                <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-bold text-white flex items-center gap-1.5">
                                            <UserCheck className="w-3.5 h-3.5 text-primary-400" />
                                            Arjun K. (Patient)
                                        </span>
                                        <span className="text-primary-300 font-medium">Slot: 10:30 AM</span>
                                    </div>
                                    <div className="text-[11px] text-gray-300 bg-white/5 p-2 rounded-xl border border-white/5">
                                        <span className="text-primary-300 font-semibold">Shared Lab:</span> Fasting Blood Sugar &amp; Lipid Panel (Pre-consultation AI summary verified)
                                    </div>
                                </div>

                                <div className="pt-1">
                                    <Link
                                        to={isAuthenticated && user?.role === 'doctor' ? '/doctor/dashboard' : '/login?role=doctor'}
                                        className="w-full py-2.5 px-4 bg-primary-500/20 hover:bg-primary-500/30 text-primary-300 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-primary-500/30 transition-colors"
                                    >
                                        Open Clinician Console &rarr;
                                    </Link>
                                </div>
                            </div>
                        </div>
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
                        Start managing your medical reports, understanding clinical insights, and connecting with doctors today.
                    </p>
                    {isAuthenticated ? (
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to={dashboardPath}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-primary-700 bg-white rounded-2xl hover:bg-gray-50 shadow-xl transition-all group"
                            >
                                {user?.role === 'admin' ? 'Doctor Approvals Console' : 'Go to Dashboard'}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            {user?.role !== 'admin' && (
                                <Link
                                    to={user?.role === 'doctor' ? '/doctor/reports' : '/patient/upload'}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white border-2 border-white/30 rounded-2xl hover:bg-white/10 transition-all"
                                >
                                    {user?.role === 'doctor' ? 'Review Patient Reports' : 'Upload Medical Report'}
                                </Link>
                            )}
                        </div>
                    ) : (
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
                    )}
                </div>
            </section>
        </div>
    );
}
