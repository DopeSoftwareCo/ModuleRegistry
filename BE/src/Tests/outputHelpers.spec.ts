import { describe, expect, it } from "@jest/globals";
import { getRemainingWidth } from "../Middleware/logging/outputHelpers";

describe("Output Helpers", () => {
    it("Should get proper remaining width", () => {
        const remainingWidth = getRemainingWidth(100, 20);
        expect(remainingWidth).toBe(40);
    });
});
