import type { StorePath } from '../state/ViewerStore';
import { namespaceKey } from './namespace';
import { stringifyVariable } from './stringifyVariable';
import { toType } from './valueType';

/**
 * Индекс поиска (prop search): абсолютные namespace-ключи контейнеров,
 * которые нужно автоматически раскрыть, чтобы совпадения были видимы
 * (все предки совпавшего узла; само совпадение-контейнер в индекс не
 * входит — его строка видна, когда раскрыт родитель).
 *
 * Совпадают (регистронезависимое подстроковое вхождение):
 * - имена ключей объектов (индексы массивов — шум, не совпадают);
 * - строковые представления примитивных значений.
 *
 * Ключи совпадают с системой флага 'expanded' (абсолютные namespace
 * с корневым именем) — один и тот же набор используется в flattenTree
 * (виртуальный режим) и в Node (обычный режим). Индексы элементов
 * массивов в обоих режимах различаются по типу (Node строит namespace
 * строками из Object.keys, flatten — числами), поэтому для такого
 * сегмента в индекс попадают обе формы ключа.
 */
export const buildSearchIndex = (
  src: unknown,
  rootSegment: string | number | null,
  search: string,
): ReadonlySet<string> => {
  const query = search.trim().toLowerCase();
  const index = new Set<string>();
  if (query === '') {
    return index;
  }

  const addKey = (key: string): void => {
    index.add(key);
    // Строковая форма числового индекса массива: '["a",5]' → '["a","5"]'
    const m = key.match(/^(.*),\d+\]$/);
    if (m) {
      index.add(`${m[1]},"${m[0].slice(m[1].length + 1, -1)}"]`);
    }
  };

  const addAll = (keys: string[]): void => {
    for (const key of keys) {
      addKey(key);
    }
  };

  const walk = (
    value: unknown,
    name: string | number | false | null,
    parentType: 'array' | 'object' | undefined,
    namespace: StorePath,
    /** Ключи контейнеров над текущим узлом (предки по пути). */
    ancestorKeys: string[],
  ): void => {
    const valueType = toType(value);
    const isContainer = valueType === 'object' || valueType === 'array';

    // совпадение по ключу (объектов, с примитивным или контейнерным
    // значением): строка узла видна, когда раскрыт родитель
    if (
      name !== null &&
      name !== false &&
      typeof name === 'string' &&
      name !== '' &&
      parentType !== 'array' &&
      name.toLowerCase().includes(query)
    ) {
      addAll(ancestorKeys);
    }

    if (!isContainer) {
      // совпадение по значению: нужны все контейнеры на пути
      const text =
        valueType === 'string' ? (value as string) : stringifyVariable(value);
      if (text.toLowerCase().includes(query)) {
        addAll(ancestorKeys);
      }
      return;
    }

    const selfKey = namespaceKey(namespace);
    const variables = value as Record<string, unknown>;
    const childType: 'array' | 'object' =
      valueType === 'array' ? 'array' : 'object';
    for (const key of Object.keys(variables)) {
      if (!Object.prototype.hasOwnProperty.call(variables, key)) {
        continue;
      }
      // Дети массивов в namespace — числа (так ключи строят
      // flattenArrayGroup/ArrayGroup); addKey добавит строковую
      // двойную форму для негрупповых массивов.
      const segment: string | number =
        childType === 'array' ? Number(key) : key;
      walk(
        variables[key],
        key,
        childType,
        [...namespace, segment],
        [...ancestorKeys, selfKey],
      );
    }
  };

  walk(src, null, undefined, [rootSegment], []);
  return index;
};
