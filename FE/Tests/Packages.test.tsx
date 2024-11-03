import { describe, expect, it } from 'vitest';
import { customRender } from './TestUtils';
import { PackagesComponent } from '../src/Components/PackagesComponent/PackagesComponent';
import { act } from 'react';

const dbPackagesReturnMock = {
    packages: [
        {
            metadata: {
                License: {
                    name: 'MIT',
                    spxId: 'MIT',
                    url: 'https://opensource.org/licenses/MIT',
                },
                Name: 'john testing',
                Version: '1.2.4',
                Uploader: 'Uploader123',
                IsExternal: true,
                Safety: 'vetted',
                IsSecret: false,
                Visibility: 'public',
                Availability: 0.3058709288105783,
                PrivelegedGroup: 0.6630986290544534,
            },
            data: {
                Content: 'aiweifajsdf test tims pr',
                JSProgram: 'console.log("Hello, World!");',
            },
            RampupTime: {
                score: 0.2568809568471899,
                latency: 0.9976598133306538,
            },
            Correctness: {
                score: 0.8170959276780878,
                latency: 0.3705266046187248,
            },
            BusFactor: {
                score: 0.542650225158481,
                latency: 0.9899079992228685,
            },
            Responsiveness: {
                score: 0.18048850899135305,
                latency: 0.9515561018045346,
            },
            LicenseCompatibility: {
                score: 0.1805268468347092,
                latency: 0.25596459031047125,
            },
            VersionDependence: {
                score: 0.5804072595861021,
                latency: 0.9870006040419823,
            },
            MergeRestriction: {
                score: 0.2444168732830374,
                latency: 0.7724561726242447,
            },
            IndividualSizeCost: {
                score: 0.6491787867221583,
                latency: 0.8024375060988262,
            },
            GoodPinningPractice: {
                score: 0.31672590516133936,
                score_latency: 0.013451112635370022,
            },
            PullRequest: {
                score: 0.9086641943929732,
                score_latency: 0.7715877510655449,
            },
            TotalSizeCost: {
                score: 0.4107127201138103,
                score_latency: 0.30487035692813924,
            },
            FinalRating: {
                score: 0.13894952020715956,
                score_latency: 0.6285748812348386,
            },
            _id: '671d7e142d7f456597916aed',
            Title: 'Example Package',
            repoUrl: 'url',
            createdAt: '2024-10-26T23:41:08.039Z',
            updatedAt: '2024-11-01T19:57:22.854Z',
            __v: 0,
        },
    ],
};

global.fetch = vitest.fn(() =>
    Promise.resolve({
        // Mock the properties of the Response object
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(), // You can create a new Headers object or mock it
        // Mock the json method to return the desired value
        json: () => Promise.resolve(dbPackagesReturnMock),
        // Include any other properties needed by your tests
    } as Response)
);

describe('Packages Component', () => {
    it('Should render', async () => {
        await act(async () => {
            const { container } = customRender(<PackagesComponent />);
            expect(container).toBeTruthy();
        });
    });
});
