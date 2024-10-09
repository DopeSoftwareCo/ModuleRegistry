import { Response } from "express";
import { BaseRepoQueryResponse, GraphQLResponse } from "../../Providers/ModEval/Types/QueryResponseTypes";
import {
    NDJSON_RowInfo,
    RepositoryIdentification,
    TargetRepository,
} from "../../Providers/ModEval/Types/RepoComponents";
import { RepoScoreSet } from "../../Providers/ModEval/Types/ScoreTypes";

declare module "ResponseTypes" {
    export type AddModuleResponseBody = {
        repository?: {
            identifiers: RepositoryIdentification;
            queryResult: BaseRepoQueryResponse | undefined = undefined;
            scores: RepoScoreSet;
            ndjson: NDJSON_RowInfo | undefined = undefined;
        };
        rawQueryResult?: GraphQLResponse<unknown>;
        message: string;
        error: boolean;
    };
    export interface AddModuleResponse extends Response {
        body: AddModuleResponseBody;
    }
}
