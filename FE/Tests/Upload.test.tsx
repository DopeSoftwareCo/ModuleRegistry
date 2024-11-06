import { describe, expect, it } from 'vitest';
import { customRender } from './TestUtils';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import Upload from '../src/Pages/Upload/Upload';

global.fetch = vitest.fn(() =>
    Promise.resolve({
        // Mock the properties of the Response object
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(), // You can create a new Headers object or mock it
        // Mock the json method to return the desired value
        json: () => Promise.resolve({ metadata: { ID: '123' } }),
        // Include any other properties needed by your tests
    } as Response)
);

describe('Upload Component', () => {
    it('Should render', () => {
        const { container } = customRender(<Upload />);
        expect(container).toBeTruthy();
    });

    it('toggles debloat checkbox', () => {
        customRender(<Upload />);

        const debloatCheckbox = screen.getByRole('checkbox') as HTMLInputElement;
        expect(debloatCheckbox.checked).toBe(false);

        fireEvent.click(debloatCheckbox);
        expect(debloatCheckbox.checked).toBe(true);

        fireEvent.click(debloatCheckbox);
        expect(debloatCheckbox.checked).toBe(false);
    });

    it('calls uploadFile and shows success message on successful upload', async () => {
        customRender(<Upload />);

        const uploadButton = screen.getByTestId('upload-button');
        fireEvent.click(uploadButton);

        await waitFor(() => {
            const successMessage = screen.getByText('ID: 123');
            expect(successMessage).toBeTruthy();
        });
    });
});
