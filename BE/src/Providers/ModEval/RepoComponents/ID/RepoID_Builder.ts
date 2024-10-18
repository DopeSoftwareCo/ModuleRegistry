import { RepoURL } from "../URL/URLProcessor.interface";
import { URLProcessor } from "../URL/URLProcessor";
import { AsyncBuilder } from "../../../../classes/Abstract/Abstract_Builders";
import { IsType_RepoURL } from "../../../../DSinc_Modules/CustomTypeGuards/ModEval_Guards";
import { AsyncLooper } from "../../../../DSinc_Modules/DSinc_LoopsMaps";
import { RepoID } from "./RepoID";

export class RepoID_Builder extends AsyncBuilder<RepoID> {
    asyncLooper: AsyncLooper;

    constructor(trackCreations: boolean = false) {
        super(trackCreations);
        this.asyncLooper = new AsyncLooper();
    }

    async MultiBuild(repoURLs: Array<RepoURL>): Promise<Array<RepoID> | undefined> {
        let creations = new Array<RepoID>();

        this.asyncLooper.DiscardUndefined_StoreForEach<RepoURL, RepoID>(
            repoURLs,
            creations,
            this.Build,
            true
        );
        return creations;
    }

    async Build(rawURL: string): Promise<RepoID | undefined>;
    async Build(repoURL: RepoURL): Promise<RepoID | undefined>;

    async Build(source: any): Promise<RepoID | undefined> {
        let creation: RepoID | undefined;

        if (!source) {
            return undefined;
        }

        if (typeof source === "string") {
            creation = await this.StartFrom_String(source);
        } else if (IsType_RepoURL(source)) {
            creation = await this.StartFrom_RepoURL(source);
        } else {
            creation = undefined;
        }

        return creation;
    }

    private async StartFrom_String(rawURL: string): Promise<RepoID | undefined> {
        const processor = new URLProcessor();

        const repoURL: RepoURL | undefined = await processor.Process(rawURL);

        if (repoURL) {
            return await this.StartFrom_RepoURL(repoURL);
        }
        return undefined;
    }

    private async StartFrom_RepoURL(repoURL: RepoURL): Promise<RepoID | undefined> {
        if (!repoURL) {
            return undefined;
        }

        try {
            if (!repoURL) {
                return undefined;
            }

            let nameofOwner = "";
            let nameofRepo = "";

            if (repoURL.tokens) {
                nameofOwner = repoURL.tokens[1];
                nameofRepo = repoURL.tokens[2];
            }

            const creation = new RepoID(nameofOwner, nameofRepo, repoURL);
            return creation;
        } catch {
            return undefined;
        }
    }
}
