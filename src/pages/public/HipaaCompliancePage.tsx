import { Shield, Lock, FileCheck2, Server, KeyRound, CheckCircle } from 'lucide-react';

export default function HipaaCompliancePage() {
    const safeguards = [
        {
            title: 'Administrative Safeguards',
            desc: 'Formal policies restricting data access to authorized personnel and enforcing role-based permissions.',
            items: [
                'Strict separation between patient and clinician roles',
                'Zero-trust API key segregation (server-side only)',
                'Consent-driven document sharing protocols',
                'Comprehensive security incident response plan',
            ],
        },
        {
            title: 'Physical Safeguards',
            desc: 'Cloud infrastructure hosted in ISO 27001, SOC 2 Type II, and HIPAA-compliant data centers.',
            items: [
                'Redundant tier-3 data center infrastructure via Supabase & AWS',
                'Continuous 24/7 biometric physical site access monitoring',
                'Automated encrypted geo-redundant database backups',
                'Secure hardware disposal and disk shredding standards',
            ],
        },
        {
            title: 'Technical Safeguards',
            desc: 'End-to-end cryptographic and database isolation controls ensuring data integrity.',
            items: [
                'AES-256 military-grade encryption for all stored files',
                'TLS 1.3 encryption for all data in transit across internet networks',
                'PostgreSQL Row-Level Security (RLS) guaranteeing data multi-tenancy isolation',
                '120-second expiring signed URLs for private medical file access',
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-4">
                        <Shield className="w-4 h-4 text-green-700" />
                        HIPAA & Security Standards
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        Healthcare Compliance & Security
                    </h1>
                    <p className="mt-4 text-base text-gray-600">
                        How IASO Med safeguards Protected Health Information (PHI) under Health Insurance Portability and Accountability Act (HIPAA) standards.
                    </p>
                </div>

                {/* Summary badges */}
                <div className="grid sm:grid-cols-3 gap-6 mb-16">
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center">
                        <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-3">
                            <Lock className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-gray-900">256-bit AES</h3>
                        <p className="text-xs text-gray-500 mt-1">Encrypted at rest across all database & storage tiers.</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center">
                        <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-3">
                            <FileCheck2 className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-gray-900">RLS Isolation</h3>
                        <p className="text-xs text-gray-500 mt-1">Zero cross-patient data leaks via PostgreSQL policies.</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                            <KeyRound className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-gray-900">Signed Access</h3>
                        <p className="text-xs text-gray-500 mt-1">Temporary 120-sec download tokens for all medical assets.</p>
                    </div>
                </div>

                {/* Safeguards */}
                <div className="space-y-8 mb-16">
                    {safeguards.map((section) => (
                        <div key={section.title} className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-2">{section.title}</h2>
                            <p className="text-sm text-gray-500 mb-6">{section.desc}</p>

                            <div className="grid sm:grid-cols-2 gap-4">
                                {section.items.map((item) => (
                                    <div key={item} className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                                        <span className="text-sm text-gray-700 font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* BAA Statement */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 sm:p-10 text-white">
                    <div className="flex items-start gap-4">
                        <Server className="w-8 h-8 text-primary-400 shrink-0" />
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Business Associate Agreements (BAA)</h3>
                            <p className="text-sm text-gray-300 leading-relaxed">
                                IASO Med utilizes infrastructure providers (including Supabase, Google Cloud Platform, and Vercel)
                                that support Business Associate Agreements (BAA), SOC 2 compliance, and enterprise healthcare audit logs.
                                Clinical organizations requiring an executed BAA can request documentation directly from our compliance office.
                            </p>
                            <div className="mt-4">
                                <a
                                    href="mailto:giridharpandu22@gmail.com?subject=HIPAA%20BAA%20Request"
                                    className="inline-flex items-center text-sm font-semibold text-primary-400 hover:text-primary-300 underline"
                                >
                                    Request BAA Information &rarr;
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
