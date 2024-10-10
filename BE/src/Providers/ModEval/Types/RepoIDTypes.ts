import { RepoScoreSet, NetValue, EMPTY_SCOREINFO, ScoreInfo } from "./ScoreTypes";
import { RepoURL, URLProcessor } from "../SingleClasses/URLProcessor";


// ========================= TargetRepo Member Typedefs =========================
export type NDJSON_RowInfo = {
    scores: RepoScoreSet;
    url: string;
};

export type RepositoryIdentification = {
    owner: string;
    repoName: string;
    url_info: RepoURL;
};


// ========================= Repo ID =========================
export async function Generate_RepositoryID(url: string) : Promise<RepositoryIdentification | undefined>
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
        
        const id: RepositoryIdentification =
        {
            owner: nameofOwner,
            repoName: nameofRepo,
            url_info: repoURL,
        }
        return id;
    }
    catch { return undefined; }
}



