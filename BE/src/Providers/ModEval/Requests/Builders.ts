const query = repoQueryBuilder(repos, [
    createLicenseField(),
    createReadmeField(),
    createTestMainQuery(),
    createTestMasterQuery(),
    "stargazerCount",
]); //add an array of fields here... see Request/QueryBuilders/fields.ts for examples
const result = await requestFromGQL<ReposFromQuery<BaseRepoQueryResponse>>(query);

export const createReadmeField = () => `
readmeFile: object(expression: "HEAD:README.md") {
            ... on Blob {
                text
            }
        }
`;

export const createTestMainQuery = () => `
  testsCheckMain: object(expression: "main:") {  
      ... on Tree {
        entries {
          name
          type
        }
      }
    }
`;

export const createTestMasterQuery = () => `
  testsCheckMaster: object(expression: "main:") {  
      ... on Tree {
        entries {
          name
          type
        }
      }
    }
`;

export const createLicenseField = () => `
    licenseInfo {
        name
        spdxId
        url
    }
`;

export const createCommitsField = (first: number) => `
ref(qualifiedName: "main") {
    target {
        ... on Commit {
            history(first: ${first}) {
                edges {
                    node {
                        oid
                        message
                        committedDate
                        author {
                            name
                            email
                        }
                    }
                }
            }
        }
    }
}`;
