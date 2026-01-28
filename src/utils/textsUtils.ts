export type TextDictionary = Record<string, string>;

export type TextParams = Record<string, string>;

export const getText = <T extends TextDictionary, K extends keyof T & string>(
  texts: T | undefined,
  key: K,
  fallback?: string,
  params?: TextParams,
): string => {
  if (!texts) return fallback ?? '';

  let text = (texts[key] as string) ?? fallback ?? '';

  if (params) {
    for (const paramKey in params) {
      text = text.replace(new RegExp(`{{${paramKey}}}`, 'g'), params[paramKey]);
    }
  }

  return text;
};

export const verifyTextKey = <
  T extends TextDictionary,
  K extends keyof T & string,
>(
  texts: T | undefined,
  key: K,
): boolean => Boolean(texts?.[key]);

export const createTextGetter = <T extends TextDictionary>(
  texts: T | undefined,
) => {
  return <K extends keyof T & string>(
    key: K,
    fallback?: string,
    params?: TextParams,
  ): string => getText(texts, key, fallback, params);
};

export const createTextVerifier = <T extends TextDictionary>(
  texts: T | undefined,
) => {
  return <K extends keyof T & string>(key: K): boolean =>
    verifyTextKey(texts, key);
};
