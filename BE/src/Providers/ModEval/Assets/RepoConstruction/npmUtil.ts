/**
 * Checks whether the provided URL is a valid npm package link.
 *
 * @param url - The URL to check.
 * @returns `true` if the URL is an npm package URL, otherwise `false`.
 */
function isNpmLink(url: string): boolean {
    // Regex to check if the input is an npmjs URL
    const npmRegex = /^(https?:\/\/)?(www\.)?npmjs\.com\/package\/(.+)$/;
    return npmRegex.test(url);
}
