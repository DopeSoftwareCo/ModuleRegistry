import "jsonwebtoken";
import * as jsonwebtoken from "jsonwebtoken";

declare module "jsonwebtoken" {
    export interface TokenType extends jsonwebtoken.JwtPayload {
        username?: string;
        permissions?: string[];
    }
}
