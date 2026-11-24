import { useSyncExternalStore } from 'react';

import { namespaceKey } from '../utils/namespace';

/**
 * Типы сохраняемых отображений узлов:
 * - expanded — раскрытие объектов и массивов;
 * - stringCollapsed — обрезка длинных строк (per-value);
 * - functionCollapsed — свёртка отображения функций (per-value);
 * - groupExpanded — раскрытие группы длинного массива (пер-группа).
 */
export type StoreFlag =
  | 'expanded'
  | 'stringCollapsed'
  | 'functionCollapsed'
  | 'groupExpanded';

/** Путь узла: сегменты ключей (в корне может быть null — имя корня false). */
export type StorePath = ReadonlyArray<string | number | null>;

type Listener = () => void;

/**
 * Хранилище состояний отображения одного экземпляра зрителя.
 *
 * В отличие от legacy (глобальный singleton + global dispatcher + rjvId),
 * store живёт вместе с компонентом: состояния не текут между экземплярами
 * и не живут после unmount.
 *
 * Версионирование пер-путь: смена флага влияет только версию соответствующего
 * пути, поэтому toggle одного узла перечитывается (и перерисовывается)
 * только этим узлом, а не всем деревом.
 */
export class ViewerStore {
  private values = new Map<string, boolean>();
  /** Версии флагов по путям: ключ — флаг + JSON-ключ пути узла. */
  private versions = new Map<string, number>();
  /** Глобальная версия (для подписчиков, отслеживающих дерево целиком). */
  private globalVersion = 0;
  private listeners = new Set<Listener>();

  /** Подписка для useSyncExternalStore (стабильная ссылка). */
  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  /**
   * Версия флага конкретного пути (стабильный снимок для
   * useSyncExternalStore): меняется только при смене этого пути.
   */
  getVersion = (flag: StoreFlag, pathKey: string): number =>
    this.versions.get(this.key(flag, pathKey)) ?? 0;

  /** Глобальная версия: меняется при любом изменении хранилища. */
  getGlobalVersion = (): number => this.globalVersion;

  get = (flag: StoreFlag, pathKey: string, defaultValue: boolean): boolean =>
    this.values.get(this.key(flag, pathKey)) ?? defaultValue;

  /** Сохранённое значение без fallback: undefined, если флаг не задан. */
  peek = (flag: StoreFlag, pathKey: string): boolean | undefined =>
    this.values.get(this.key(flag, pathKey));

  set = (flag: StoreFlag, pathKey: string, value: boolean): void => {
    const key = this.key(flag, pathKey);
    if (this.values.get(key) === value) {
      return;
    }
    this.values.set(key, value);
    this.versions.set(key, (this.versions.get(key) ?? 0) + 1);
    this.bump();
  };

  /**
   * Удаляет флаги узла по пути и всех его потомков — поддерево
   * удалено или переименовано и старые ключи больше не актуальны.
   * Пустой путь очищает всё хранилище (дерево заменено целиком).
   */
  prune = (path: StorePath): void => {
    if (path.length === 0) {
      this.values.clear();
      this.versions.clear();
      this.bump();
      return;
    }

    // JSON-префикс пути: потомок пути P сериализуется как P без
    // закрывающей ']' плюс ',' — других совпадений быть не может.
    const json = namespaceKey(path);
    const prefix = `${json.slice(0, -1)},`;
    const exact = json;
    const remove: string[] = [];
    for (const key of this.values.keys()) {
      const pathPart = key.slice(key.indexOf('\u0000') + 1);
      if (pathPart === exact || pathPart.startsWith(prefix)) {
        remove.push(key);
      }
    }
    if (remove.length === 0) {
      return;
    }
    for (const key of remove) {
      this.values.delete(key);
      this.versions.delete(key);
    }
    this.bump();
  };

  private key = (flag: StoreFlag, pathKey: string): string =>
    `${flag}\u0000${pathKey}`;

  private bump = (): void => {
    this.globalVersion += 1;
    for (const listener of [...this.listeners]) {
      listener();
    }
  };
}

/**
 * Подписка компонента на одно отображение узла:
 * значение перечитывается только при смене версии соответствующего
 * пути (useSyncExternalStore).
 */
export const useStoreFlag = (
  store: ViewerStore,
  flag: StoreFlag,
  pathKey: string,
  defaultValue: boolean,
): boolean => {
  useSyncExternalStore(store.subscribe, () => store.getVersion(flag, pathKey));
  return store.get(flag, pathKey, defaultValue);
};
