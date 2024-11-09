import { Version } from "./Version";
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

async function SearchBy_Exact(critera: string): Promise<Package | undefined> {
    return undefined;
}

async function SearchBy_SimpleRange(critera: SearchByRange): Promise<Package[] | undefined> {
    return undefined;
}

async function SearchBy_Regex(critera: SearchByRegex): Promise<Package[] | undefined> {
    return undefined;
}

async function SearchBy_Tilde(critera: SearchByTilde): Promise<Package[] | undefined> {
    return undefined;
}

async function SearchBy_Carat(critera: SearchByCarat): Promise<Package[] | undefined> {
    return undefined;
}
