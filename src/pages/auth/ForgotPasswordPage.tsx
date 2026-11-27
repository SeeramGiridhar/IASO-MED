import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Heart, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
                redirectTo: `${window.location.origin}/login`,
            });
            if (resetError) throw resetError;
            setSent(true);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to send password reset email.';
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="relative w-full max-w-md">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10">
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg">
                                <Heart className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900 tracking-tight">
                                IASO<span className="text-primary-600">Med</span>
                            </span>
                        </Link>
                        <h1 className="mt-4 text-2xl font-bold text-gray-900">Reset Password</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Enter your registered email and we&apos;ll send a recovery link.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm font-medium">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    {sent ? (
                        <div className="text-center space-y-6">
                            <div className="p-5 bg-green-50 border border-green-100 rounded-2xl flex flex-col items-center gap-2 text-green-800">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                                <p className="font-bold text-sm">Password reset link sent!</p>
                                <p className="text-xs text-green-700 leading-relaxed">
                                    Please check <strong>{email}</strong> (and your spam folder) for the recovery link.
                                </p>
                            </div>
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-primary-600 text-white font-bold rounded-2xl hover:bg-primary-700 transition-all"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Sign In
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="reset-email" className="text-sm font-bold text-gray-700 ml-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        id="reset-email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (error) setError(null);
                                        }}
                                        placeholder="you@example.com"
                                        className="w-full pl-11 pr-4 py-3 bg-white border-2 border-gray-100 rounded-xl focus:border-primary-500 focus:outline-none transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-primary-600 text-white font-bold rounded-2xl shadow-xl shadow-primary-500/20 hover:bg-primary-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Sending Link...
                                    </>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </button>
                        </form>
                    )}

                    <p className="mt-8 text-center text-sm text-gray-600">
                        Remember your password?{' '}
                        <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
                            Back to Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
