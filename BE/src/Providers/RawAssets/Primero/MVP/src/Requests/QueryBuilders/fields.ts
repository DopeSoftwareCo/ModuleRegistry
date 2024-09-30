export const createLanguagesField = (first: number) => `
    languages(first: ${first}) {
        nodes {
            name
        }
    }
`;

export const createVulnerabilityAlertsField = (first: number) => `
    vulnerabilityAlerts(first: ${first}) {
        nodes {
            securityAdvisory {
                severity
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

export const createReactionsField = (first: number) => `
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

export const createIssuesField = (first: number) => `
    openIssues: issues(states:OPEN) {
        totalCount
    }
    closedIssues: issues(states:CLOSED) {
        totalCount
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
