import { describe, expect, it } from '@jest/globals';
import { responsiveFunction } from '../Scoring/responsiveFunction';
import { mockValidRepos } from '../TestUtils/constants';

describe('Responsive Scoring Function', () => {
    it('Should return 0 if the number isNAN', () => {
        const score = responsiveFunction(mockValidRepos[0]);
        expect(score).toBe(0);
    });
});
