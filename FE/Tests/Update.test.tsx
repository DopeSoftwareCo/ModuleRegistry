import { describe, expect, it } from 'vitest';
import { customRender } from './TestUtils';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import Update from '../src/Pages/Update/Update';

global.fetch = vitest.fn(() =>
    Promise.resolve({
        // Mock the properties of the Response object
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(), // You can create a new Headers object or mock it
        // Mock the json method to return the desired value
        text: () => Promise.resolve('Version is updated.'),
        // Include any other properties needed by your tests
    } as Response)
);

describe('Update Component', () => {
    it('Should render', () => {
        const { container } = customRender(<Update />);
        expect(container).toBeTruthy();
    });
    it('calls update and shows proper success message', async () => {
        customRender(<Update />);

        const uploadButton = screen.getByTestId('update-button');
        fireEvent.click(uploadButton);

        await waitFor(() => {
            const successMessage = screen.getByText('Version is updated.');
            expect(successMessage).toBeTruthy();
        });
    });
});
