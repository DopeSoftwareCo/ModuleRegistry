import { calculateRampUp } from "../Assets/Octavo/src/ramp-up";
import { calculateCorrectness } from "../Assets/Octavo/src/find-correctness";
import { calculateBusFactor } from "../Assets/Octavo/src/bus-factor";
import { calculateResponsiveMaintener } from "../Assets/Octavo/src/find-responsive-maintainer";
import { calculateMetricsForRepo } from "../Assets/Octavo/src/github-wrapper";
import { fetchRepoLicense } from "../Assets/Octavo/src/github-wrapper";
import { TargetRepository } from "../SingleClasses/TargetRepository";


const CONTRIBUTION_THRESHOLD = 50;


export async function RampUp_WrappedScorer(repo: TargetRepository): Promise<number>
{
    let info = repo.Identifiers;
    return await(calculateRampUp(info.owner, info.repoName));
}


export async function Correctness_WrappedScorer(repo: TargetRepository): Promise<number>
{
    let info = repo.Identifiers;
    return await(calculateCorrectness(info.owner, info.repoName));
}


export async function BusFactor_WrappedScorer(repo: TargetRepository): Promise<number>
{
    let info = repo.Identifiers;
    let contributors = repo.QueryResult?.Contributors;
    
    if(!contributors) { return 0; }
    return calculateBusFactor(contributors, CONTRIBUTION_THRESHOLD);
}


export async function Responsiveness_WrappedScorer(repo: TargetRepository): Promise<number>
{
    let info = repo.Identifiers;
    return await(calculateResponsiveMaintener(info.owner, info.repoName));
}

export async function LicenseCompatibility_WrapperScorer(repo: TargetRepository): Promise<number>
{
    let info = repo.Identifiers;
    return await fetchRepoLicense(info.owner, info.repoName);
}

export async function CalculateMetrics_(repo: TargetRepository): Promise<string>
{
    let info = repo.Identifiers;
    return await(calculateMetricsForRepo(info.url_info.gitURL));
}