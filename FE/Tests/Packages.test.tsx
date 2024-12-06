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

const mockFetch = vi.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSuccessResponse),
    } as Response)
);

global.fetch = mockFetch;

describe('Packages Component', () => {
    it('Should render the component', () => {
        const { container } = customRender(<Packages />);
        expect(container).toBeTruthy();
    });

    it('Should allow adding a new request row', () => {
        customRender(<Packages />);

        // Simulate clicking "Add Request"
        fireEvent.click(screen.getByText('Add Request'));

        // Check if a new row is added
        const nameInputs = screen.getAllByPlaceholderText('Package Name');
        const versionInputs = screen.getAllByPlaceholderText('Version (optional)');

        expect(nameInputs).toHaveLength(2); // Default + 1 new
        expect(versionInputs).toHaveLength(2);
    });

    it('Should handle deleting a request row', () => {
        customRender(<Packages />);

        // Add a new request row
        fireEvent.click(screen.getByText('Add Request'));

        // Delete the second row
        const removeButtons = screen.getAllByText('Remove');
        fireEvent.click(removeButtons[1]);

        // Check if only the first row remains
        const nameInputs = screen.getAllByPlaceholderText('Package Name');
        expect(nameInputs).toHaveLength(1);
    });

    it('Should show an error if no package name is provided', async () => {
        customRender(<Packages />);

        // Simulate clicking "Find Packages" without filling any names
        fireEvent.click(screen.getByText('Find Packages'));

        // Wait for error to appear
        await waitFor(() => {
            expect(screen.getByText('Please provide at least one package name.')).toBeTruthy();
        });
    });

    it('Should handle API errors gracefully', async () => {
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: false,
                text: () => Promise.resolve('Error: Invalid package'),
            } as Response)
        );

        customRender(<Packages />);

        // Fill out the first row
        fireEvent.change(screen.getByPlaceholderText('Package Name'), {
            target: { value: 'invalid-package' },
        });

        // Simulate clicking "Find Packages"
        fireEvent.click(screen.getByText('Find Packages'));

        // Wait for error message
        await waitFor(() => {
            expect(screen.getByText('Error: Invalid package')).toBeTruthy();
        });
    });
});

describe('getPackagesRequest API Function', () => {
    it('Should return package data when the API call is successful', async () => {
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockSuccessResponse),
            } as Response)
        );

        const errorSetter = vi.fn();
        const result = await getPackagesRequest(
            [{ Name: 'john testing', Version: '1.2.4' }],
            errorSetter
        );

        expect(result).toBeTruthy();
        expect(result?.data).toBeTruthy();
        expect(errorSetter).not.toHaveBeenCalled();
    });

    it('Should call errorSetter on failed API call', async () => {
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: false,
                text: () => Promise.resolve('Error: Something went wrong'),
            } as Response)
        );

        const errorSetter = vi.fn();
        const result = await getPackagesRequest(
            [{ Name: 'invalid-package' }],
            errorSetter
        );

        expect(result).toBeUndefined();
        expect(errorSetter).toHaveBeenCalledWith('Error: Something went wrong');
    });

    it('Should handle network errors gracefully', async () => {
        global.fetch = vi.fn(() => Promise.reject(new Error('Network Error')));

        const errorSetter = vi.fn();
        const result = await getPackagesRequest(
            [{ Name: 'network-error-name', Version: 'network-error-version' }],
            errorSetter
        );

        expect(result).toBeUndefined();
        expect(errorSetter).toHaveBeenCalledWith('Network Error');
    });

    it('Should handle unknown errors gracefully', async () => {
        global.fetch = vi.fn(() => Promise.reject('Unknown Error'));

        const errorSetter = vi.fn();
        const result = await getPackagesRequest([{ Name: 'unknown-error-name' }], errorSetter);

        expect(result).toBeUndefined();
        expect(errorSetter).toHaveBeenCalledWith('An unknown error occurred in getPackagesRequest.');
    });
});
