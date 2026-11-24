/** Публичное namespace для колбэков: строки, корневое имя — string | null. */
export type PublicNamespace = Array<string | null>;

/**
 * Уникальный ключ состояния для пути узла. В отличие от legacy
 * (String-конкатенация, где 'a,b' и 'a','b' пересекались),
 * JSON-сериализация массива сегментов не допускает коллизий.
 */
export const namespaceKey = (
  path: ReadonlyArray<string | number | null>,
): string => JSON.stringify(path);

/**
 * Ключ пути с дописанным ЧИСЛОВЫМ сегментом по уже готовому ключу
 * (дешевле, чем восстановление массива: '["a","b"]' + 3 → '["a","b",3]').
 */
export const childNamespaceKey = (nsKey: string, segment: number): string =>
  `${nsKey.slice(0, -1)},${segment}]`;

/** Публичное namespace с корневым именем (для payload колбэков). */
export const toPublicNamespace = (
  rootName: string | number | null | false,
  path: ReadonlyArray<string | number>,
): PublicNamespace => [toPublicName(rootName), ...toPublicSegments(path)];

/** Публичные сегменты без корневого имени (для onSelect). */
export const toPublicSegments = (
  path: ReadonlyArray<string | number>,
): PublicNamespace =>
  path.map((segment) =>
    typeof segment === 'number' ? String(segment) : segment,
  );

/** Публичное имя узла для колбэков. */
export const toPublicName = (
  name: string | number | null | false,
): string | null => (name === null || name === false ? null : String(name));
