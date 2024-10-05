export const createReadmeFieldNew = () => `
readmeFile: object(expression: "HEAD:README.md") {
            ... on Blob {
                text
            }
        }
`;

export const createTestMainQueryNew = () => `
  testsCheckMain: object(expression: "main:") {  
      ... on Tree {
        entries {
          name
          type
        }
      }
    }
`;

export const createTestMasterQueryNew = () => `
  testsCheckMaster: object(expression: "main:") {  
      ... on Tree {
        entries {
          name
          type
        }
      }
    }
`;

export const createLicenseFieldNew = () => `
    licenseInfo {
        name
        spdxId
        url
    }
`;

export const createCommitsFieldNew = (first: number) => `
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
