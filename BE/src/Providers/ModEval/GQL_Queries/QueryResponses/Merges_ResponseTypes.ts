type MergeCommitAuthor = {
  name: string;
  email: string;
};

type MergeCommitParent = {
  totalCount: number;
};

export type MergeCommitNode = {
  oid: string;
  message: string;
  committedDate: string;
  author: MergeCommitAuthor;
  parents: MergeCommitParent;
};

type MergeCommitEdge = {
  node: MergeCommitNode;
};

export type MergesQueryResult = {
  ref: {
    target: {
      history: {
        edges: MergeCommitEdge[];
      };
    };
  };
};
