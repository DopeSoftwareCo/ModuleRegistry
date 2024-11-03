import { describe, expect, it } from 'vitest';
import { customRender } from './TestUtils';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import Reset from '../src/Pages/Reset/Reset';

global.fetch = vitest.fn(() =>
    Promise.resolve({
        // Mock the properties of the Response object
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(), // You can create a new Headers object or mock it
        // Mock the json method to return the desired value
        text: () => Promise.resolve('Registry is reset.'),
        // Include any other properties needed by your tests
    } as Response)
);

describe('Reset Component', () => {
    it('Should render', () => {
        const { container } = customRender(<Reset />);
        expect(container).toBeTruthy();
    });
    it('Should return packages', async () => {
        customRender(<Reset />);
        fireEvent.click(screen.getByTestId('reset-button'));
        await waitFor(() => {
            const successMessage = screen.getByText('Registry is reset.');
            expect(successMessage).toBeTruthy();
        });
    });
});
