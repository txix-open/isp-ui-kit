import { SINGLE_INDENT } from '../constants';
import type { ShouldCollapse } from '../json-viewer.type';
import type { StorePath, ViewerStore } from '../state/ViewerStore';
import type { JsonPath } from '../utils/immutable';
import {
  childNamespaceKey,
  namespaceKey,
  toPublicNamespace,
  toPublicName,
} from '../utils/namespace';
import { toType, type JsonValueType } from '../utils/valueType';

/**
 * Плоское представление видимого дерева для виртуализованного
 * рендера (prop maxHeight): раскрытые контейнеры разворачиваются
 * в строки, свёрнутые — в одну строку. Строки имеют фиксированную
 * высоту, поэтому отрисовывается только видимое окно.
 */

/** Конфигурация флаттеризации (настройки экземпляра зрителя). */
export interface FlattenSettings {
  rootName: string | number | false | null;
  collapsed: boolean | number;
  shouldCollapse: ShouldCollapse;
  sortKeys: boolean;
  groupArraysAfterLength: number;
  indentWidth: number;
}

/** Строка-ветка (объект/массив). */
export interface BranchRowData {
  name: string | number | false | null;
  /** JSON-ключ абсолютного namespace (ключ store/React). */
  namespaceKeyStr: string;
  /** Абсолютное namespace (корневое имя + путь). */
  namespace: StorePath;
  /** Путь от корня src (для actions). */
  path: JsonPath;
  type: 'object' | 'array';
  /** Тип контейнера-родителя (для условий действий). */
  parentType: 'array' | 'object' | undefined;
  size: number;
  src: unknown;
  depth: number;
  jsvRoot: boolean;
}

/** Строка примитивного значения. */
export interface ValueRowData {
  name: string;
  value: unknown;
  type: JsonValueType;
  parentType: 'array' | undefined;
  /** Путь контейнера от корня src. */
  parentPath: JsonPath;
  /** Путь значения от корня src. */
  valuePath: JsonPath;
  /** JSON-ключ пути значения (флаги string/function). */
  valuePathKey: string;
  /** Собственная глубина строки (ребро корня — 1). */
  depth: number;
}

/** Строка группы длинного массива. */
export interface GroupRowData {
  /** JSON-ключ абсолютного namespace массива. */
  arrayNamespaceKeyStr: string;
  arrayNamespace: StorePath;
  /** Путь массива от корня src. */
  arrayPath: JsonPath;
  groupIndex: number;
  rangeStart: number;
  rangeEnd: number;
  arrayLength: number;
  /** Глубина массива (корень — 0). */
  depth: number;
  /** Эффективное раскрытие содержимого группы (флаг 'expanded' массива). */
  expanded: boolean;
  src: unknown[];
  jsvRoot: boolean;
}

export type FlatRow =
  | { kind: 'node-collapsed'; node: BranchRowData }
  | { kind: 'node-open'; node: BranchRowData }
  | { kind: 'node-close'; node: BranchRowData }
  | { kind: 'array-group-header'; node: BranchRowData }
  | { kind: 'value'; value: ValueRowData }
  | { kind: 'group-collapsed'; group: GroupRowData }
  | { kind: 'group-open-collapsed'; group: GroupRowData }
  | { kind: 'group-open'; group: GroupRowData }
  | { kind: 'group-close'; group: GroupRowData };

/** Целевой узел редактора значения (overlay в виртуализованном режиме). */
export type EditorTarget =
  | { kind: 'value'; parentPath: JsonPath; name: string; value: unknown }
  | { kind: 'branch'; nodePath: JsonPath; src: unknown };

