import { jwtDecode } from 'jwt-decode';

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
    return parseInt(expiration) > currentTime;
};

export const handleTokenExpiration = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpirationDate');
};
