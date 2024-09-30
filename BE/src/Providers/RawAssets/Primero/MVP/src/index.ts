import './Utils/envConfig';
import chalk from 'chalk';
import { buildReposFromUrls } from './Processors/urlProcessor';
import { repoQueryBuilder } from './Requests/QueryBuilders/repos';
import { BaseRepoQueryResponse, ReposFromQuery } from './Types/ResponseTypes';
import { requestFromGQL } from './Requests/GitHub/gql';
import { mapGQLResultToRepos } from './Processors/gqlProcessor';
import { DEFAULT_URLFILEPATH } from './Input/Input';
import { LogDebug } from './Utils/log';
import { ProvideURLsForQuerying } from './Input/Sanitize';
import { writeNDJSONToFile } from './Output/File';
import { processArguments } from './Processors/argProcessor';
import { writeNDJSONToCLI } from './Output/CLI';
import { scoreRepositoriesArray } from './Scoring/scoring';
import { createLicenseField } from './Requests/QueryBuilders/fields';
import * as dot from 'dotenv';

dot.config();
if (!process.env.LOG_FILE) {
    process.exit(1);
}
const runner = async () => {
    const filePath = await processArguments();
    const cleanUrls = ProvideURLsForQuerying(filePath ? filePath : DEFAULT_URLFILEPATH, true);
    const repos = await buildReposFromUrls<BaseRepoQueryResponse>(cleanUrls);
    const query = repoQueryBuilder(repos, [createLicenseField(), 'stargazerCount']); //add an array of fields here... see Request/QueryBuilders/fields.ts for examples
    const result = await requestFromGQL<ReposFromQuery<BaseRepoQueryResponse>>(query); //result is the raw gql response... .data has your data, .errors has the errors
    const cleanedRepos = mapGQLResultToRepos(result, repos);
    const res = await scoreRepositoriesArray<BaseRepoQueryResponse>(cleanedRepos); //mapper to clean the array of repos and add in their query results.
    writeNDJSONToFile(res); //result is the raw gql response... .data has your data, .errors has the errors
    LogDebug('Successfully cleaned and scored repos');
    writeNDJSONToCLI(res);
};
LogDebug(`🌟 ${chalk.greenBright('Starting...')} 🌟`);
runner();
