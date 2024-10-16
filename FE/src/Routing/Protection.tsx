import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

const isTokenValid = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const expirationTime = localStorage.getItem('tokenExpirationDate');
    if (!expirationTime) return false;

    return new Date().getTime() < parseInt(expirationTime);
};

interface ProtectedRouteProps {
    children: ReactNode;
}

// ProtectedRoute component
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const tokenValid = isTokenValid();
    console.log(tokenValid);
    if (!tokenValid) {
        return <Navigate to="/auth" replace />;
    }

    return children;
};

export default ProtectedRoute;
