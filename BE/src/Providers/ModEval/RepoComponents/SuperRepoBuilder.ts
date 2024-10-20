import { DEFAULT_WEIGHTS, WeightSpecSet } from "../Scores/Weightspec.const";
import { RepoID } from "./ID/RepoID";
import { RepoID_Builder } from "./ID/RepoID_Builder";
import { Repository } from "./Repository";
import { Repo_Builder } from "./Repository_Builder";
import { URLProcessor } from "./URL/URLProcessor";

type Repos = Array<Repository>;
type IDs = Array<RepoID>;

export class SuperRepoBuilder {
    private repoBuilder: Repo_Builder;
    private idBuilder: RepoID_Builder;
    private urlBuilder: URLProcessor;

    constructor(weights: WeightSpecSet = DEFAULT_WEIGHTS) {
        this.repoBuilder = new Repo_Builder(weights, false);
        this.idBuilder = new RepoID_Builder(false);
        this.urlBuilder = new URLProcessor(false);
    }

    async SuperBuild(rawURL: string, yourBuilder?: Repo_Builder): Promise<Repository | undefined> {
        const id = await this.idBuilder.Build(rawURL);

        if (id) {
            return yourBuilder ? await this.UseTheirs(id, yourBuilder) : await this.UseMine(id);
        }
        return undefined;
    }

    async MultiSuperBuild(rawURLs: Array<string>, yourBuilder?: Repo_Builder): Promise<Repos | undefined> {
        const urls = await this.urlBuilder.MultiProcess(rawURLs);
        const id = await this.idBuilder.MultiBuild(urls);

        if (id) {
            return yourBuilder
                ? await this.ForMany_UseTheirs(id, yourBuilder)
                : await this.ForMany_UseMine(id);
        }
        return undefined;
    }

    private async UseMine(id: RepoID): Promise<Repository | undefined> {
        return await this.repoBuilder.Build(id);
    }

    private async UseTheirs(id: RepoID, theirs: Repo_Builder): Promise<Repository | undefined> {
        return await theirs.Build(id);
    }

    private async ForMany_UseMine(ids: IDs): Promise<Repos | undefined> {
        return await this.repoBuilder.MultiBuild_ByID(ids);
    }

    private async ForMany_UseTheirs(ids: IDs, theirs: Repo_Builder): Promise<Repos | undefined> {
        return await theirs.MultiBuild_ByID(ids);
    }
}
