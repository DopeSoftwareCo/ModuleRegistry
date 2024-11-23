export type DependencyNode = {
    packageName: string;
    requirements: string;
    hasDependencies: boolean;
    packageManager: string;
  };
  
export type DependencyManifestNode = {
    filename: string;
    dependencies: {
      nodes: DependencyNode[];
    };
  };
  
export type DependenciesQueryResult = {
    dependencyGraphManifests: {
      nodes: DependencyManifestNode[];
    };
  };
  