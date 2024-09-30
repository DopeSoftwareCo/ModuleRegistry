export const pluralizeText = <T>(arr: T[], text: string) => `${text}${arr.length > 1 ? 's' : ''}`;
