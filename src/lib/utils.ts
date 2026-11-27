import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getHomeRouteForRole(role?: 'patient' | 'doctor' | 'admin'): string {
    if (role === 'admin') return '/admin/verifications';
    if (role === 'doctor') return '/doctor/dashboard';
    return '/patient/dashboard';
}
