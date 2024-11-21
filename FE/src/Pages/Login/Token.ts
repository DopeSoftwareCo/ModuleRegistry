import { jwtDecode, JwtPayload } from 'jwt-decode';
import { PermissionEnum, Role } from '../../BETypes/PermissionsRoles';

/**
 * @author John Leidy
 * @description This function is responsible for taking the token and storing it in the localStorage. This allows users to not need to login every time. Expiration is checked on all protected routes
 * @param token the token returned from the backend {@type string}
 */
export const decodeAndSetToken = (token: string) => {
    const decoded = jwtDecode(token.replace('Bearer ', ''));
    if (decoded.exp) {
        localStorage.setItem('tokenExpirationDate', (decoded.exp * 1000).toString());
        localStorage.setItem('token', token);
    }
};

export const isTokenExpired = () => {
    const expiration = localStorage.getItem('tokenExpirationDate');
    if (!expiration) {
        return true;
    }
    const currentTime = new Date().getTime();
    return parseInt(expiration) < currentTime;
};

export const handleTokenExpiration = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpirationDate');
};

export const getTokenPermsAndRoles = (token: string): { perm: PermissionEnum; role: Role } | undefined => {
    const decoded: JwtPayload & { metadata: { permission?: PermissionEnum; role?: Role } } = jwtDecode(token);
    if (!decoded.metadata.permission || !decoded.metadata.role) {
        return undefined;
    }
    return { perm: decoded.metadata.permission, role: decoded.metadata.role };
};
