/**
 * This module creates various fields, some are used some are unused.
 * @author DSinc
 */
export const CreateLanguagesField = (first: number) => `
    languages(first: ${first}) {
        nodes {
            name
        }
    }
`;

export const CreateVulnerabilityAlertsField = (first: number) => `
    vulnerabilityAlerts(first: ${first}) {
        nodes {
            securityAdvisory {
                severity
            }
        }
    }
`;

export const CreateLicenseField = () => `
    licenseInfo {
        name
        spdxId
        url
    }
`;

export const CreateReactionsField = (first: number) => `
    reactions: issues(first: ${first}) {
        nodes {
            reactions(first: 5) {
                nodes {
                    content
                    user {
                        login
                    }
                }
            }
        }
    }
`;

export const CreateIssuesField = (first: number) => `
    openIssues: issues(states:OPEN) {
        totalCount
    }
    closedIssues: issues(states:CLOSED) {
        totalCount
    }
`;

export const CreateCommitsField = (first: number) => `
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

export const CreateReadmeField = () => `
readmeFile: object(expression: "HEAD:README.md") {
            ... on Blob {
                text
            }
        }
`;


export const CreateDependenciesField = (first: number) => `
    dependencyGraphManifests(first: ${first}) {
        nodes {
            filename
            dependencies(first: ${first}) {
                nodes {
                    packageName
                    requirements
                    hasDependencies
                    packageManager
                }
            }
        }
    }
`;


export const CreatePullRequestsField = (first: number) => `
    pullRequests(first: ${first}, orderBy: { field: CREATED_AT, direction: DESC }) {
        edges {
            node {
                id
                title
                number
                body
                createdAt
                updatedAt
                state
                mergedAt
                author {
                    login
                }
                reviews(first: 5) {
                    nodes {
                        author {
                            login
                        }
                        state
                        submittedAt
                    }
                }
                commits(last: 1) {
                    nodes {
                        commit {
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
    }
`;


export const CreateContributorsField = (first: number) => `
    collaborators(first: ${first}) {
        edges {
            node {
                login
                name
                contributionsCollection {
                    contributionCalendar {
                        totalContributions
                    }
                }
                email
                avatarUrl
            }
        }
    }
`;


export const CreateMergesField = (first: number) => `
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
                            parents(first: 2) {
                                totalCount
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const CreateTestMainQuery = () => `
  testsCheckMain: object(expression: "main:") {  
      ... on Tree {
        entries {
          name
          type
        }
      }
    }
`;

export const CreateTestMasterQuery = () => `
  testsCheckMaster: object(expression: "master:") {  
      ... on Tree {
        entries {
          name
          type
        }
      }
    }
`;