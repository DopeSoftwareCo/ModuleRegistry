import { AddModuleRequest } from "RequestTypes";
import { AddModuleResponseBody } from "ResponseTypes";
import { TargetRepository } from "../../Providers/ModEval/Types/RepoTypes";
import { RepoQueryBuilderNew, RequestFromGQLNew } from "../../Providers/ModEval/ResponseTypes";
import {
    createCommitsFieldNew,
    createLicenseFieldNew,
    createReadmeFieldNew,
    createTestMainQueryNew,
    createTestMasterQueryNew,
} from "../../Providers/ModEval/Requests/Builders";

export const AddModule = async (req: AddModuleRequest): Promise<AddModuleResponseBody> => {
    try {
        const repoB = new TargetRepository(req.body.url ? req.body.url : "");
        repoB.SetIdentifiers({ owner: req.body.repoOwner, repoName: req.body.repoName });
        const query = RepoQueryBuilderNew(
            [repoB.identifiers],
            [
                createLicenseFieldNew(),
                createReadmeFieldNew(),
                createTestMainQueryNew(),
                createTestMasterQueryNew(),
                createCommitsFieldNew(10),
                "stargazerCount",
            ]
        );

        const result = await RequestFromGQLNew(query);

        return { error: false, message: "success", rawQueryResult: result, repository: repoB };
    } catch (err) {
        console.log("failed to add module");
        return { error: true, message: "failed to add module" };
    }
};
