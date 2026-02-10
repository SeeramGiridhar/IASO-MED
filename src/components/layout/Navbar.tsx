import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const isLanding = location.pathname === '/';

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow">
                            <Heart className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900 tracking-tight">
                            IASO<span className="text-primary-600">Med</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {isLanding && !isAuthenticated ? (
                            <>
                                <a href="#features" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all">Features</a>
                                <a href="#how-it-works" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all">How It Works</a>
                                <a href="#for-doctors" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all">For Doctors</a>
                            </>
                        ) : isAuthenticated ? (
                            user?.role === 'patient' ? (
                                <>
                                    <Link to="/patient/dashboard" className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all">Dashboard</Link>
                                    <Link to="/patient/reports" className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all">Reports</Link>
                                    <Link to="/patient/doctors" className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all">Find Doctors</Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/doctor/dashboard" className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all">Dashboard</Link>
                                    <Link to="/doctor/reports" className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all">Reports</Link>
                                    <Link to="/doctor/schedule" className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all">Schedule</Link>
                                    <Link to="/doctor/profile" className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all">Practice Info</Link>
                                </>
                            )
                        ) : null}
                    </nav>

                    {/* CTA Buttons / User Menu */}
                    <div className="hidden md:flex items-center gap-3">
                        {!isAuthenticated ? (
                            <>
                                <Link to="/login" className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all">Sign In</Link>
                                <Link to="/register" className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/25 transition-all">Get Started</Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-4 pl-4 border-l border-gray-100">
                                <Link to={user?.role === 'doctor' ? '/doctor/profile' : '/patient/profile'} className="flex items-center gap-3 group">
                                    <div className="text-right hidden lg:block">
                                        <p className="text-xs font-bold text-gray-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{user?.name}</p>
                                        <p className="text-[10px] text-gray-500 font-medium capitalize">{user?.role}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-primary-600 group-hover:bg-primary-50 transition-all">
                                        <UserIcon className="w-5 h-5" />
                                    </div>
                                </Link>
                                <button
                                    onClick={logout}
                                    className="p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition">
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 shadow-xl py-4 px-4 space-y-1">
                    {isAuthenticated ? (
                        <>
                            <Link to={user?.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'} onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-primary-50 rounded-lg transition tracking-tight">Dashboard</Link>
                            <button onClick={() => { logout(); setMobileOpen(false); }} className="w-full text-left px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-2">
                                <LogOut className="w-4 h-4" /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition">Sign In</Link>
                            <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-semibold text-white bg-primary-600 rounded-xl">Get Started</Link>
                        </>
                    )}
                </div>
            )}
        </header>
    );
}
