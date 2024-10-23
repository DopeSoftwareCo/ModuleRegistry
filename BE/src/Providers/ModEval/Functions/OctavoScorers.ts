import { calculateRampUp } from "../Assets/Octavo/src/ramp-up";
import { calculateCorrectness } from "../Assets/Octavo/src/find-correctness";
import { calculateBusFactor } from "../Assets/Octavo/src/bus-factor";
import { calculateResponsiveMaintener } from "../Assets/Octavo/src/find-responsive-maintainer";
import { calculateMetricsForRepo } from "../Assets/Octavo/src/github-wrapper";
import { fetchRepoLicense } from "../Assets/Octavo/src/github-wrapper";
import { Repository } from "../RepoComponents/Repository";
import { FetchUniqueAuthors } from "../GQL_Queries/Requests/GQLRequests";

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
    let contributors = await FetchUniqueAuthors(id.Owner, id.Name);

    if (!contributors) {
        return 0;
    }
    return calculateBusFactor(contributors, CONTRIBUTION_THRESHOLD);
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
