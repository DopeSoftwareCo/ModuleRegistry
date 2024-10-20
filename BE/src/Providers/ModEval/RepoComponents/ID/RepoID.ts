import { RepoURL } from "../URL/URLProcessor.interface";

export class RepoID {
    private owner: string = "";
    private repoName: string = "";
    private repoURL: RepoURL;

    constructor(owner: string, repoName: string, repoURL: RepoURL) {
        this.owner = owner;
        this.repoName = repoName;
        this.repoURL = repoURL;
    }

    get Owner(): string {
        return this.owner;
    }
    get Name(): string {
        return this.repoName;
    }
    get GitHubAddress(): string {
        return this.repoURL.gitURL;
    }
    get URL(): RepoURL {
        return this.repoURL;
    }
}
