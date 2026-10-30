/**
 * Нормализованная JSON-значение: объекты, массивы и примитивы
 * (включая Date, RegExp, NaN и undefined, которые сохраняет исходный
 * компонент).
 */
export type JsonValue = unknown;

export type PathSegment = string | number;

/** Путь от корня src до узла (корень — пустой массив). */
export type JsonPath = PathSegment[];

/** Путь для чтения/записи: сегменты без null. */
export type ReadonlyJsonPath = ReadonlyArray<PathSegment>;

export const isPlainObject = (
  value: unknown,
): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

/** Чтение значения по массиву сегментов. Точки в именах ключей безопасны. */
export const getAtPath = (src: unknown, path: ReadonlyJsonPath): unknown => {
  let current: unknown = src;
  for (const segment of path) {
    if (current === null || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<PathSegment, unknown>)[segment];
  }
  return current;
};

/**
 * Неизменяемое установление значения по пути: создаются новые объекты
 * только вдоль пути, боковые поддеревья сохраняются по ссылке.
 * Пустой путь заменяет всё дерево.
 */
export const setAtPath = (
  src: unknown,
  path: ReadonlyJsonPath,
  value: unknown,
): unknown => {
  if (path.length === 0) {
    return value;
  }
  const [head, ...rest] = path;
  if (src === null || typeof src !== 'object') {
    return value;
  }
  const updatedNested = setAtPath(
    (src as Record<PathSegment, unknown>)[head],
    rest,
    value,
  );
  if (Array.isArray(src)) {
    const clone = [...(src as unknown[])];
    clone[Number(head)] = updatedNested;
    return clone;
  }
  const clone: Record<PathSegment, unknown> = {
    ...(src as Record<PathSegment, unknown>),
  };
  clone[head] = updatedNested;
  return clone;
};

/**
 * Неизменяемое удаление ключа: из массива — по индексу (splice),
 * из объекта — delete.
 */
export const removeAtPath = (src: unknown, path: ReadonlyJsonPath): unknown => {
  if (path.length === 0) {
    return src;
  }
  const key = path[path.length - 1];
  const parentPath = path.slice(0, -1);
  const parent = getAtPath(src, parentPath);
  let updatedParent: unknown;
  if (Array.isArray(parent)) {
    const index = typeof key === 'number' ? key : Number(key);
    updatedParent = parent.filter((_, position) => position !== index);
  } else if (isPlainObject(parent)) {
    updatedParent = { ...parent };
    delete (updatedParent as Record<string, unknown>)[String(key)];
  } else {
    return src;
  }
  return setAtPath(src, parentPath, updatedParent);
};

/**
 * Неизменяемое переименование ключа объекта. При конфликте имени
 * переименованное значение уходит в ключ `${newKey}-copy`, существующий
 * ключ сохраняет своё значение (поведение legacy-компонента).
 */
export const renameKeyAtPath = (
  src: unknown,
  path: ReadonlyJsonPath,
  newKey: string,
): unknown => {
  if (path.length === 0) {
    return src;
  }
  const oldKey = path[path.length - 1];
  const parentPath = path.slice(0, -1);
  const parent = getAtPath(src, parentPath);
  if (!isPlainObject(parent) || String(oldKey) === newKey) {
    return src;
  }
  const value = parent[String(oldKey)];
  const clone: Record<string, unknown> = { ...parent };
  const targetKey = Object.prototype.hasOwnProperty.call(clone, newKey)
    ? `${newKey}-copy`
    : newKey;
  clone[targetKey] = value;
  delete clone[String(oldKey)];
  return setAtPath(src, parentPath, clone);
};
