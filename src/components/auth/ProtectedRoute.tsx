import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRole?: 'patient' | 'doctor';
}

export default function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRole && user?.role !== allowedRole) {
        return <Navigate to={user?.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'} replace />;
    }

    return <>{children}</>;
}
