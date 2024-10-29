import { describe, expect, it } from 'vitest';
import { customRender } from './TestUtils';
import Rating from '../src/Pages/Rating/Rating';
import { fireEvent, screen, waitFor } from '@testing-library/react';

const ratingsReturnMock = {
    BusFactor: 0.7156639616189147,
    BusFactorLatency: 0.20710853779031568,
    Correctness: 0.04802331124247505,
    CorrectnessLatency: 0.8299093497707466,
    RampUp: 0.3520062616889379,
    RampUpLatency: 0.9288899647102535,
    ResponsiveMaintainer: 0.96856337608516,
    ResponsiveMaintainerLatency: 0.7756779697093237,
    LicenseScore: 0.9669441532918734,
    LicenseScoreLatency: 0.6878973779218842,
    GoodPinningPractice: 0.027244474550505382,
    GoodPinningPracticeLatency: 0.37285573738463795,
    PullRequest: 0.8386764748484015,
    PullRequestLatency: 0.36501784271207427,
    NetScore: 0.9457644288553808,
    NetScoreLatency: 0.8812462041237201,
};

global.fetch = vitest.fn(() =>
    Promise.resolve({
        // Mock the properties of the Response object
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(), // You can create a new Headers object or mock it
        // Mock the json method to return the desired value
        json: () => Promise.resolve(ratingsReturnMock),
        // Include any other properties needed by your tests
    } as Response)
);

describe('Ratings Component', () => {
    it('Should render', () => {
        const { container } = customRender(<Rating />);
        expect(container).toBeTruthy();
    });
    it('Should return package ratings', async () => {
        customRender(<Rating />);
        fireEvent.click(screen.getByTestId('ratings-request-button'));

        await waitFor(() => {
            Object.keys(ratingsReturnMock).forEach((key) => {
                expect(screen.getByTestId(key)).toBeDefined();
            });
        });
    });
});
