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

                        {/* Right - Hero Visual: App Workflow Overview */}
                        <div className="relative">
                            <div className="relative bg-white rounded-3xl shadow-2xl shadow-gray-200/60 border border-gray-100 p-6 lg:p-8 space-y-4">
                                <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white">
                                        <Heart className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">How IASO Med Works</p>
                                        <p className="text-xs text-gray-500">Comprehensive Medical Assistance</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="w-8 h-8 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                                            <Upload className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-900">1. Upload Medical Reports</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Upload photos or PDFs of blood panels, scans, or prescriptions.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-3.5 bg-primary-50/60 rounded-2xl border border-primary-100">
                                        <div className="w-8 h-8 rounded-xl bg-primary-600 text-white flex items-center justify-center shrink-0">
                                            <Brain className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-900">2. AI-Powered Insights</p>
                                            <p className="text-xs text-gray-600 mt-0.5">Translates complex medical terminology and biomarkers into clear summaries.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="w-8 h-8 rounded-xl bg-green-100 text-green-700 flex items-center justify-center shrink-0">
                                            <Stethoscope className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-900">3. Specialist Consultation</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Find matching doctors and share reports with explicit consent.</p>
                                        </div>
                                    </div>
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

                        {/* Doctor Platform Overview */}
                        <div className="relative">
                            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/10 space-y-4">
                                <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                                    <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center text-primary-300">
                                        <Stethoscope className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">Clinical Workflow Management</h3>
                                        <p className="text-xs text-gray-400">Tools designed for modern medical practices</p>
                                    </div>
                                </div>
                                <div className="space-y-3 pt-2">
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <p className="text-sm font-semibold text-white">Patient Record Intake</p>
                                        <p className="text-xs text-gray-400 mt-1">Review shared patient documents and AI summaries prior to consultations.</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <p className="text-sm font-semibold text-white">Consultation Scheduling</p>
                                        <p className="text-xs text-gray-400 mt-1">Configure appointment slots and manage upcoming patient visits.</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <p className="text-sm font-semibold text-white">Direct Communication</p>
                                        <p className="text-xs text-gray-400 mt-1">Provide clinical reviews and communicate securely with patients.</p>
                                    </div>
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
