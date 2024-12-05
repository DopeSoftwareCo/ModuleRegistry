import { describe, expect, it } from "@jest/globals";
import {
    RepoQueryBuilder,
    SendRequestToGQL,
} from "../src/Providers/RepoEvaluator/GQL_Queries/Requests/GQLRequests";
import { RepoID } from "../src/Providers/RepoEvaluator/RepoComponents/ID/RepoID";
import { RepoID_Builder } from "../src/Providers/RepoEvaluator/RepoComponents/ID/RepoID_Builder";
import { getFetchSpy } from "./TestUtils/mocks";

describe("GQL", () => {
    it("Should create a query string", async () => {
        const b = new RepoID_Builder();
        const repoId: RepoID | undefined = await b.Build("https://github.com/facebook/react");
        const query = RepoQueryBuilder(repoId ? [repoId] : []);
        expect(query).toBeDefined();
    });

    it("Should make request", async () => {
        const s = getFetchSpy({ res: "string" }, 200);
        process.env.GITHUB_TOKEN = "token";
        const res = await SendRequestToGQL("");
        expect(res).toEqual({ res: "string" });
    });
});
