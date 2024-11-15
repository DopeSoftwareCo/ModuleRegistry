import { Version } from "./Version";
import { APIPackage } from "../Types/Models";

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

async function SearchBy_Exact(critera: string): Promise<APIPackage | undefined> {
    return undefined;
}

async function SearchBy_SimpleRange(critera: SearchByRange): Promise<APIPackage[] | undefined> {
    return undefined;
}

async function SearchBy_Regex(critera: SearchByRegex): Promise<APIPackage[] | undefined> {
    return undefined;
}

async function SearchBy_Tilde(critera: SearchByTilde): Promise<APIPackage[] | undefined> {
    return undefined;
}

async function SearchBy_Carat(critera: SearchByCarat): Promise<APIPackage[] | undefined> {
    return undefined;
}
