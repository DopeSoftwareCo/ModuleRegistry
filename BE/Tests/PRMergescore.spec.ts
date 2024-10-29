import { MergeRestriction_Scorer } from "../src/Providers/ModEval/Functions/DSincScorers";
import { Repository } from "../src/Providers/ModEval/RepoComponents/Repository";
import { SendRequestToGQL } from "../src/Providers/ModEval/GQL_Queries/Requests/GQLRequests";
import { beforeEach, describe, it, expect, jest, afterEach } from "@jest/globals";
import { RepoID } from "../src/Providers/ModEval/RepoComponents/ID/RepoID";
import { RepoURL } from "../src/Providers/ModEval/RepoComponents/URL/URLProcessor.interface";
import { NullableArray } from "../src/classes/Essential_Interfaces/NullableArray";

// jest.mock("../src/Providers/ModEval/GQL_Queries/Requests/GQLRequests");

// describe("MergeRestriction_Scorer error checking", () => {
//     let repo: Repository;

//     beforeEach(() => {
//         repo = new Repository({ owner: "testOwner", repoName: "testRepo" });
//     });

//     it("should return 0 when there are no pull requests", async () => {
//         (SendRequestToGQL as jest.Mock).mockResolvedValueOnce({
//             data: {
//                 repository: {
//                     pullRequests: {
//                         nodes: [] as any[],
//                         pageInfo: {
//                             hasNextPage: false,
//                             endCursor: null,
//                         },
//                     },
//                 },
//             },
//         });

//         (SendRequestToGQL as jest.Mock).mockResolvedValueOnce({
//             data: {
//                 repository: {
//                     object: {
//                         history: {
//                             totalCount: 100,
//                         },
//                     },
//                 },
//             },
//         });

//         const score = await MergeRestriction_Scorer(repo);
//         expect(score).toBe(0);
//     });

//     it("should return 0 when there are pull requests but no merge commits", async () => {
//         (SendRequestToGQL as jest.Mock).mockResolvedValueOnce({
//             data: {
//                 repository: {
//                     pullRequests: {
//                         nodes: [{ mergeCommit: null }] as any[],
//                         pageInfo: {
//                             hasNextPage: false,
//                             endCursor: null,
//                         },
//                     },
//                 },
//             },
//         });

//         (SendRequestToGQL as jest.Mock).mockResolvedValueOnce({
//             data: {
//                 repository: {
//                     object: {
//                         history: {
//                             totalCount: 100,
//                         },
//                     },
//                 },
//             },
//         });

//         const score = await MergeRestriction_Scorer(repo);
//         expect(score).toBe(0);
//     });

//     it("should return 0 when there are pull requests but no merge commits with multiple parents", async () => {
//         (SendRequestToGQL as jest.Mock).mockResolvedValueOnce({
//             data: {
//                 repository: {
//                     pullRequests: {
//                         nodes: [{ mergeCommit: { parents: { totalCount: 1 } } }] as any[],
//                         pageInfo: {
//                             hasNextPage: false,
//                             endCursor: null,
//                         },
//                     },
//                 },
//             },
//         });

//         (SendRequestToGQL as jest.Mock).mockResolvedValueOnce({
//             data: {
//                 repository: {
//                     object: {
//                         history: {
//                             totalCount: 100,
//                         },
//                     },
//                 },
//             },
//         });

//         const score = await MergeRestriction_Scorer(repo);
//         expect(score).toBe(0);
//     });
// });

describe("MergeRestriction_Scorer with real repository", () => {
    let repo: Repository;

    it("should return the correct score for a real repository", async () => {
        const url = "https://github.com/cloudinary/cloudinary_npm";
        const tokens = new NullableArray<string>(["cloudinary", "cloudinary_npm"]);

        const repoURL: RepoURL = {
            providedURL: url,
            domain: "github.com",
            tokens: tokens,
            gitURL: "https://github.com/cloudinary/cloudinary_npm.git",
        };

        const owner = "cloudinary";
        const repoName = "cloudinary_npm";
        const repoID = new RepoID(owner, repoName, repoURL);
        const repository = new Repository(repoID);

        const score = await MergeRestriction_Scorer(repository);
        //console.log(`Merge Restriction Score for cloudinary/cloudinary_npm: ${score}`);
        expect(score).toBe(0.08); // Adjust this expectation based on real data
    });
});
