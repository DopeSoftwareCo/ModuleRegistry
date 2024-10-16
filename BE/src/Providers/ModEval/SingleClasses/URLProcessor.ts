import {  RetrieveGitHubURL } from '../DevTools/URLValidation'




export interface PackageRepo_URL
{
    providedURL: string;
    domain: string;
	tokens?: Array<string>;
}


export interface RepoURL extends PackageRepo_URL { gitURL: string; }


type RepoURLs = Array<RepoURL | undefined>;



export class URLProcessor
{
	private created?: Array<RepoURL>;
	private trackingHistory: boolean;

	constructor(trackHistory: boolean)
	{
		if(trackHistory)
		{
			this.created = new Array<RepoURL>(10);
		}
		this.trackingHistory = trackHistory;
	}

	public async Process(raw: string) : Promise<RepoURL | undefined>
	{
		const repo = await this.TryBuildValidRepoURL(raw);
		
		if (this.trackingHistory && repo)
		{ 
			this.created?.push(repo); 
		}
		return repo;
	}


	public async MultiProcess(urls: Array<string>, removingPadding: boolean = false) : Promise<RepoURLs>
	{
		let repoURLs: RepoURLs = [];

		for (let i = 0; i < urls.length; i++)
		{
			const result = await this.Process(urls[i]);
			if (result) { repoURLs.push(result); }
		}
		return repoURLs;
	}

  
	private async TryBuildValidRepoURL(raw: string) : Promise<RepoURL | undefined>
	{
		// github.com/x/x is 14 characters long, so there's no way in hell a smaller url is valid
		if (raw.length < 14) { return undefined; }
			
		try
		{
			const repoDetails = await RetrieveGitHubURL(raw);

			if (repoDetails)
			{
				const repo: RepoURL =
				{ 
					providedURL: raw, 
					domain: "github.com",
					tokens: repoDetails.tokens,
					gitURL: repoDetails.repoURL
				}
				return repo;
			}
			
			// The given url was invalid
			return undefined;        
		}

		// Error: Bad url
		catch  { return undefined; }
	}


	public IsTrackingHistory() : boolean
	{ 
		return this.trackingHistory; 
	}
	
	
	public GetCreated() : Array<RepoURL> | undefined
	{
		return this.created;
	}
}