/** Стабильный ключ строки (React key, привязка overlay). */
export const flatRowKey = (row: FlatRow): string => {
  switch (row.kind) {
    case 'node-collapsed':
    case 'node-open':
      return `n:${row.node.namespaceKeyStr}`;
    case 'node-close':
      return `c:${row.node.namespaceKeyStr}`;
    case 'array-group-header':
      return `ah:${row.node.namespaceKeyStr}`;
    case 'value':
      return `v:${row.value.valuePathKey}`;
    case 'group-collapsed':
      return `gc:${row.group.arrayNamespaceKeyStr}:${row.group.groupIndex}`;
    case 'group-open-collapsed':
      return `goc:${row.group.arrayNamespaceKeyStr}:${row.group.groupIndex}`;
    case 'group-open':
      return `go:${row.group.arrayNamespaceKeyStr}:${row.group.groupIndex}`;
    case 'group-close':
      return `gcl:${row.group.arrayNamespaceKeyStr}:${row.group.groupIndex}`;
  }
};

// --- геометрия строк (1:1 порт legacy вложенности) ---
//
// Legacy: каждый уровень — div objectKeyVal (borderLeft 1px + paddingLeft W)
// и контент внутри pushed-content (marginLeft M). Отсюда для строки
// на глубине d: направляющие линии x = M + S*(i-1) (i = 1..d),
// контент x = M + S*(d-1) + B + W, где S = W + B + M.

const BORDER = 1; // keyValBorderLeft
const PUSHED_MARGIN = 6; // pushedContentMarginLeft

const nodeGuides = (depth: number, step: number): number[] =>
  depth === 0
    ? []
    : Array.from({ length: depth }, (_, i) => PUSHED_MARGIN + step * i);

const nodePaddingLeft = (depth: number, step: number): number =>
  depth === 0 ? 0 : step * depth;

export interface RowGeometry {
  /** X-координаты направляющих (borderLeft-линии уровней). */
  guides: number[];
  /** Отступ контента строки. */
  paddingLeft: number;
}

/** Геометрия строки (позиции направляющих и контента). */
export const rowGeometry = (row: FlatRow, indentWidth: number): RowGeometry => {
  const step = indentWidth * SINGLE_INDENT + BORDER + PUSHED_MARGIN;
  const guidesFor = (depth: number) => nodeGuides(depth, step);
  const plFor = (depth: number) => nodePaddingLeft(depth, step);

  switch (row.kind) {
    case 'node-collapsed':
    case 'node-open':
    case 'node-close':
    case 'array-group-header':
      return {
        guides: guidesFor(row.node.depth),
        paddingLeft: plFor(row.node.depth),
      };
    case 'value':
      return {
        guides: guidesFor(row.value.depth),
        paddingLeft: plFor(row.value.depth),
      };
    case 'group-collapsed':
    case 'group-open-collapsed':
    case 'group-open':
    case 'group-close': {
      const d = row.group.depth;
      const arrayContent = plFor(d);
      return {
        guides: [...guidesFor(d), arrayContent + PUSHED_MARGIN],
        paddingLeft:
          arrayContent + PUSHED_MARGIN + BORDER + indentWidth * SINGLE_INDENT,
      };
    }
  }
};

// --- флаттеризация ---

const rootSegmentOf = (
  rootName: string | number | false | null,
): string | number | null =>
  rootName === false || rootName === null ? null : rootName;

const getKeys = (src: unknown, sortKeys: boolean): string[] => {
  const keys = Object.keys((src as Record<string, unknown>) ?? {});
  return sortKeys ? [...keys].sort() : keys;
};

/**
 * Раскрытие узла: сохранённый флаг имеет приоритет; иначе — дефолт
 * (collapsed/shouldCollapse/пустота) плюс авто-раскрытие по поиску.
 */
const nodeExpanded = (
  store: ViewerStore,
  namespaceKeyStr: string,
  depth: number,
  size: number,
  name: string | number | false | null,
  src: unknown,
  path: JsonPath,
  rootSegment: string | number | null,
  settings: FlattenSettings,
  searchExpandKeys: ReadonlySet<string> | null,
  collapsedOverride?: boolean,
): boolean => {
  const shouldCollapseOk =
    settings.shouldCollapse === false ||
    settings.shouldCollapse({
      name: toPublicName(name),
      src: (src as object) ?? {},
      type: toType(src) === 'array' ? 'array' : 'object',
      namespace: toPublicNamespace(rootSegment, path),
    }) === false;

  // legacy-дефолт: collapsed (группы — всегда false) и не-пустой узел
  const collapsed = collapsedOverride ?? settings.collapsed;
  const isNumeric = typeof collapsed === 'number';
  const defaultExpanded =
    (collapsed === false || (isNumeric && collapsed > depth)) &&
    shouldCollapseOk &&
    size !== 0;

  const searchAuto = searchExpandKeys?.has(namespaceKeyStr) ?? false;
  const stored = store.peek('expanded', namespaceKeyStr);
  return stored !== undefined ? stored : defaultExpanded || searchAuto;
};

