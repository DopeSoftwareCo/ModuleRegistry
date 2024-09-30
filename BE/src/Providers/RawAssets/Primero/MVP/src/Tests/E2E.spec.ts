import { describe, expect, it, jest } from '@jest/globals';
import { buildReposFromUrls } from '../Processors/urlProcessor';
import { BaseRepoQueryResponse, GraphQLResponse, ReposFromQuery } from '../Types/ResponseTypes';
import { mockGQLResult } from '../TestUtils/constants';
import { getLicenseFuncSpy, getMockedCleanUrls } from '../TestUtils/mocks';
import { repoQueryBuilder } from '../Requests/QueryBuilders/repos';
import { createLicenseField } from '../Requests/QueryBuilders/fields';
import { requestFromGQL } from '../Requests/GitHub/gql';
import * as GQLREQ from '../Requests/GitHub/gql';
import { mapGQLResultToRepos } from '../Processors/gqlProcessor';
import { Repository } from '../Types/DataTypes';
import * as NPMPROCESSOR from '../Processors/registryProcessor';
import { scoreRepositoriesArray } from '../Scoring/scoring';
import { writeNDJSONToCLI } from '../Output/CLI';

describe('E2E', () => {
    it('Should work with an E2E test', async () => {
        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        //mocked to avoid using fetch during testing
        const getRepoUrlSpy = jest
            .spyOn(NPMPROCESSOR, 'getRepoUrl')
            .mockImplementation(async (packageName: string) => '');
        const repos = await buildReposFromUrls<BaseRepoQueryResponse>(
            getMockedCleanUrls('../TestUtils/validUrls.txt')
        );
        const query = repoQueryBuilder(repos, [createLicenseField(), 'stargazerCount']);
        //we spy on this req and mock the return to avoid actually fetching or needing a token in this test
        const reqGqlSpy = jest
            .spyOn(GQLREQ, 'requestFromGQL')
            .mockImplementation(
                async (query: string): Promise<GraphQLResponse<{ repo: Repository<any> }>> => mockGQLResult
            );
        const result = await requestFromGQL<ReposFromQuery<any>>(query);
        const cleanedRepos = mapGQLResultToRepos(result, repos);
        //can remove this for a full E2E test, it involves filesystem manipulation, cloning repositories etc, works with or without. Shorter run without.
        const licenseFuncSpy = getLicenseFuncSpy(1);
        const scoredRepositories = await scoreRepositoriesArray(cleanedRepos);
        writeNDJSONToCLI(scoredRepositories);
        expect(logSpy).toBeCalledTimes(2);
        expect(logSpy).toHaveBeenNthCalledWith(1, expect.stringContaining('Cinnamon'));
        expect(logSpy).toHaveBeenNthCalledWith(2, expect.stringContaining('Z4nzu'));
    }, 20000);
});
