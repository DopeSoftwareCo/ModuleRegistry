import { Repository } from "../RepoComponents/Repository";

export type StandardScoringFunction = (repo: Repository) => number;
export type AsyncScoringFunction = (repo: Repository) => Promise<number>;
