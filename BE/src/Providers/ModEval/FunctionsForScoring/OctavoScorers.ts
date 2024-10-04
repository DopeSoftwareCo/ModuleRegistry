import { calculateRampUp } from "../../RawAssets/Octavo/src/ramp-up";
import { calculateCorrectness } from "../../RawAssets/Octavo/src/find-correctness";
import { calculateBusFactor } from "../../RawAssets/Octavo/src/bus-factor";
import { calculateResponsiveMaintener } from "../../RawAssets/Octavo/src/find-responsive-maintainer";
import { calculateMetricsForRepo } from "../../RawAssets/Octavo/src/github-wrapper";
import { fetchRepoLicense } from "../../RawAssets/Octavo/src/github-wrapper";
import { TargetRepository } from "../Types/RepoTypes";


const CONTRIBUTION_THRESHOLD = 50;



export async function RampUp_WrappedScorer(repo: TargetRepository): Promise<number>
{
    let info = repo.identifiers;
    return await(calculateRampUp(info.owner, info.repoName));
}


export async function Correctness_WrappedScorer(repo: TargetRepository): Promise<number>
{
    let info = repo.identifiers;
    return await(calculateCorrectness(info.owner, info.repoName));
}


export async function BusFactor_WrappedScorer(repo: TargetRepository): Promise<number>
{
    let info = repo.identifiers;
    return calculateBusFactor(info.contributors, CONTRIBUTION_THRESHOLD);
}


export async function Responsiveness_WrappedScorer(repo: TargetRepository): Promise<number>
{
    let info = repo.identifiers;
    return await(calculateResponsiveMaintener(info.owner, info.repoName));
}

export async function LicenseCompatibility_WrapperScorer(repo: TargetRepository): Promise<number>
{
    let info = repo.identifiers;
    return await fetchRepoLicense(info.owner, info.repoName);
}

export async function CalculateMetrics_(repo: TargetRepository): Promise<string>
{
    let info = repo.identifiers;
    return await(calculateMetricsForRepo(info.repoUrl));
}