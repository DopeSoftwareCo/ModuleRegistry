/**
 * This module only contains a few small util functions!
 * @author DSinc
 */

export const pluralizeText = <T>(arr: T[], text: string) => `${text}${arr.length > 1 ? 's' : ''}`;