const flattenBranch = (
  rows: FlatRow[],
  src: unknown,
  name: string | number | false | null,
  namespace: StorePath,
  path: JsonPath,
  depth: number,
  parentType: 'array' | 'object' | undefined,
  settings: FlattenSettings,
  store: ViewerStore,
  searchExpandKeys: ReadonlySet<string> | null,
): void => {
  const size = Object.keys((src as object) ?? {}).length;
  const namespaceKeyStr = namespaceKey(namespace);
  const isRoot = path.length === 0;

  const node: BranchRowData = {
    name,
    namespaceKeyStr,
    namespace,
    path,
    type: Array.isArray(src) ? 'array' : 'object',
    parentType,
    size,
    src,
    depth,
    jsvRoot: isRoot,
  };

  const groupSize = settings.groupArraysAfterLength;
  const useGroups =
    groupSize !== 0 && Array.isArray(src) && src.length > groupSize;

  if (useGroups) {
    rows.push({ kind: 'array-group-header', node });
    const groups = Math.ceil(src.length / groupSize);
    for (let i = 0; i < groups; i += 1) {
      flattenArrayGroup(
        rows,
        src as unknown[],
        namespace,
        namespaceKeyStr,
        path,
        depth,
        i,
        groupSize,
        settings,
        store,
        searchExpandKeys,
      );
    }
    return;
  }

  const expanded = nodeExpanded(
    store,
    namespaceKeyStr,
    depth,
    size,
    name,
    src,
    path,
    rootSegmentOf(settings.rootName),
    settings,
    searchExpandKeys,
  );

  if (!expanded) {
    rows.push({ kind: 'node-collapsed', node });
    return;
  }

  rows.push({ kind: 'node-open', node });
  const variables = (src as Record<string, unknown>) ?? {};
  const keys = getKeys(src, settings.sortKeys);
  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(variables, key)) {
      continue;
    }
    const value = variables[key];
    const vType = toType(value);
    if (vType === 'object' || vType === 'array') {
      flattenBranch(
        rows,
        value,
        key,
        [...namespace, key],
        [...path, key],
        depth + 1,
        node.type,
        settings,
        store,
        searchExpandKeys,
      );
    } else {
      const valuePath: JsonPath = [...path, key];
      rows.push({
        kind: 'value',
        value: {
          name: String(key),
          value,
          type: vType,
          parentType: node.type === 'array' ? 'array' : undefined,
          parentPath: path,
          valuePath,
          valuePathKey: namespaceKey(valuePath),
          depth: depth + 1,
        },
      });
    }
  }
  rows.push({ kind: 'node-close', node });
};

/**
 * Группа длинного массива (1:1 порт ArrayGroup): раскрытие группы —
 * отдельный флаг groupExpanded; раскрытие содержимого — общий флаг
 * 'expanded' самого массива (legacy передавал групповому объекту
 * collapsed={false}).
 */
