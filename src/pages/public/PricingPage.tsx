import { Link } from 'react-router-dom';
import { Check, Zap, Sparkles, Shield, ArrowRight, HelpCircle } from 'lucide-react';

export default function PricingPage() {
    const plans = [
        {
            name: 'Free Patient',
            tagline: 'Ideal for individuals managing personal health records.',
            price: '₹0',
            period: 'forever',
            popular: false,
            ctaText: 'Get Started Free',
            ctaLink: '/register',
            features: [
                'Up to 5 AI report analyses per month',
                'Comprehensive biomarker extraction',
                'Plain-language medical summary',
                'Secure 256-bit encrypted vault',
                'Doctor directory & profile browsing',
                'Standard email support',
            ],
        },
        {
            name: 'Pro Patient',
            tagline: 'For individuals & families needing frequent medical tracking.',
            price: '₹499',
            period: 'per month',
            popular: true,
            ctaText: 'Start 14-Day Free Trial',
            ctaLink: '/register',
            badge: 'Most Popular',
            features: [
                'Unlimited AI medical report analyses',
                'Longitudinal biomarker trend tracking',
                'Priority Gemini 3.5 AI inference engine',
                'Direct appointment booking with specialists',
                'Selective report sharing with doctors',
                'AI Chatbot health assistant 24/7',
                'Export insights as PDF summaries',
            ],
        },
        {
            name: 'Healthcare Provider',
            tagline: 'For doctors, clinics, and diagnostic centers.',
            price: '₹1,999',
            period: 'per month',
            popular: false,
            ctaText: 'Join as Doctor',
            ctaLink: '/register',
            features: [
                'Clinical intake dashboard',
                'Pre-consultation AI patient summaries',
                'Online calendar & slot management',
                'Secure HIPAA-compliant patient communication',
                'Verified doctor profile badge',
                'Digital prescription & notes storage',
                'Dedicated account manager',
            ],
        },
    ];

    const faqs = [
        {
            q: 'Can I use IASO Med for free?',
            a: 'Yes! Our Free Patient tier allows you to upload and analyze up to 5 medical reports every month with full biomarker extraction and plain-language summaries at zero cost.',
        },
        {
            q: 'Is my medical data sold to advertisers?',
            a: 'Never. IASO Med strictly adheres to HIPAA privacy standards. Your medical records, extracted health data, and identity are never sold, rented, or used for commercial advertising.',
        },
        {
            q: 'What types of reports can IASO Med analyze?',
            a: 'IASO Med supports blood test panels (CBC, Lipid, Metabolic, Thyroid), urine tests, radiology reports (X-ray, MRI, CT summary findings), biopsy summaries, and doctor prescription notes.',
        },
        {
            q: 'Can I cancel or switch my plan anytime?',
            a: 'Yes, there are no lock-in contracts. You can upgrade, downgrade, or cancel your subscription at any time right from your account profile.',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
                        <Sparkles className="w-4 h-4" />
                        Transparent Healthcare Pricing
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
                        Predictable plans for patients and clinicians
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Choose the right plan to understand your lab tests, track vital trends, and manage your clinical consultations.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid lg:grid-cols-3 gap-8 items-stretch mb-20">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative flex flex-col bg-white rounded-3xl p-8 border transition-all duration-300 ${
                                plan.popular
                                    ? 'border-primary-500 shadow-2xl shadow-primary-500/15 ring-2 ring-primary-500/20'
                                    : 'border-gray-200 shadow-sm hover:shadow-md'
                            }`}
                        >
                            {plan.badge && (
                                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-xs font-bold rounded-full tracking-wider uppercase shadow-md">
                                    {plan.badge}
                                </span>
                            )}

                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
                                <p className="text-sm text-gray-500 mt-1 min-h-[40px]">{plan.tagline}</p>
                            </div>

                            <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-gray-100">
                                <span className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">{plan.price}</span>
                                <span className="text-sm text-gray-500 font-medium">/ {plan.period}</span>
                            </div>

                            <div className="flex-1 space-y-3.5 mb-8">
                                <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">Features Included</p>
                                {plan.features.map((feature) => (
                                    <div key={feature} className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 mt-0.5">
                                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                                        </div>
                                        <span className="text-sm text-gray-700 leading-snug">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Link
                                to={plan.ctaLink}
                                className={`w-full py-3.5 px-6 rounded-2xl font-semibold text-center text-sm transition-all flex items-center justify-center gap-2 group ${
                                    plan.popular
                                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:from-primary-600 hover:to-primary-700'
                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                            >
                                {plan.ctaText}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Trust bar */}
                <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm max-w-4xl mx-auto mb-20">
                    <div className="grid sm:grid-cols-3 gap-6 text-center">
                        <div className="flex flex-col items-center">
                            <Shield className="w-8 h-8 text-green-600 mb-2" />
                            <h3 className="font-bold text-gray-900">Zero Risk Guarantee</h3>
                            <p className="text-xs text-gray-500 mt-1">Start free without a credit card. Upgrade whenever you need.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <Zap className="w-8 h-8 text-primary-600 mb-2" />
                            <h3 className="font-bold text-gray-900">Live AI Analysis</h3>
                            <p className="text-xs text-gray-500 mt-1">Powered by Google Gemini 3.5 Flash for high-precision extraction.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <HelpCircle className="w-8 h-8 text-blue-600 mb-2" />
                            <h3 className="font-bold text-gray-900">Healthcare Privacy</h3>
                            <p className="text-xs text-gray-500 mt-1">Row-Level Security & AES-256 encrypted storage on Supabase.</p>
                        </div>
                    </div>
                </div>

                {/* FAQ section */}
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
                        <p className="text-sm text-gray-500 mt-2">Have questions about IASO Med pricing? We have answers.</p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq) => (
                            <div key={faq.q} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                                <h3 className="text-base font-bold text-gray-900">{faq.q}</h3>
                                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <p className="text-sm text-gray-500">
                            Have specific clinical or enterprise needs?{' '}
                            <a href="mailto:support@iasomed.com" className="text-primary-600 font-semibold hover:underline">
                                Contact our team
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
