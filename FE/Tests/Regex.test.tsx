import { describe, expect, it } from 'vitest';
import { customRender } from './TestUtils';
import Regex from '../src/Pages/Regex/Regex';
import { fireEvent, screen, waitFor } from '@testing-library/react';

const regexReturnMock = [
    {
        Name: 'some name1',
        Version: 'some version1',
    },
    {
        Name: 'some name2',
        Version: 'some version2',
    },
];

global.fetch = vitest.fn(() =>
    Promise.resolve({
        // Mock the properties of the Response object
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(), // You can create a new Headers object or mock it
        // Mock the json method to return the desired value
        json: () => Promise.resolve(regexReturnMock),
        // Include any other properties needed by your tests
    } as Response)
);

describe('Regex Component', () => {
    it('Should render', () => {
        const { container } = customRender(<Regex />);
        expect(container).toBeTruthy();
    });
    it('Should return packages', async () => {
        customRender(<Regex />);
        fireEvent.click(screen.getByTestId('regex-search-button'));
        await waitFor(() => {
            regexReturnMock.forEach((p) => {
                expect(screen.getByTestId(p.Name)).toBeDefined();
            });
        });
    });
});
