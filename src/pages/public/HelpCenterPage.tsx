import { useState } from 'react';
import { HelpCircle, Search, Brain, Shield, Calendar, Mail, Phone, ChevronDown } from 'lucide-react';

export default function HelpCenterPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [openCategory, setOpenCategory] = useState<string | null>('general');

    const categories = [
        {
            id: 'general',
            title: 'General & Getting Started',
            icon: HelpCircle,
            faqs: [
                {
                    q: 'What is IASO Med?',
                    a: 'IASO Med is an AI-powered healthcare management platform. It allows patients to upload complex medical lab reports, extracts all key biomarkers, explains the results in plain English, and helps connect with qualified doctors.',
                },
                {
                    q: 'Is IASO Med a replacement for a medical doctor?',
                    a: 'No. IASO Med is strictly an assistive health literacy and informational tool. The AI analysis does not constitute official medical diagnosis or treatment plans. Always consult certified healthcare professionals regarding health conditions.',
                },
                {
                    q: 'How do I create an account?',
                    a: 'Click "Sign Up" at the top right of the homepage. You can register as either a "Patient" (to upload reports and book visits) or a "Doctor" (to review patient records and manage your schedule).',
                },
            ],
        },
        {
            id: 'reports',
            title: 'Report Upload & AI Analysis',
            icon: Brain,
            faqs: [
                {
                    q: 'What file formats are supported?',
                    a: 'You can upload PDF documents, PNG, JPEG, and WEBP image files. High-resolution scans or well-lit smartphone camera photos of physical lab sheets work best.',
                },
                {
                    q: 'How long does the AI analysis take?',
                    a: 'Typically between 5 to 15 seconds. Our backend parses the text and images via Google Gemini 3.5 multimodal models and provides immediate biomarker extractions and recommendations.',
                },
                {
                    q: 'Can I upload multiple files for one test?',
                    a: 'Yes! The multi-attachment upload supports selecting multiple files or multi-page lab PDFs in a single submission.',
                },
                {
                    q: 'Can doctors see my uploaded reports?',
                    a: 'Only doctors with whom you have explicitly booked an appointment and consented to share reports can view them. By default, your reports are strictly private to your own account via Supabase Row-Level Security.',
                },
            ],
        },
        {
            id: 'appointments',
            title: 'Doctors & Appointments',
            icon: Calendar,
            faqs: [
                {
                    q: 'How do I search for a specialist?',
                    a: 'Go to "Find Doctors" from your Patient Dashboard. You can search by specialty (Cardiology, Endocrinology, General Physician, etc.), city, or physician name.',
                },
                {
                    q: 'How do I share my reports during booking?',
                    a: 'On the Appointment Booking screen, you will see a checklist of your uploaded reports. Check the ones you want the doctor to review before your consultation.',
                },
            ],
        },
        {
            id: 'privacy',
            title: 'Data Privacy & Security',
            icon: Shield,
            faqs: [
                {
                    q: 'How is my health data protected?',
                    a: 'All files are stored in private Supabase Storage buckets with AES-256 encryption at rest. Every database table enforces PostgreSQL Row-Level Security (RLS), ensuring no unauthorized user can access your data.',
                },
                {
                    q: 'Can I delete my medical reports?',
                    a: 'Yes, you can delete any uploaded report from your Reports list at any time. When deleted, the file is permanently purged from storage.',
                },
            ],
        },
    ];

    const filteredCategories = categories.map((cat) => ({
        ...cat,
        faqs: cat.faqs.filter(
            (faq) =>
                faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.a.toLowerCase().includes(searchQuery.toLowerCase())
        ),
    })).filter((cat) => cat.faqs.length > 0);

    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero */}
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
                        <HelpCircle className="w-4 h-4" />
                        IASO Med Support Center
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        How can we help you today?
                    </h1>
                    <p className="mt-3 text-base text-gray-600">
                        Find guides on uploading reports, understanding your AI results, and managing appointments.
                    </p>

                    {/* Search box */}
                    <div className="mt-8 relative max-w-xl mx-auto">
                        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search questions (e.g., upload, blood test, privacy, doctor)..."
                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* FAQ categories */}
                <div className="space-y-6 mb-16">
                    {filteredCategories.map((category) => {
                        const Icon = category.icon;
                        const isOpen = openCategory === category.id || searchQuery.length > 0;

                        return (
                            <div key={category.id} className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
                                <button
                                    onClick={() => setOpenCategory(isOpen && searchQuery.length === 0 ? null : category.id)}
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-gray-900">{category.title}</h2>
                                            <p className="text-xs text-gray-500">{category.faqs.length} articles</p>
                                        </div>
                                    </div>
                                    <ChevronDown
                                        className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {isOpen && (
                                    <div className="px-6 pb-6 pt-2 space-y-4 border-t border-gray-100">
                                        {category.faqs.map((faq) => (
                                            <div key={faq.q} className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100">
                                                <h3 className="text-sm font-bold text-gray-900 mb-1.5">{faq.q}</h3>
                                                <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {filteredCategories.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-3xl border border-gray-200">
                            <p className="text-gray-500 text-sm">No articles found matching &quot;{searchQuery}&quot;.</p>
                            <button
                                onClick={() => setSearchQuery('')}
                                className="mt-2 text-primary-600 font-semibold text-sm hover:underline"
                            >
                                Clear search
                            </button>
                        </div>
                    )}
                </div>

                {/* Direct support options */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 sm:p-10 text-white">
                    <div className="max-w-2xl">
                        <span className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-xs font-semibold uppercase tracking-wider">
                            Direct Support
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold mt-3 mb-2">Still have questions?</h2>
                        <p className="text-gray-300 text-sm leading-relaxed mb-6">
                            Our team is available to assist you with account setup, report interpretation questions, or technical issues.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <a
                                href="mailto:giridharpandu22@gmail.com"
                                className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/15 rounded-2xl border border-white/10 transition-colors"
                            >
                                <Mail className="w-5 h-5 text-primary-400 shrink-0" />
                                <div>
                                    <p className="text-xs text-gray-400">Email Support</p>
                                    <p className="text-sm font-semibold text-white">giridharpandu22@gmail.com</p>
                                </div>
                            </a>
                            <a
                                href="tel:+917569450282"
                                className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/15 rounded-2xl border border-white/10 transition-colors"
                            >
                                <Phone className="w-5 h-5 text-primary-400 shrink-0" />
                                <div>
                                    <p className="text-xs text-gray-400">Call / WhatsApp</p>
                                    <p className="text-sm font-semibold text-white">+91 75694 50282</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
