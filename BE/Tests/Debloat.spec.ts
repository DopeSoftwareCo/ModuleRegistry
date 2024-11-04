import { debloatUploadedContent } from "../src/DSinc_Modules/DSinc_PackageHandling";
import { describe, expect, test } from "@jest/globals";

describe("Debloat Uploaded Content", () => {
    test("UploadIngestController", async () => {
        const testJSFile: string = `
            "use strict";
            var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
                function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
                return new (P || (P = Promise))(function (resolve, reject) {
                    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
                    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
                    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
                    step((generator = generator.apply(thisArg, _arguments || [])).next());
                });
            };
            var __importDefault = (this && this.__importDefault) || function (mod) {
                return (mod && mod.__esModule) ? mod : { "default": mod };
            };
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.UploadInjestController = void 0;
            const asyncHandler_1 = __importDefault(require("../Middleware/asyncHandler"));
            // /packages
            exports.UploadInjestController = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                //hover for custom typed body
                const body = req.body;
                //use the body data for your code here
                //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                //will need some return that signifies package exists already
                const existsAlready = false;
                //will need some return that signifies package is not uploaded due to disqualified rating
                const disqualified = false;
                const returnBody = {
                    metadata: {
                        Name: "some name",
                        Version: "Some version",
                        ID: "Some id",
                    },
                    //all fields are optional in data
                    data: {},
                };
                //this type is a union of our return strings
                let responseMessage;
                if (!existsAlready && !disqualified) {
                    res.status(200).json(returnBody);
                }
                else if (existsAlready) {
                    responseMessage = "Package exists already.";
                    res.status(409).send(responseMessage);
                }
                else if (disqualified) {
                    responseMessage = "Pacakge is not uploaded due to disqualified rating.";
                    res.status(424).send(responseMessage);
                }
            }));
        `;
        const size = testJSFile.length;
        const debloatedContent = await debloatUploadedContent(testJSFile);
        const debloatedSize = debloatedContent.length;
        console.log(debloatedSize + " < " + size);
        expect(debloatedSize).toBeLessThan(size);
    });
});