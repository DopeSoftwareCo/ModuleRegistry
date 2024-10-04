import * as Reimagined from './PrimeroAdaptations';
import * as API from '../../RawAssets/Octavo/src/api-calls/github-adapter';
import { parseGithubUrl } from '../../RawAssets/Octavo/src/github-wrapper';
import { getGithubLink } from '../../RawAssets/Octavo/src/Util/npmUtil';
import { RepoScoreSet, NetValue, EMPTY_SCOREINFO } from '../Types/ScoreTypes';
import { RepoQueryResult } from '../../RawAssets/Primero/MVP/src/Types/ResponseTypes';



export async function BuildTargetRepoFromUrl(url: string): Promise<TargetRepository>
{
    let repo = new TargetRepository(url);
    await repo.FinishConstruction();
    return repo;
}


// Latency info is stored in RepoScoreSet ... do we still need this?
export type LatencyScoreSet =
{
    rampup_latency: number;
    correctness_latency: number;
    busfactor_latency: number;
    response_latency: number;
    license_latency: number;
    combined_latency: number;
}


export type NDJSON_RowInfo =
{
    scores: RepoScoreSet,
    latencies: LatencyScoreSet,
    url: string
}


export type RepositoryIdentification =
{
    owner: string;
    repoName: string;
    repoUrl: string;
    contributors: Array<string>;
    fileUrl: string;
    description: string;
}


export class TargetRepository
{
    identifiers: RepositoryIdentification;
    queryResult: Reimagined.BaseRepoQueryResponse | undefined = undefined;
    scores: RepoScoreSet; 
    ndjson: NDJSON_RowInfo | undefined;

    constructor(url: string)
    {
        this.identifiers =
        {
            owner: "",
            repoName: "",
            repoUrl: "",
            contributors: new Array<string>,
            fileUrl: "",
            description: ""
        }
  
        this.scores =
        {
            rampup_score: EMPTY_SCOREINFO,
            correctness_score: EMPTY_SCOREINFO,
            busfactor_score: EMPTY_SCOREINFO,
            responsiveness_score: EMPTY_SCOREINFO,
            license_score: EMPTY_SCOREINFO,
            versionDependence_score: EMPTY_SCOREINFO,
            mergeRestriction_score: EMPTY_SCOREINFO,
            net: new NetValue()
        }
        
        this.queryResult = undefined;
        this.ndjson = undefined;
    }


    public async FinishConstruction()
    {
        try {
            let url = this.identifiers.repoUrl;
            this.ProcessUrl(url);
            
            // Fetch contributors for Bus Factor calculation
            this.identifiers.contributors = await API.fetchContributors(this.identifiers.owner, this.identifiers.repoName);
            }
        catch { }
    }


    async ProcessUrl(url: string)
    {
        const githubUrl = await(getGithubLink(url));
        const repoInfo = parseGithubUrl(githubUrl);
        
        this.identifiers.repoUrl = githubUrl;
        if(repoInfo)
        {
            this.identifiers.repoName = repoInfo.repo;
            this.identifiers.owner = repoInfo.owner;
        }
    }

    
    public Identifiers() : RepositoryIdentification
    {
        return this.identifiers;
    }

    public QueryResult() : RepoQueryResult | undefined
    {
        return this.queryResult;
    }

    public Scores() : RepoScoreSet
    {
        return this.scores;
    }

    public NDJSONRow() : NDJSON_RowInfo | undefined
    {
        return this.ndjson;
    }
}