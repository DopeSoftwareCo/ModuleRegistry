/**
 * @author John Leidy
 * @description This validates the upload request. As requested via the schema either Content or URL may exist.
 * Never both
 * Never neither
 */
import { body, header } from "express-validator";

const InvalidUploadPackageMessage =
    "There is missing field(s) in the PackageData or it is formed improperly (e.g. Content and URL ar both set)";

export const UploadPackageRules = [
    // Validate Content field (exists if provided, and is a string)
    body("Content").optional().isString().withMessage(InvalidUploadPackageMessage),

    body("URL").optional().isString().withMessage(InvalidUploadPackageMessage),

    // Custom validator to check that only one of URL or Content exists
    body()
        .custom((value, { req }) => {
            const { Content, URL } = req.body;
            if ((Content && URL) || (!Content && !URL)) {
                return false;
            }
            return true;
        })
        .withMessage(InvalidUploadPackageMessage),
    body("JSProgram")
        .exists()
        .withMessage(InvalidUploadPackageMessage)
        .isString()
        .withMessage(InvalidUploadPackageMessage),
    body("debloat")
        .exists()
        .withMessage(InvalidUploadPackageMessage)
        .isBoolean()
        .withMessage(InvalidUploadPackageMessage),
];
