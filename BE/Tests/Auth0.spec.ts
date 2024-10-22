import { beforeEach, describe, expect, it } from "@jest/globals";
import { getFetchSpy } from "./TestUtils/mocks";
import { authenticateViaAuth0 } from "../src/Providers/Auth0/AuthenticateAuth0";
import { userInfo } from "os";
import { AuthenticationRequestBody } from "RequestTypes";

describe("Auth0", () => {
    beforeEach(() => {
        process.env.AUTH0_CLIENT_ID = "CLIENT";
        process.env.AUTH0_CLIENT_SECRET = "SEC";
        process.env.AUTH0_AUDIENCE = "AUD";
        process.env.AUTH0_DOMAIN = "DOM";
    });
    it("Should return a token", async () => {
        const fetchSpy = getFetchSpy(
            { access_token: "TEST-TOKEN", expires_in: 36000, token_type: "Bearer" },
            200,
            false
        );
        const authRequestBody: AuthenticationRequestBody = {
            User: { name: "Some name", isAdmin: true },
            Secret: { password: "some password" },
        };
        const res = await authenticateViaAuth0(authRequestBody);
        expect(res.token).toBe("Bearer TEST-TOKEN");
    });
});
