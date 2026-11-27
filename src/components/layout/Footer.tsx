import { Link } from 'react-router-dom';
import { Heart, Mail, MapPin, Clock, HelpCircle } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 pb-24 sm:pb-0">
            {/* Main footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                                <Heart className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">
                                IASO<span className="text-primary-400">Med</span>
                            </span>
                        </Link>
                        <p className="text-sm text-gray-400 leading-relaxed mb-6">
                            AI-powered medical report analysis and healthcare management platform. Understand your health better.
                        </p>
                        <div className="flex items-center gap-3">
                            <a
                                href="https://github.com/SeeramGiridhar/IASO-MED"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition-colors text-gray-300 hover:text-white"
                                aria-label="GitHub Repository"
                                title="GitHub Repository"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
                                <span className="sr-only">GitHub</span>
                            </a>
                            <a
                                href="mailto:support@iasomed.com"
                                className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition-colors text-gray-300 hover:text-white"
                                aria-label="Email Support"
                                title="Contact Support via Email"
                            >
                                <Mail className="w-4 h-4" aria-hidden="true" />
                                <span className="sr-only">Email Support</span>
                            </a>
                            <Link
                                to="/help"
                                className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition-colors text-gray-300 hover:text-white"
                                aria-label="Help Center"
                                title="Help Center"
                            >
                                <HelpCircle className="w-4 h-4" aria-hidden="true" />
                                <span className="sr-only">Help Center</span>
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h3>
                        <ul className="space-y-3">
                            <li><a href="/#features" className="text-sm hover:text-primary-400 transition-colors">Features</a></li>
                            <li><a href="/#how-it-works" className="text-sm hover:text-primary-400 transition-colors">How It Works</a></li>
                            <li><a href="/#for-doctors" className="text-sm hover:text-primary-400 transition-colors">For Doctors</a></li>
                            <li><Link to="/register" className="text-sm hover:text-primary-400 transition-colors">Sign Up</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Resources</h3>
                        <ul className="space-y-3">
                            <li><Link to="/help" className="text-sm hover:text-primary-400 transition-colors">Help Center</Link></li>
                            <li><Link to="/privacy" className="text-sm hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="text-sm hover:text-primary-400 transition-colors">Terms of Service</Link></li>
                            <li><Link to="/hipaa" className="text-sm hover:text-primary-400 transition-colors">HIPAA Compliance</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact &amp; Support</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-primary-400" /> support@iasomed.com</li>
                            <li className="flex items-center gap-2 text-sm"><Clock className="w-4 h-4 text-primary-400" /> Mon – Fri, 9:00 AM – 6:00 PM IST</li>
                            <li className="flex items-start gap-2 text-sm"><MapPin className="w-4 h-4 text-primary-400 mt-0.5" /> Hyderabad, India</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-gray-300">&copy; {new Date().getFullYear()} IASO Med. All rights reserved.</p>
                    <p className="text-xs text-gray-300">HIPAA-Ready Architecture &bull; 256-bit AES Encryption &bull; Role-Based Access Control</p>
                </div>
            </div>
        </footer>
    );
}
