import type { JsonValueType } from './valueType';

/** Результат разбора пользовательского ввода в редакторе значений. */
export interface ParsedInput {
  type: JsonValueType | false;
  value: unknown;
}

const formatResponse = (
  type: JsonValueType | false,
  value: unknown,
): ParsedInput => ({
  type,
  value,
});

/**
 * Определение типа вводимого значения (best guess), поведение совпадает
 * с legacy-редактором: JSON-объекты/массивы, float, integer (включая
 * scientific notation), undefined, NaN, null, boolean и даты.
 */
export const parseInput = (rawInput: string): ParsedInput => {
  // Работа идёт с сериализованным представлением данных.
  let input = rawInput.trim();
  try {
    input = JSON.stringify(JSON.parse(input));
    if (input[0] === '[') {
      // массив
      return formatResponse('array', JSON.parse(input));
    }
    if (input[0] === '{') {
      // объект
      return formatResponse('object', JSON.parse(input));
    }
    const floatMatch = input.match(/-?\d+\.\d+/);
    if (floatMatch && floatMatch[0] === input) {
      // float
      return formatResponse('float', parseFloat(input));
    }
    const sciFloatMatch = input.match(/-?\d+e-\d+/);
    if (sciFloatMatch && sciFloatMatch[0] === input) {
      // scientific float
      return formatResponse('float', Number(input));
    }
    const intMatch = input.match(/-?\d+/);
    if (intMatch && intMatch[0] === input) {
      // integer
      return formatResponse('integer', parseInt(input, 10));
    }
    const sciIntMatch = input.match(/-?\d+e\+\d+/);
    if (sciIntMatch && sciIntMatch[0] === input) {
      // scientific integer
      return formatResponse('integer', Number(input));
    }
  } catch {
    // не сериализуется — разбираем ниже по строке
  }

  input = input.toLowerCase();
  switch (input) {
    case 'undefined':
      return formatResponse('undefined', undefined);
    case 'nan':
      return formatResponse('nan', NaN);
    case 'null':
      return formatResponse('null', null);
    case 'true':
      return formatResponse('boolean', true);
    case 'false':
      return formatResponse('boolean', false);
    default: {
      // проверяем, является ли значение датой
      const time = Date.parse(input);
      if (time) {
        return formatResponse('date', new Date(time));
      }
    }
  }

  return formatResponse(false, null);
};
