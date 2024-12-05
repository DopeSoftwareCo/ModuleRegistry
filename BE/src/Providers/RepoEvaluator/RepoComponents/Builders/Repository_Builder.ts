import { Repository } from "../Repository";
import { RepoID } from "../ID/RepoID";
import { RepoID_Builder } from "../ID/RepoID_Builder";
import { RepoURL } from "../URL/URLProcessor.interface";
import { AsyncBuilder } from "../../Abstract_Builders";
import * as AsyncLoops from "../../../../Utils/DSinc/AsyncLoop";
import { IsType_RepoID, IsType_RepoURL } from "../../DevTools/ModEval_Guards";
import { RepoScoreset } from "../Metrics_Scores/RepoScoreset";
import { DEFAULT_WEIGHTS, WeightSpecSet } from "../Metrics_Scores/Weightspec.const";

export class Repo_Builder extends AsyncBuilder<Repository> {
    idBuilder: RepoID_Builder;
    default_weights: WeightSpecSet;

    constructor(weights?: WeightSpecSet, trackCreations: boolean = false) {
        super(trackCreations);
        this.idBuilder = new RepoID_Builder();
        this.default_weights = weights ? weights : DEFAULT_WEIGHTS;
    }

    async MultiBuild_ByURL(repoURLs: Array<RepoURL>): Promise<Array<Repository> | undefined> {
        let creations = new Array<Repository>();
        await AsyncLoops.DiscardUndefined_StoreForEach<RepoURL, Repository>(
            repoURLs,
            creations,
            this.Build.bind(this),
            false
        );
        return creations;
    }

    async MultiBuild_ByID(repoIDs: Array<RepoID>): Promise<Array<Repository> | undefined> {
        let creations = Array<Repository>();
        await AsyncLoops.DiscardUndefined_StoreForEach<RepoID, Repository>(
            repoIDs,
            creations,
            this.Build.bind(this),
            false
        );

        return creations;
    }

    async Build(url: RepoURL, weights?: WeightSpecSet): Promise<Repository | undefined>;
    async Build(id: RepoID, weights?: WeightSpecSet): Promise<Repository | undefined>;

    async Build(source: any, weights?: WeightSpecSet): Promise<Repository | undefined> {
        if (!source) {
            return undefined;
        }
        let creation: Repository | undefined;
        const weightspecs = weights ? weights : this.default_weights;

        if (IsType_RepoID(source)) {
            creation = await this.StartFrom_ID(source, weightspecs);
        } else if (IsType_RepoURL(source)) {
            creation = await this.StartFrom_URL(source, weightspecs);
        } else {
            undefined;
        }

        return creation;
    }

    private async StartFrom_URL(url: RepoURL, weights?: WeightSpecSet): Promise<Repository | undefined> {
        const weightsToUse = weights ? weights : this.default_weights;

        const id = await this.idBuilder.Build(url);
        return id ? this.StartFrom_ID(id, weightsToUse) : undefined;
    }

    private async StartFrom_ID(id: RepoID, weights?: WeightSpecSet): Promise<Repository | undefined> {
        const weightsToUse = weights ? weights : this.default_weights;
        const scores = new RepoScoreset(weightsToUse);
        const creation = new Repository(id, scores);

        //await creation.RequestFromGQL();
        //creation.Refresh_NDJSON();
        return creation;
    }
}
