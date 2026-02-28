import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">
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
                            <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition-colors">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.384 4.482A13.944 13.944 0 011.671 3.149a4.916 4.916 0 001.523 6.574 4.897 4.897 0 01-2.229-.616v.062a4.916 4.916 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" /></svg>
                            </a>
                            <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition-colors">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.685c.223-.198-.054-.308-.346-.11l-6.4 4.02-2.76-.918c-.6-.187-.612-.6.125-.89l10.782-4.156c.5-.18.943.12.78.89z" /></svg>
                            </a>
                            <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition-colors">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h4>
                        <ul className="space-y-3">
                            <li><a href="#features" className="text-sm hover:text-primary-400 transition-colors">Features</a></li>
                            <li><a href="#how-it-works" className="text-sm hover:text-primary-400 transition-colors">How It Works</a></li>
                            <li><a href="#" className="text-sm hover:text-primary-400 transition-colors">Pricing</a></li>
                            <li><Link to="/register" className="text-sm hover:text-primary-400 transition-colors">Sign Up</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Resources</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-sm hover:text-primary-400 transition-colors">Help Center</a></li>
                            <li><a href="#" className="text-sm hover:text-primary-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="text-sm hover:text-primary-400 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="text-sm hover:text-primary-400 transition-colors">HIPAA Compliance</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-primary-400" /> giridharpandu22@gmail.com</li>
                            <li className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-primary-400" /> +91 75694 50282</li>
                            <li className="flex items-start gap-2 text-sm"><MapPin className="w-4 h-4 text-primary-400 mt-0.5" /> Hyderabad, India</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} IASO Med. All rights reserved.</p>
                    <p className="text-xs text-gray-500">HIPAA Compliant &bull; SOC 2 Certified &bull; 256-bit Encryption</p>
                </div>
            </div>
        </footer>
    );
}
