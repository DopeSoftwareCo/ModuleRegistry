/**
 * @author Ben Kanter
 * 
 * 
 * @param repo - Repository to be scored
 * @param rampup - rampup time score
 * @param correctness - correctness score
 * @param busFactor - bus factor score
 * @param responsive - responsiveness score
 * @param license - license score
 * 
 * @return - final score is an average of all scores except for the license. If the license if 0, final score is 0. 
 */

import { Repository, NDJSONRow } from '../Types/DataTypes'

export function finalScore<T>(repo: Repository<T>, rampup: number, correctness: number, busFactor: number, responsive: number, license: number): number {
    if (license == 0){
        return 0;
    }
    const averageScore = (rampup + correctness + busFactor + responsive)/4;
    return averageScore;
}