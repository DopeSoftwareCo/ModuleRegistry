import { describe, expect, it, vi } from 'vitest';
import { customRender } from './TestUtils';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import Packages from '../src/Pages/Packages/Packages';
import { getPackagesRequest } from '../src/Pages/Packages/Requests';

const mockSuccessResponse = {
    data: [
        {
            Name: 'john testing',
            Version: '1.2.4',
        },
    ],
};

global.fetch = vi.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSuccessResponse),
    } as Response)
);

describe('Packages Component', () => {
    it('Should render the component', () => {
        const { container } = customRender(<Packages />);
        expect(container).toBeTruthy();
    });

    it('Should handle error messages if API call fails', async () => {
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: false,
                text: () => Promise.resolve('Error: Package not found'),
            } as Response)
        );

        customRender(<Packages />);

        // Simulate user input
        fireEvent.change(screen.getByPlaceholderText('Package Name'), {
            target: { value: 'invalid-package' },
        });
        fireEvent.change(screen.getByPlaceholderText('Version Query'), {
            target: { value: '^2.0.0' },
        });

        // Simulate button click
        fireEvent.click(screen.getByTestId('packages-request-button'));

        // Wait for error message
        await waitFor(() => {
            expect(screen.getByText('Error: Package not found')).toBeTruthy();
        });
    });
});

describe('getPackagesRequest API Function', () => {
    it('should return package data when the API call is successful', async () => {
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockSuccessResponse),
            } as Response)
        );

        const errorSetter = vi.fn();
        const result = await getPackagesRequest('1.2.4', 'john testing', errorSetter);

        expect(result).toBeTruthy();
        expect(errorSetter).not.toHaveBeenCalled();
    });

    it('should call errorSetter on failed API call', async () => {
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: false,
                text: () => Promise.resolve('Error: Something went wrong'),
            } as Response)
        );

        const errorSetter = vi.fn();
        const result = await getPackagesRequest('^2.0.0', 'invalid-package', errorSetter);

        expect(result).toBeUndefined();
        expect(errorSetter).toHaveBeenCalledWith('Error: Something went wrong');
    });

    it('should handle network errors gracefully', async () => {
        global.fetch = vi.fn(() => Promise.reject(new Error('Network Error')));

        const errorSetter = vi.fn();
        const result = await getPackagesRequest('network-error-version', 'network-error-name', errorSetter);

        expect(result).toBeUndefined();
        expect(errorSetter).toHaveBeenCalledWith('Network Error');
    });

    it('should handle unknown errors gracefully', async () => {
        global.fetch = vi.fn(() => Promise.reject('Unknown Error'));

        const errorSetter = vi.fn();
        const result = await getPackagesRequest('unknown-error-version', 'unknown-error-name', errorSetter);

        expect(result).toBeUndefined();
        expect(errorSetter).toHaveBeenCalledWith('An unknown error occurred in getPackagesRequest.');
    });
});
