import { Shield, Lock, Eye, Database, UserCheck, AlertTriangle } from 'lucide-react';

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
                        <Shield className="w-4 h-4" />
                        Patient Privacy & Security
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Privacy Policy</h1>
                    <p className="mt-2 text-sm text-gray-500">Effective Date: November 2026 &bull; Last Updated: November 2026</p>
                </div>

                <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-sm space-y-10 text-gray-700 leading-relaxed text-sm sm:text-base">
                    {/* Overview */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-primary-600" />
                            1. Our Commitment to Your Health Privacy
                        </h2>
                        <p>
                            At <strong>IASO Med</strong>, we treat your medical and diagnostic records with the highest degree of confidentiality.
                            We believe that your health data belongs exclusively to you. This Privacy Policy details the types of information we collect,
                            how it is protected, and your strict rights regarding your Protected Health Information (PHI).
                        </p>
                    </section>

                    {/* Information We Collect */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <Database className="w-5 h-5 text-primary-600" />
                            2. Information We Collect
                        </h2>
                        <ul className="list-disc pl-5 space-y-2 text-gray-600">
                            <li>
                                <strong>Account Information:</strong> Name, email address, password hash, role (Patient or Healthcare Provider), and contact number.
                            </li>
                            <li>
                                <strong>Medical & Diagnostic Documents:</strong> Lab reports, blood panels, scans, prescription notes, and personal health notes you upload.
                            </li>
                            <li>
                                <strong>Extracted Biomarker Data:</strong> Structured clinical markers (e.g., Hemoglobin, Glucose, Cholesterol, Platelets) extracted by our AI engine.
                            </li>
                            <li>
                                <strong>Doctor Consultation Data:</strong> Appointment dates, specialist consultation history, and reports explicitly authorized by you for sharing with doctors.
                            </li>
                        </ul>
                    </section>

                    {/* How Data Is Used */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <Eye className="w-5 h-5 text-primary-600" />
                            3. How We Use Your Data
                        </h2>
                        <p className="mb-3">We use your information exclusively to:</p>
                        <ul className="list-disc pl-5 space-y-2 text-gray-600">
                            <li>Process and explain your medical reports in clear, accessible language.</li>
                            <li>Enable secure, consent-based document sharing with certified physicians you choose to consult.</li>
                            <li>Track longitudinal biomarker trends across sequential blood tests.</li>
                            <li>Provide interactive, context-aware answers to your queries through our AI health chatbot.</li>
                        </ul>
                        <div className="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-800">
                                <strong>We never sell your data:</strong> IASO Med does not monetize patient records, share diagnostic outcomes with insurance brokers, or sell health metrics to advertisers.
                            </p>
                        </div>
                    </section>

                    {/* Technical Safeguards */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary-600" />
                            4. Technical Safeguards & Encryption
                        </h2>
                        <p className="mb-3">
                            Our technical architecture adheres to modern healthcare data standards:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-gray-600">
                            <li><strong>Encryption in Transit:</strong> All web and API traffic is secured using TLS 1.3 protocol.</li>
                            <li><strong>Encryption at Rest:</strong> All uploaded files and database records are encrypted with AES-256 standard encryption.</li>
                            <li><strong>Row-Level Security (RLS):</strong> PostgreSQL RLS ensures that each patient record can only be read by its authenticated creator or explicitly authorized doctor.</li>
                            <li><strong>Expiring Signed URLs:</strong> Report file downloads use time-limited signed URLs that expire after 120 seconds to prevent unauthorized link sharing.</li>
                        </ul>
                    </section>

                    {/* Your Rights */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <UserCheck className="w-5 h-5 text-primary-600" />
                            5. Your Rights & Data Deletion
                        </h2>
                        <p>
                            You maintain complete autonomy over your health records. You may at any time:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-gray-600 mt-2">
                            <li>Delete individual medical reports, which permanently purges the file from cloud storage.</li>
                            <li>Revoke doctor access to shared reports immediately.</li>
                            <li>Request full account and data deletion by contacting our privacy compliance desk at <a href="mailto:giridharpandu22@gmail.com" className="text-primary-600 underline">giridharpandu22@gmail.com</a>.</li>
                        </ul>
                    </section>

                    {/* Contact */}
                    <section className="pt-6 border-t border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-2">Privacy Officer Contact</h3>
                        <p className="text-gray-600 text-sm">
                            IASO Med Healthcare Technologies<br />
                            Hyderabad, Telangana, India<br />
                            Email: <a href="mailto:giridharpandu22@gmail.com" className="text-primary-600 hover:underline">giridharpandu22@gmail.com</a><br />
                            Phone: +91 75694 50282
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
