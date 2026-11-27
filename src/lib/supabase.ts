import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dfwmhnwhepwtrbfrfdje.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_UtW6L0TeoWlHOEGMX3grsQ_Jej-5Twx';

export interface EmailVerificationCallback {
    error: string | null;
}

function detectEmailVerificationCallback(): EmailVerificationCallback | null {
    if (typeof window === 'undefined') return null;
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const searchParams = new URLSearchParams(window.location.search);
    const authType = hashParams.get('type') || searchParams.get('type');
    const authError = hashParams.get('error_description') || searchParams.get('error_description');
    const isVerifyPath = window.location.pathname.endsWith('/verify-email');

    if (authType === 'signup' || authType === 'email' || (isVerifyPath && (searchParams.has('code') || Boolean(authError)))) {
        return { error: authError ? authError.replace(/\+/g, ' ') : null };
    }
    return null;
}

export let initialEmailVerification: EmailVerificationCallback | null = detectEmailVerificationCallback();

export function clearInitialEmailVerification() {
    initialEmailVerification = null;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
