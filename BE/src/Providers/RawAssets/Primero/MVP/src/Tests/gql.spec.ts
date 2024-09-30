import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { requestFromGQL } from '../Requests/GitHub/gql';
import { getFetchSpy } from '../TestUtils/mocks';

/**
 * John Leidy
 * This block is responsible for testing the request we send to the GitHub GQL api.
 */
describe('Gql Request', () => {
    beforeEach(() => {
        //keep console errors out of the test output.
        jest.resetAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });
    it('should throw an error without a proper .evn alongside proper env variables', async () => {
        //set them to an incorrect value
        process.env.GITHUB_API_URL = undefined;
        process.env.GITHUB_TOKEN = undefined;
        const fetchSpy = getFetchSpy(
            {
                repository: {
                    type: 'some repo',
                    url: 'a url',
                },
            },
            200,
            false
        );
        try {
            await requestFromGQL('');
        } catch (err) {
            expect(err).toBeInstanceOf(Error);
            expect(fetchSpy).toHaveBeenCalledTimes(0);
            if (err instanceof Error) {
                expect(err.message).toBe(
                    'TOKEN NOT SET GG'
                );
            }
        }
    });

    it('should return undefined if a request error occurs', async () => {
        process.env.GITHUB_TOKEN=' ';
        const fetchSpy = getFetchSpy({}, 404, true);
        const res = await requestFromGQL('');
        expect(res).toBe(undefined);
        expect(fetchSpy).toHaveBeenCalledTimes(1);
    });
});
