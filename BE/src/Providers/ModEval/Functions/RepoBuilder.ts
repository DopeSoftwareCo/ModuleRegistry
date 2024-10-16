import { TargetRepository } from "../SingleClasses/TargetRepository";
import { Generate_RepositoryID, RepositoryIdentification } from "../Types/RepoIDTypes";



export async function BuildTargetRepo(url: string): Promise<TargetRepository>
{
    const id = await Generate_RepositoryID(url);
    if(id) { return new TargetRepository(id); }
    

    let empty_id: RepositoryIdentification =
    {
        owner: "",
        repoName: "",
        url_info: 
        {
            gitURL: "", 
            providedURL: url, 
            domain: ""
        }
    }

    return new TargetRepository(empty_id);
}



export async function TryBuildTargetRepo(url: string): Promise<TargetRepository | undefined>
{
    const id = await Generate_RepositoryID(url);
    if(id) { return new TargetRepository(id); }
    
    return undefined;
}