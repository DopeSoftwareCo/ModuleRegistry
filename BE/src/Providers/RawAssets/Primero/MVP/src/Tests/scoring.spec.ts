import { beforeAll, describe, expect, it, jest } from '@jest/globals';
import { scoreRepositoriesArray, scoreRepository } from '../Scoring/scoring';
import { mockValidRepos } from '../TestUtils/constants';
import {
    getBusFactorFuncSpy,
    getCorrectnessSpy,
    getLicenseFuncSpy,
    getRampUpFuncSpy,
    getResponsiveFuncSpy,
} from '../TestUtils/mocks';
import { beforeEach } from 'node:test';

describe('Scoring', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {
            console.log('err');
        });
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });
    it('Should return a scored repository', async () => {
        const licenseFuncSpy = getLicenseFuncSpy(1);
        const responsiveFuncSpy = getResponsiveFuncSpy(1);
        const busFactorSpy = getBusFactorFuncSpy(1);
        const rampupSpy = getRampUpFuncSpy(1);
        const correctnessSpy = getCorrectnessSpy(1);
        const repo = await scoreRepository(mockValidRepos[0]);
        expect(repo.NDJSONRow.License).toBe(1);
        expect(repo.NDJSONRow.ResponsiveMaintainer).toBe(1);
        expect(licenseFuncSpy).toBeCalled();
        expect(responsiveFuncSpy).toBeCalled();
        expect(busFactorSpy).toBeCalled();
        expect(rampupSpy).toBeCalled();
        expect(correctnessSpy).toBeCalled();
    });
    it('Should return an array of scored repositories', async () => {
        const licenseFuncSpy = getLicenseFuncSpy(1);
        const responsiveFuncSpy = getResponsiveFuncSpy(1);
        const busFactorSpy = getBusFactorFuncSpy(1);
        const rampupSpy = getRampUpFuncSpy(1);
        const correctnessSpy = getCorrectnessSpy(1);
        const repos = await scoreRepositoriesArray(mockValidRepos);
        repos.forEach((repo) => {
            expect(repo.NDJSONRow.License).toBe(1);
            expect(repo.NDJSONRow.ResponsiveMaintainer).toBe(1);
        });
        expect(licenseFuncSpy).toBeCalled();
        expect(responsiveFuncSpy).toBeCalled();
        expect(busFactorSpy).toBeCalled();
        expect(correctnessSpy).toBeCalled();
        expect(rampupSpy).toBeCalled();
    });
});
