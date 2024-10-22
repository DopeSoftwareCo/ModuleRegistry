import { Repository } from "../RepoComponents/Repository";

// Recall the enum ...
//VersionDependence = 5,
//PRMergeRestriction = 6,

// How crucial are each of these factors on a 1-7 scale?
/*
                   METRIC NAME      AN "IDEAL" SCORE IS
                ----------------------------------------
                 Ramp Up Time:      HIGH
                  Correctness:      HIGH
                   Bus Factor:      HIGH
    Maintainer Responsiveness:      HIGH
        License Compatibility:      == 1
           Version Dependency:       LOW        (Calculate this as the inverse of dependence, i.e. 1/dep)
         PR Merge Restriction:      HIGH

*/

export async function VersionDependence_Scorer(repo: Repository): Promise<number> {
    let number_of_dependencies = repo.QueryResult?.DependencyData?.length; 
    if (number_of_dependencies == undefined)
    {
        return 1;
    }
    if (number_of_dependencies < 0) 
    {
        throw new Error("Number of dependencies cannot be negative."); // Can be changed to return 0; 
    }

        return 1 / (1 + (number_of_dependencies/2));
}

export async function MergeRestriction_Scorer(repo: Repository): Promise<number> {
    // Placeholder for actual functionality
    let result = 0;
    return result;
}
