import { toType } from './valueType';

/**
 * Строковое представление значения для предзаполнения редактора
 * (поведение совпадает с legacy-компонентом).
 */
export const stringifyVariable = (value: unknown): string => {
  switch (toType(value)) {
    case 'undefined':
      return 'undefined';
    case 'nan':
      return 'NaN';
    case 'string':
      return value as string;
    case 'date':
      return (value as Date).toString();
    case 'function':
      return (value as { toString(): string }).toString();
    case 'regexp':
      return (value as { toString(): string }).toString();
    default:
      try {
        return JSON.stringify(value, null, '  ');
      } catch {
        return '';
      }
  }
};
