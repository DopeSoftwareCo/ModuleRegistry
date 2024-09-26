import chalk from "chalk";

const statusTextMap: { [key: number]: string } = {
    200: "OK",
    201: "Created",
    404: "Not Found",
    400: "Bad Request",
    500: "Internal Server Error",
};

const ansiRegex = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

const happySad = (statusCode: number) => statusCode >= 200 && statusCode < 300;

export const getColorBasedOnCode = (statusCode: number, textToColor: any) =>
    happySad(statusCode) ? chalk.greenBright(textToColor) : chalk.redBright(textToColor);

const getStatusCodeEmojis = (statusCode: number) => (happySad(statusCode) ? "✅" : "❌");

const getStatusText = (statusCode: number) =>
    Object.keys(statusTextMap).includes(statusCode.toString()) ? statusTextMap[statusCode] : "unkown status";

const getPadding = (difference: number) => "═".repeat(difference / 2);

const getMsText = (ms: number) => `${ms.toString()}ms`;

const getColorBasedOnMS = (ms: string) => {
    const msNum = parseInt(ms);
    return msNum >= 1000
        ? chalk.redBright(getMsText(msNum))
        : msNum < 1000 && msNum > 50
        ? chalk.yellowBright(getMsText(msNum))
        : chalk.greenBright(getMsText(msNum));
};

const getLengthOfColoredText = (coloredText: string) => coloredText.replace(ansiRegex, "").length;

export const getRemainingWidth = (desiredWidth: number, contentWidth: number): number =>
    Math.max(0, Math.floor((desiredWidth - (contentWidth % 2 === 0 ? contentWidth : contentWidth - 1)) / 2));

export const generateTopSeparator = (topSeparatorText: string, desiredWidth: number) => {
    const output = ` ${getReadbleDate()} ${topSeparatorText} `;
    const widthRemaining = getRemainingWidth(desiredWidth, output.length);
    return `\n\n🌟 ${getPadding(widthRemaining)}${output}${getPadding(widthRemaining)} 🌟\n\n`;
};

export const generateBottomSeparator = (
    bottomSeparatorText: string,
    desiredWidth: number,
    statusCode: number
) => {
    const statusText = getStatusText(statusCode);
    const output = ` ${getColorBasedOnMS(bottomSeparatorText)} ${getReadbleDate()} ${getColorBasedOnCode(
        statusCode,
        statusText
    )} `;
    const widthRemaining = getRemainingWidth(desiredWidth, getLengthOfColoredText(output));
    return `\n\n${getStatusCodeEmojis(statusCode)} ${getPadding(widthRemaining)}${output}${getPadding(
        widthRemaining
    )} ${getStatusCodeEmojis(statusCode)}\n\n`;
};

export const generateOutputSeparator = (currentOutput: string, desiredWidth: number, statusCode?: number) =>
    statusCode
        ? generateBottomSeparator(currentOutput, desiredWidth, statusCode)
        : generateTopSeparator(currentOutput, desiredWidth);

export const getReadbleDate = () => {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const period = hours >= 12 ? "PM" : "AM";
    const adjustedHours = hours % 12 || 12;
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    const timeString = `${adjustedHours}:${formattedMinutes}:${formattedSeconds} ${period}`;
    return timeString;
};
