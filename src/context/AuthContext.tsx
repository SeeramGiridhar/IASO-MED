/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

type UserRole = 'patient' | 'doctor' | 'admin';

interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const mapUser = useCallback(async (supabaseUser: SupabaseUser) => {
        const metaRole = (supabaseUser.user_metadata?.role as UserRole) || 'patient';
        const metaName = supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User';

        // Read authoritative role from public.profiles (allows DB-promoted admins)
        let dbRole: UserRole = metaRole;
        let dbName: string = metaName;
        try {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role, full_name')
                .eq('id', supabaseUser.id)
                .maybeSingle();

            if (profile?.role === 'admin' || profile?.role === 'doctor' || profile?.role === 'patient') {
                dbRole = profile.role;
            }
            if (profile?.full_name) {
                dbName = profile.full_name;
            }
        } catch {
            // Fall back cleanly to user_metadata if profile fetch fails transiently
        }

        setUser({
            id: supabaseUser.id,
            name: dbName,
            email: supabaseUser.email || '',
            role: dbRole
        });
    }, []);

    useEffect(() => {
        // Check active session on mount
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (session?.user) {
                await mapUser(session.user);
            }
            setIsLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                await mapUser(session.user);
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, [mapUser]);

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