const flattenArrayGroup = (
  rows: FlatRow[],
  src: unknown[],
  namespace: StorePath,
  namespaceKeyStr: string,
  path: JsonPath,
  depth: number,
  groupIndex: number,
  groupSize: number,
  settings: FlattenSettings,
  store: ViewerStore,
  searchExpandKeys: ReadonlySet<string> | null,
): void => {
  const rangeStart = groupIndex * groupSize;
  const rangeEnd = Math.min(src.length, rangeStart + groupSize);

  const groupKey = namespaceKey([...namespace, groupIndex]);
  const storedGroup = store.peek('groupExpanded', groupKey);
  // Поиск: сохранённый флаг приоритетнее; иначе группа раскрывается
  // автоматически, если содержит совпадение (ключи элементов группы —
  // предки совпавших значений — присутствуют в индексе).
  let searchWants = false;
  if (storedGroup === undefined && searchExpandKeys !== null) {
    for (let i = rangeStart; i < rangeEnd && !searchWants; i += 1) {
      searchWants = searchExpandKeys.has(childNamespaceKey(namespaceKeyStr, i));
    }
  }
  const groupOpen = storedGroup ?? searchWants;

  if (!groupOpen) {
    rows.push({
      kind: 'group-collapsed',
      group: makeGroupRowData(
        src,
        namespace,
        namespaceKeyStr,
        path,
        depth,
        groupIndex,
        rangeStart,
        rangeEnd,
        false,
      ),
    });
    return;
  }

  const slice = src.slice(rangeStart, rangeEnd);
  // legacy: содержимое группы — отдельный объект с name=false и
  // src=срез; shouldCollapse для него проверяется отдельно
  const sliceSize = slice.length;
  const searchAuto = searchExpandKeys?.has(namespaceKeyStr) ?? false;
  const shouldCollapseOk =
    settings.shouldCollapse === false ||
    settings.shouldCollapse({
      name: null,
      src: slice,
      type: 'array',
      namespace: toPublicNamespace(rootSegmentOf(settings.rootName), path),
    }) === false;
  const stored = store.peek('expanded', namespaceKeyStr);
  const groupNodeExpanded =
    stored !== undefined
      ? stored
      : (shouldCollapseOk && sliceSize !== 0) || searchAuto;

  const group = makeGroupRowData(
    src,
    namespace,
    namespaceKeyStr,
    path,
    depth,
    groupIndex,
    rangeStart,
    rangeEnd,
    groupNodeExpanded,
  );

  if (!groupNodeExpanded) {
    // группа открыта, но содержимое свёрнуто: [ ... ] + бейдж размера
    rows.push({ kind: 'group-open-collapsed', group });
    return;
  }

  rows.push({ kind: 'group-open', group });
  for (let i = rangeStart; i < rangeEnd; i += 1) {
    const value = src[i];
    const vType = toType(value);
    if (vType === 'object' || vType === 'array') {
      flattenBranch(
        rows,
        value,
        i,
        [...namespace, i],
        [...path, i],
        depth + 1,
        'array',
        settings,
        store,
        searchExpandKeys,
      );
    } else {
      const valuePath: JsonPath = [...path, i];
      rows.push({
        kind: 'value',
        value: {
          name: String(i),
          value,
          type: vType,
          parentType: 'array',
          parentPath: path,
          valuePath,
          valuePathKey: namespaceKey(valuePath),
          depth: depth + 1,
        },
      });
    }
  }
  rows.push({ kind: 'group-close', group });
};

const makeGroupRowData = (
  src: unknown[],
  namespace: StorePath,
  namespaceKeyStr: string,
  path: JsonPath,
  depth: number,
  groupIndex: number,
  rangeStart: number,
  rangeEnd: number,
  expanded: boolean,
): GroupRowData => ({
  arrayNamespaceKeyStr: namespaceKeyStr,
  arrayNamespace: namespace,
  arrayPath: path,
  groupIndex,
  rangeStart,
  rangeEnd,
  arrayLength: src.length,
  depth,
  expanded,
  src,
  jsvRoot: path.length === 0,
});

/**
 * Плоский список видимых строк дерева. Переисчисляется при смене
 * src, настроек, флагов store и поискового авто-раскрытия — O(видимых
 * узлов) по стоимости.
 */
export const flattenTree = (
  src: unknown,
  settings: FlattenSettings,
  store: ViewerStore,
  searchExpandKeys: ReadonlySet<string> | null,
): FlatRow[] => {
  const rows: FlatRow[] = [];
  const rootSegment = rootSegmentOf(settings.rootName);
  flattenBranch(
    rows,
    src,
    settings.rootName,
    [rootSegment],
    [],
    0,
    undefined,
    settings,
    store,
    searchExpandKeys,
  );
  return rows;
};
