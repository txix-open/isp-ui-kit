import type { ThemeObject } from '../json-viewer.type';

/**
 * Точный тип значения дерева. Для числовых значений вместо 'number'
 * возвращаются 'integer', 'float' или 'nan'.
 */
export type JsonValueType =
  | 'object'
  | 'array'
  | 'string'
  | 'boolean'
  | 'null'
  | 'undefined'
  | 'integer'
  | 'float'
  | 'nan'
  | 'date'
  | 'function'
  | 'regexp';

const getType = (value: unknown): string => {
  const match = Object.prototype.toString.call(value).match(/\s([a-zA-Z]+)/);
  return match && match[1] ? match[1].toLowerCase() : 'undefined';
};

export const toType = (value: unknown): JsonValueType => {
  const type = getType(value);
  if (type === 'number') {
    if (Number.isNaN(value as number)) {
      return 'nan';
    }
    if ((value as number) % 1 !== 0) {
      return 'float';
    }
    return 'integer';
  }
  return type as JsonValueType;
};

const THEME_KEYS: Array<keyof ThemeObject> = [
  'base00',
  'base01',
  'base02',
  'base03',
  'base04',
  'base05',
  'base06',
  'base07',
  'base08',
  'base09',
  'base0A',
  'base0B',
  'base0C',
  'base0D',
  'base0E',
  'base0F',
];

/** Проверка валидности base-16 объекта темы. */
export const isTheme = (theme: unknown): theme is ThemeObject => {
  if (toType(theme) !== 'object') {
    return false;
  }
  return THEME_KEYS.every((key) => key in (theme as object));
};
