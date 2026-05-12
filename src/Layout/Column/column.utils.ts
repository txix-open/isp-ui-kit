import { ColumnItem } from './column.type';

export const NO_GROUP_KEY = 'noGroup';

export const hasValue = (value: unknown): boolean =>
  value !== undefined && value !== null && value !== '';

export const toStorageKey = (columnKey?: string): string => {
  const segments = window.location.pathname.replace(/^\/+/, '').split('/');
  const path = segments[0];
  return columnKey ? `${path}_${columnKey}` : path;
};

export const getAllGroupKeys = <T extends object>(
  grouped: Record<string, ColumnItem<T>[]>,
  hasUngrouped: boolean,
): string[] => {
  const keys = Object.keys(grouped);
  return hasUngrouped ? [...keys, NO_GROUP_KEY] : keys;
};

export const areSameStringSets = (left: string[], right: string[]): boolean => {
  const leftSorted = [...left].sort();
  const rightSorted = [...right].sort();
  return JSON.stringify(leftSorted) === JSON.stringify(rightSorted);
};

export const sortItemsByField = <T extends object>(
  arr: ColumnItem<T>[],
  sortValue?: keyof T,
  directionValue?: string,
): ColumnItem<T>[] => {
  if (!sortValue || !directionValue) {
    return arr;
  }

  return arr.slice().sort((a, b) => {
    const valueA = a[sortValue];
    const valueB = b[sortValue];

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return directionValue === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return directionValue === 'asc' ? valueA - valueB : valueB - valueA;
    }

    return directionValue === 'asc'
      ? String(valueA).localeCompare(String(valueB))
      : String(valueB).localeCompare(String(valueA));
  });
};

export const groupItems = <T extends object>(
  items: ColumnItem<T>[],
  groupBy?: keyof T,
): { grouped: Record<string, ColumnItem<T>[]>; ungrouped: ColumnItem<T>[] } => {
  if (!groupBy) {
    return { grouped: {}, ungrouped: items };
  }

  const grouped: Record<string, ColumnItem<T>[]> = {};
  const ungrouped: ColumnItem<T>[] = [];

  items.forEach((item) => {
    const groupKey = item[groupBy];
    if (hasValue(groupKey)) {
      const key = String(groupKey);
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(item);
      return;
    }

    ungrouped.push(item);
  });

  return { grouped, ungrouped };
};
