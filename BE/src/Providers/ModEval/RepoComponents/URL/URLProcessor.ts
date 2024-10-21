import { AsyncLooper } from "../../../../DSinc_Modules/DSinc_LoopsMaps";
import { RetrieveGitHubURL } from "../../DevTools/URLValidation";
import { RepoURL, I_URLProcessor } from "./URLProcessor.interface";
import { NullableArray } from "../../../../classes/Essential_Interfaces/NullableArray";

export class URLProcessor extends I_URLProcessor {
    private created?: Array<RepoURL>;
    private trackingHistory: boolean;
    private looper: AsyncLooper;

    constructor(trackHistory: boolean = false) {
        super();
        if (trackHistory) {
            this.created = new Array<RepoURL>(10);
        }
        this.trackingHistory = trackHistory;
        this.looper = new AsyncLooper();
    }

    public async Process(raw: string): Promise<RepoURL | undefined> {
        const repo = await this.TryBuildValidRepoURL(raw);

        if (this.trackingHistory && repo) {
            this.created?.push(repo);
        }
        return repo;
    }

    public async MultiProcess(urls: Array<string>): Promise<Array<RepoURL>> {
        let repoURLs: Array<RepoURL> = [];

        await this.looper.DiscardUndefined_StoreForEach<string, RepoURL>(
            urls,
            repoURLs,
            this.Process.bind(this),
            true
        );

        return repoURLs;
    }

    protected async TryBuildValidRepoURL(raw: string): Promise<RepoURL | undefined> {
        // github.com/x/x is 14 characters long, so there's no way in hell a smaller url is valid
        if (raw.length < 14) {
            return undefined;
        }

        try {
            const repoDetails = await RetrieveGitHubURL(raw);

            if (repoDetails) {
                const repo: RepoURL = {
                    providedURL: raw,
                    domain: "github.com",
                    tokens: new NullableArray<string>(repoDetails.tokens),
                    gitURL: repoDetails.repoURL,
                };
                return repo;
            }

            // The given url was invalid
            return undefined;
        } catch {
            // Error: Bad url
            return undefined;
        }
    }

    public IsTrackingHistory(): boolean {
        return this.trackingHistory;
    }

    public GetCreated(): Array<RepoURL> | undefined {
        return this.created;
    }
}
