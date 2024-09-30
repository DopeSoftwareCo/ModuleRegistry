import { describe, expect, it } from '@jest/globals';
import { licenseFunction } from '../Scoring/licenseFunction';
import { licenseScoringMocks } from '../TestUtils/constants';

describe('License Scoring', () => {
    it('Should return 0 with a KNOWN invalid license', () => {
        const score = licenseFunction(licenseScoringMocks.repoWithInvalidLicense);
        expect(score).toBe(0);
    });
    it('Should return 1 with a KNOWN valid license', () => {
        const score = licenseFunction(licenseScoringMocks.repoWithValidLicense);
        expect(score).toBe(1);
    });
});
