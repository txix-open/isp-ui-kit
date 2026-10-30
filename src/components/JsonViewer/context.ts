import { createContext, useContext } from 'react';
import type { CSSProperties } from 'react';
import type { Styling } from 'react-base16-styling';

import type {
  EnableClipboard,
  IconStyle,
  InteractionCallback,
  OnSelectProps,
  ShouldCollapse,
  TypeDefaultValue,
} from './json-viewer.type';
import type { JsonPath, PathSegment } from './utils/immutable';
import type { ViewerStore } from './state/ViewerStore';

/** Функция получения темизированного стиля: `style('brace')` → { className?, style? }. */
export type ThemedStyleFn = (
  name: string,
  extraStyle?: CSSProperties,
) => Styling;

/**
 * Запрос открытия модалки ключей:
 * - add — добавить ключ в объект по пути nodePath;
 * - edit — переименовать ключ oldKey в контейнере по пути parentPath.
 */
export type KeyRequest =
  | { mode: 'add'; nodePath: JsonPath }
  | {
      mode: 'edit';
      parentPath: JsonPath;
      oldKey: string;
      existingValue: unknown;
    };

/**
 * Действия дерева. Все пути — относительные от корня src
 * (пустой массив — корень); публичные namespace колбэков
 * собираются в корне из этих путей.
 */
export interface ViewerActions {
  /** Изменить примитивное значение: ключ key в контейнере parentPath. */
  editVariable: (
    parentPath: JsonPath,
    key: PathSegment,
    newValue: unknown,
    existingValue: unknown,
  ) => void;
  /** Изменить ветевое значение (объект/массив) узла nodePath. */
  editBranch: (
    nodePath: JsonPath,
    newValue: unknown,
    existingValue: unknown,
  ) => void;
  /** Удалить узел (примитив или ветку) по ключу. */
  removeVariable: (
    parentPath: JsonPath,
    key: PathSegment,
    existingValue: unknown,
  ) => void;
  /** Дописать null в массив nodePath. */
  appendToArray: (nodePath: JsonPath, existingValue: unknown) => void;
  /** Запросить модалку добавления ключа к объекту nodePath. */
  requestAddKey: (nodePath: JsonPath) => void;
  /** Запросить модалку переименования ключа oldKey в контейнере parentPath. */
  requestRenameKey: (
    parentPath: JsonPath,
    oldKey: string,
    existingValue: unknown,
  ) => void;
  /** Закрыть модалку и сбросить баннер валидации (legacy RESET). */
  reset: () => void;
}

/**
 * Контекст экземпляра зрителя: store, функция стилей, настройки
 * (аналог legacy "...rest") и действия.
 */
export interface ViewerContextValue {
  /** Имя корня (false → null), используется в публичных namespace. */
  rootName: string | null;
  store: ViewerStore;
  style: ThemedStyleFn;
  /** Виртуализованный режим (задан maxHeight): строки одной высотой,
   * раскрытие длинных значений — в overlay, а не inline. */
  virtual: boolean;
  /**
   * Ключи узлов для авто-раскрытия при поиске (абсолютные
   * namespace-ключи совпавших узлов и их предков); null — поиск выключен.
   */
  searchExpandKeys: ReadonlySet<string> | null;
  /** Запрос поиска (prop search); пустая строка — поиск выключен. */
  search: string;

  collapsed: boolean | number;
  collapseStringsAfterLength: number | false;
  shouldCollapse: ShouldCollapse;
  sortKeys: boolean;
  editKeys: boolean;
  groupArraysAfterLength: number;
  indentWidth: number;
  enableClipboard: EnableClipboard;
  displayObjectSize: boolean;
  displayDataTypes: boolean;
  iconStyle: IconStyle;
  defaultValue: TypeDefaultValue | TypeDefaultValue[] | null;
  onEdit: InteractionCallback | false;
  onAdd: InteractionCallback | false;
  onDelete: InteractionCallback | false;
  onSelect: ((select: OnSelectProps) => void) | false;

  actions: ViewerActions;
}

export const ViewerContext = createContext<ViewerContextValue | null>(null);

/** Доступ к контексту экземпляра зрителя. */
export const useViewer = (): ViewerContextValue => {
  const context = useContext(ViewerContext);
  if (!context) {
    throw new Error(
      'Компоненты JsonViewer должны рендериться внутри <ReactJsonView>',
    );
  }
  return context;
};
