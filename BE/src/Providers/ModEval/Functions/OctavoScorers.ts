import { calculateRampUp } from "../Assets/ScoringFunctions/ramp-up";
import { calculateCorrectness } from "../Assets/ScoringFunctions/find-correctness";
import { calculateBusFactor } from "../Assets/ScoringFunctions/bus-factor";
import { calculateResponsiveMaintener } from "../Assets/ScoringFunctions/find-responsive-maintainer";
import { calculateMetricsForRepo } from "../Assets/ScoringFunctions/github-wrapper";
import { fetchRepoLicense } from "../Assets/ScoringFunctions/github-wrapper";
import { Repository } from "../RepoComponents/Repository";
import { fetchContributors } from "../Assets/api-calls/github-adapter";

const CONTRIBUTION_THRESHOLD = 50;

export async function RampUp_WrappedScorer(repo: Repository): Promise<number> {
    let info = repo.ID;
    return await calculateRampUp(info.Owner, info.Name);
}

export async function Correctness_WrappedScorer(repo: Repository): Promise<number> {
    let info = repo.ID;
    return await calculateCorrectness(info.Owner, info.Name);
}

export async function BusFactor_WrappedScorer(repo: Repository): Promise<number> {
    const id = repo.ID;
    const contributors = await fetchContributors(id.Owner, id.Name);
    if (!contributors) {
        return 0;
    }
    const score = calculateBusFactor(contributors, CONTRIBUTION_THRESHOLD);
    return score >= 0 ? score : 0;
}

export async function Responsiveness_WrappedScorer(repo: Repository): Promise<number> {
    let info = repo.ID;
    return await calculateResponsiveMaintener(info.Owner, info.Name);
}

export async function LicenseCompatibility_WrapperScorer(repo: Repository): Promise<number> {
    let info = repo.ID;
    return await fetchRepoLicense(info.Owner, info.Name);
}

export async function CalculateMetrics_(repo: Repository): Promise<string> {
    let info = repo.ID;
    return await calculateMetricsForRepo(info.GitHubAddress);
}
