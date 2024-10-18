import { Repository } from "./Repository";
import { RepoID } from "./ID/RepoID";
import { RepoID_Builder } from "./ID/RepoID_Builder";
import { RepoURL } from "./URL/URLProcessor.interface";
import { AsyncBuilder } from "../../../classes/Abstract/Abstract_Builders";
import { AsyncLooper } from "../../../DSinc_Modules/DSinc_LoopsMaps";
import { IsType_RepoID, IsType_RepoURL } from "../../../DSinc_Modules/CustomTypeGuards/ModEval_Guards";
import { RepoScoreset } from "../Scores/RepoScoreset";
import { DEFAULT_WEIGHTS, WeightSpecSet } from "../Scores/Weightspec.const";

export class Repo_Builder extends AsyncBuilder<Repository> {
    asyncLooper: AsyncLooper;
    idBuilder: RepoID_Builder;
    default_weights: WeightSpecSet;

    constructor(weights?: WeightSpecSet, trackCreations: boolean = false) {
        super(trackCreations);
        this.asyncLooper = new AsyncLooper();
        this.idBuilder = new RepoID_Builder();
        this.default_weights = weights ? weights : DEFAULT_WEIGHTS;
    }

    async MultiBuild_ByURL(repoURLs: Array<RepoURL>): Promise<Array<Repository> | undefined> {
        let creations = new Array<Repository>();
        await this.asyncLooper.DiscardUndefined_StoreForEach<RepoURL, Repository>(
            repoURLs,
            creations,
            this.Build.bind(this),
            true
        );
        return creations;
    }

    async MultiBuild_ByID(repoIDs: Array<RepoID>): Promise<Array<Repository> | undefined> {
        let creations = new Array<Repository>();
        await this.asyncLooper.DiscardUndefined_StoreForEach<RepoID, Repository>(
            repoIDs,
            creations,
            this.Build.bind(this),
            true
        );
        return creations;
    }

    async Build(url: RepoURL, weights?: WeightSpecSet): Promise<Repository | undefined>;
    async Build(id: RepoID, weights?: WeightSpecSet): Promise<Repository | undefined>;

    async Build(source: any, weights?: WeightSpecSet): Promise<Repository | undefined> {
        let creation: Repository | undefined;
        const weightspecs = weights ? weights : this.default_weights;
        if (!source) {
            return undefined;
        }
        if (IsType_RepoURL(source)) {
            creation = await this.StartFrom_URL(source, weightspecs);
        } else if (IsType_RepoID(source)) {
            creation = await this.StartFrom_ID(source, weightspecs);
        } else {
            creation = undefined;
        }

        return creation;
    }

    private async StartFrom_URL(url: RepoURL, weights: WeightSpecSet): Promise<Repository | undefined> {
        const id = await this.idBuilder.Build(url);
        return id ? await this.StartFrom_ID(id) : undefined;
    }

    private async StartFrom_ID(id: RepoID, weights?: WeightSpecSet): Promise<Repository | undefined> {
        const scores = new RepoScoreset(weights);
        return new Repository(id, scores);
    }
}
