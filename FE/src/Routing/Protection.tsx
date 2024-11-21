import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { PermissionEnum, Role } from '../BETypes/PermissionsRoles';
import { getTokenPermsAndRoles } from '../Pages/Login/Token';

const isTokenValid = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const expirationTime = localStorage.getItem('tokenExpirationDate');
    if (!expirationTime) return false;

    return new Date().getTime() < parseInt(expirationTime);
};

const userHasProperRole = (validRoles?: Role[]) => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    const userRole = getTokenPermsAndRoles(token)?.role;
    if (!userRole) return false;
    if (!validRoles?.includes(userRole)) return false;
    return true;
};

const userHasProperPermission = (validPermissions?: PermissionEnum[]) => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    const userPerm = getTokenPermsAndRoles(token)?.perm;
    if (!userPerm) return false;
    if (!validPermissions?.includes(userPerm)) return false;
    return true;
};

interface ProtectedRouteProps {
    children: ReactNode;
    validPermissions?: PermissionEnum[];
    validRoles?: Role[];
}

// ProtectedRoute component
const ProtectedRoute = ({ children, validPermissions, validRoles }: ProtectedRouteProps) => {
    const tokenValid = isTokenValid();
    if (!tokenValid || !userHasProperPermission(validPermissions) || !userHasProperRole(validRoles)) {
        return <Navigate to="/permroleerror" replace />;
    }

    return children;
};

export default ProtectedRoute;
