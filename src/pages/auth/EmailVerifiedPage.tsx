import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Heart, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getHomeRouteForRole } from '../../lib/utils';
import { clearInitialEmailVerification, initialEmailVerification } from '../../lib/supabase';

export default function EmailVerifiedPage() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const errorMsg = initialEmailVerification?.error || null;

    useEffect(() => {
        return () => {
            clearInitialEmailVerification();
        };
    }, []);

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-gray-200/60 border border-gray-100 p-8 sm:p-10 text-center">
                <Link to="/" className="inline-flex items-center gap-2 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg">
                        <Heart className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-gray-900 tracking-tight">
                        IASO<span className="text-primary-600">Med</span>
                    </span>
                </Link>

                {isLoading ? (
                    <div className="py-8 flex flex-col items-center">
                        <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-4" />
                        <h1 className="text-xl font-bold text-gray-900">Verifying your email...</h1>
                        <p className="text-sm text-gray-500 mt-1">Please wait a moment while we confirm your account.</p>
                    </div>
                ) : errorMsg ? (
                    <div className="space-y-6">
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto text-red-600">
                            <AlertCircle className="w-9 h-9" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Verification Link Expired</h1>
                            <p className="text-sm text-gray-600 mt-2 leading-relaxed">{errorMsg}</p>
                        </div>
                        <Link
                            to="/login"
                            className="w-full py-3.5 px-6 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl transition-all inline-flex items-center justify-center gap-2"
                        >
                            Back to Sign In
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="w-16 h-16 bg-green-50 border border-green-100 rounded-2xl flex items-center justify-center mx-auto text-green-600">
                            <CheckCircle2 className="w-9 h-9" />
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold mb-3">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Email Confirmed
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">Mail Verified!</h1>
                            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                                Your email address has been verified successfully. Your IASO Med account is now active.
                            </p>
                        </div>

                        {isAuthenticated && user ? (
                            <Link
                                to={getHomeRouteForRole(user.role)}
                                className="w-full py-3.5 px-6 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/20 transition-all inline-flex items-center justify-center gap-2"
                            >
                                Go to Dashboard
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                className="w-full py-3.5 px-6 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/20 transition-all inline-flex items-center justify-center gap-2"
                            >
                                Sign In to Continue
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
