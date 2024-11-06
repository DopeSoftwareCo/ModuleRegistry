// src/utils/tokenUtils.test.ts

import { isTokenExpired, handleTokenExpiration, decodeAndSetToken } from '../src/Pages/Login/Token';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { localStorageMock, testToken } from './Mocks';
// Mock localStorage
const mockLocalStorage = (() => {
    let store: { [key: string]: string } = {};

    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
});

// Replace global localStorage with our mock
beforeAll(() => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
});

afterAll(() => {
    // Clean up
    localStorageMock.clear();
});

describe('Token handling functions', () => {
    it('should set token and expiration date', () => {
        const token = `Bearer ${testToken}`;

        decodeAndSetToken(token);

        expect(localStorage.getItem('token')).toBe(token);
        expect(localStorage.getItem('tokenExpirationDate')).not.toBe(null);
    });
    it('should check if token is expired', () => {
        localStorage.setItem('tokenExpirationDate', (Date.now() + 100000).toString());
        expect(isTokenExpired()).toBe(false);

        localStorage.setItem('tokenExpirationDate', (Date.now() - 10000).toString());
        expect(isTokenExpired()).toBe(true); // Should be expired
    });

    it('should handle token expiration', () => {
        localStorage.setItem('token', 'Bearer testtoken');
        handleTokenExpiration();

        expect(localStorage.getItem('token')).toBe(null);
        expect(localStorage.getItem('tokenExpirationDate')).toBe(null);
    });

    it('should decode and set token', () => {
        decodeAndSetToken(`Bearer ${testToken}`);
        expect(localStorage.getItem('token')).toBe(`Bearer ${testToken}`);
    });
});
