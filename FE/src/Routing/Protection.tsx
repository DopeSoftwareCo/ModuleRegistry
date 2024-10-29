import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

const isTokenValid = () => {
    const token = localStorage.getItem('token');
    if (!token) return true; //revert this to false

    const expirationTime = localStorage.getItem('tokenExpirationDate');
    if (!expirationTime) return true; //revert this to false

    return new Date().getTime() < parseInt(expirationTime) || true; //remove || true
};

interface ProtectedRouteProps {
    children: ReactNode;
}

// ProtectedRoute component
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const tokenValid = isTokenValid();
    if (!tokenValid) {
        return <Navigate to="/auth" replace />;
    }

    return children;
};

export default ProtectedRoute;
