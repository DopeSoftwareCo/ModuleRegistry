import { describe, expect, it } from 'vitest';
import { customRender } from './TestUtils';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { PackageFromAPIDownload } from '../src/Models/Models';
import Download from '../src/Pages/Download/Download';

const downloadReturnMock: PackageFromAPIDownload = {
    metadata: {
        Name: 'Mocked package name',
        ID: 'TEST-ID',
        Version: 'TEST-Version',
    },
    data: {
        Content: 'MOCK CONTENT',
        URL: 'MOCK URL',
        JSProgram: 'MOCK JSPROGRAM',
    },
};

global.fetch = vitest.fn(() =>
    Promise.resolve({
        // Mock the properties of the Response object
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(), // You can create a new Headers object or mock it
        // Mock the json method to return the desired value
        json: () => Promise.resolve(downloadReturnMock),
        // Include any other properties needed by your tests
    } as Response)
);

describe('Download Component', () => {
    it('Should render', () => {
        const { container } = customRender(<Download />);
        expect(container).toBeTruthy();
    });
    it('Should return packages', async () => {
        customRender(<Download />);
        fireEvent.click(screen.getByTestId('download-search-button'));
        await waitFor(() => {
            Object.keys(downloadReturnMock.metadata).forEach((key) =>
                expect(screen.getByTestId(key)).toBeDefined()
            );
        });
    });
});
