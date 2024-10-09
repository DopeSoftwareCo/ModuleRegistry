import { RepoScoreSet, NetValue, EMPTY_SCOREINFO, ScoreInfo } from "./ScoreTypes";
import { fetchContributors } from "../Assets/Octavo/src/api-calls/github-adapter";
import { RepoURL, URLProcessor } from "../SingleClasses/URLProcessor";


// ========================= NDJSON =========================
export type NDJSON_RowInfo = {
    scores: RepoScoreSet;
    url: string;
};


// ========================= Repo ID =========================
export type RepositoryIdentification = {
    owner: string;
    repoName: string;
    url_info: RepoURL;
    contributors: Array<string>;
    description: string;
};


export async function IdenfiyRepo(url: string) : Promise<RepositoryIdentification | undefined>
{
    try
    {
        const processor = new URLProcessor(false);
        const repoURL = await processor.Process(url);
        if(!repoURL) {return undefined;}
        
        let nameofOwner = "";
        let nameofRepo = "";
        if(repoURL.tokens)
        {
            nameofOwner = repoURL.tokens[1];
            nameofRepo = repoURL.tokens[2];
        }
        
        const contributorNames = await fetchContributors(nameofOwner, nameofRepo);
        const id: RepositoryIdentification =
        {
            owner: nameofOwner,
            repoName: nameofRepo,
            url_info: repoURL,
            contributors: contributorNames,
            description: ""
        }
        return id;
}
catch { return undefined;}
}



