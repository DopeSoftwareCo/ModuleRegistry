import { RepositoryIdentification, NDJSON_RowInfo } from "../Types/RepoComponents";
import { BaseRepoQueryResponse } from "../Types/QueryResponseTypes";
import { RepoQueryResult } from "../Assets/Primero/MVP/src/Types/ResponseTypes";
import { RepoScoreSet, NetValue, EMPTY_SCOREINFO } from "../Types/ScoreTypes";


export class TargetRepository {
    identifiers: RepositoryIdentification;
    scores: RepoScoreSet;
    queryResult: BaseRepoQueryResponse | undefined = undefined;
    ndjson: NDJSON_RowInfo | undefined = undefined;

    constructor(id: RepositoryIdentification, scoreset?: RepoScoreSet) {
        this.identifiers = id;
        
        if(scoreset)
        {
            this.scores = scoreset;
        }
        else
        {
            this.scores =
            {
                rampup_score: EMPTY_SCOREINFO,
                correctness_score: EMPTY_SCOREINFO,
                busfactor_score: EMPTY_SCOREINFO,
                responsiveness_score: EMPTY_SCOREINFO,
                license_score: EMPTY_SCOREINFO,
                versionDependence_score: EMPTY_SCOREINFO,
                mergeRestriction_score: EMPTY_SCOREINFO,
                net: new NetValue(),
            }
        }

        this.queryResult = undefined;
        this.ndjson = undefined;
    }


 
    get Identifiers(): RepositoryIdentification {
        return this.identifiers;
    }

    get QueryResult(): RepoQueryResult | undefined {
        return this.queryResult;
    }

    get Scores(): RepoScoreSet {
        return this.scores;
    }

    get NDJSONRow(): NDJSON_RowInfo | undefined {
        return this.ndjson;
    }

}
