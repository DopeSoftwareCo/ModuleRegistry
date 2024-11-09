import { Version } from "../Classes/Users/User_PackageOps";
import { Package } from "../Types/Models";

enum SearchType {
    Exact = 0,
    SimpleRange = 1,
    Regex = 2,
    Tilde = 3,
    Carat = 4,
}

type RegistrySearch = string | SearchByRange | SearchByRegex | SearchByTilde | SearchByCarat;

type SearchByRange = {
    latest: string;
    earliest: string;
};

type SearchByRegex = {};

type SearchByTilde = {};

type SearchByCarat = {};

async function FilterVersions(
    searchBy: SearchType,
    criteria: RegistrySearch
): Promise<Package[] | undefined> {
    try {
        // Tim's content here
        let result;
        switch (searchBy) {
            case SearchType.Exact:
                result = SearchBy_Exact(critera);
                break;
            case SearchType.Exact:
                result = SearchBy_SimpleRange(critera);
                break;
            case SearchType.Exact:
                result = SearchBy_Regex(critera);
                break;
            case SearchType.Exact:
                result = SearchBy_Tilde(critera);
                break;
            case SearchType.Exact:
                result = SearchBy_Carat(critera);
                break;
            default:
                return undefined;
        }
    } catch (error) {
        return undefined;
    }
}

async function SearchBy_Exact(critera: Version): Promise<Package | undefined> {
    return undefined;
}

async function SearchBy_SimpleRange(critera: Version): Promise<Package[] | undefined> {
    return undefined;
}

async function SearchBy_Regex(critera: Version): Promise<Package[] | undefined> {
    return undefined;
}

async function SearchBy_Tilde(critera: Version): Promise<Package[] | undefined> {
    return undefined;
}

async function SearchBy_Carat(critera: Version): Promise<Package[] | undefined> {
    return undefined;
}
