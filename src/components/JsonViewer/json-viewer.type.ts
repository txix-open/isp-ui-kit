import type { CSSProperties } from 'react';

/**
 * Объект темы base-16. Поддерживаются все стандартные имена base-16 тем
 * (например, 'monokai', 'solarized'), имена с модификатором ':inverted'
 * и пользовательские объекты такого вида.
 */
export interface ThemeObject {
  base00: string;
  base01: string;
  base02: string;
  base03: string;
  base04: string;
  base05: string;
  base06: string;
  base07: string;
  base08: string;
  base09: string;
  base0A: string;
  base0B: string;
  base0C: string;
  base0D: string;
  base0E: string;
  base0F: string;
}

export type ThemeKeys =
  | 'apathy'
  | 'apathy:inverted'
  | 'ashes'
  | 'bespin'
  | 'brewer'
  | 'bright:inverted'
  | 'bright'
  | 'chalk'
  | 'codeschool'
  | 'colors'
  | 'eighties'
  | 'embers'
  | 'flat'
  | 'google'
  | 'grayscale'
  | 'grayscale:inverted'
  | 'greenscreen'
  | 'harmonic'
  | 'hopscotch'
  | 'isotope'
  | 'marrakesh'
  | 'mocha'
  | 'monokai'
  | 'ocean'
  | 'paraiso'
  | 'pop'
  | 'railscasts'
  | 'rjv-default'
  | 'shapeshifter'
  | 'shapeshifter:inverted'
  | 'solarized'
  | 'summerfruit'
  | 'summerfruit:inverted'
  | 'threezerotwofour'
  | 'tomorrow'
  | 'tube'
  | 'twilight'
  /**
   * Прочие имена base-16 тем библиотеки react-base16-styling
   * (с автдополнением перечисленных выше).
   */
  | (string & Record<never, never>);

/**
 * Имя темы, объект темы, отключённая тема (false) или псевдоним
 * "none" — во всех случаях отключённых тем применяется серая палитра.
 */
export type Theme = ThemeKeys | ThemeObject | false | 'none';

/** Значение по умолчанию для нового ключа. */
export type TypeDefaultValue = string | number | boolean | object;

export interface OnCopyProps {
  /** Исходный объект JSON-дерева. */
  src: object;
  /** Список ключей. */
  namespace: Array<string | null>;
  /** Последний ключ в массиве namespace. */
  name: string | null;
}

export interface CollapsedFieldProps {
  /** Имя записи. */
  name: string | null;
  /** Соответствующее поддерево JSON. */
  src: object;
  /** Тип src: только "array" или "object". */
  type: 'array' | 'object';
  /** Области видимости над текущей записью. */
  namespace: Array<string | null>;
}

export interface InteractionProps {
  /** Обновлённое поддерево JSON-дерева. */
  updated_src: object;
  /** Существующее поддерево JSON-дерева. */
  existing_src: object;
  /** Ключ записи, с которой совершается действие. */
  name: string | null;
  /** Список ключей. */
  namespace: Array<string | null>;
  /** Исходное значение записи, с которой совершается действие. */
  existing_value: object | string | number | boolean | null;
  /** Обновлённое значение записи, с которой совершается действие. */
  new_value?: object | string | number | boolean | null;
}

export interface OnSelectProps {
  /** Имя выбранной записи. */
  name: string | null;
  /** Значение выбранной записи. */
  value: object | string | number | boolean | null;
  /**
   * Тип значения. Для типа "number" подставляется более точный тип:
   * "float", "integer" или "nan".
   */
  type: string;
  /** Список ключей, задающих области видимости над выбранной записью. */
  namespace: Array<string | null>;
}

export type IconStyle = 'circle' | 'triangle' | 'square';

export type ShouldCollapse = false | ((field: CollapsedFieldProps) => boolean);

export type EnableClipboard = boolean | ((copy: OnCopyProps) => void);

export type InteractionCallback = (
  payload: InteractionProps,
) => false | unknown;

export interface ReactJsonViewProps {
  /**
   * Входные JSON-данные.
   *
   * Обязательно.
   */
  src: object;
  /**
   * Имя корневого узла. Используйте null или false, чтобы имени не было.
   *
   * По умолчанию: "root"
   */
  name?: string | null | false;
  /**
   * Компонент поддерживает темы base-16. По умолчанию применяется
   * пользовательская тема "rjv-default".
   *
   * По умолчанию: "rjv-default"
   */
  theme?: Theme;
  /**
   * Атрибуты стиля контейнера. Явные атрибуты стиля имеют приоритет
   * над стилями темы.
   */
  style?: CSSProperties;
  /**
   * Стиль иконок раскрытия/свёртывания: "circle", "triangle" или "square".
   *
   * По умолчанию: "triangle"
   */
  iconStyle?: IconStyle;
  /**
   * Ширина отступа для вложенных объектов.
   *
   * По умолчанию: 4
   */
  indentWidth?: number;
  /**
   * true — все узлы свёрнуты по умолчанию; целое число — сворачивать
   * на определённой глубине.
   *
   * По умолчанию: false
   */
  collapsed?: boolean | number;
  /**
   * Целое значение — строки длиннее этого предела обрезаются,
   * содержимое раскрывается по клику на значение.
   *
   * По умолчанию: false
   */
  collapseStringsAfterLength?: number | false;
  /**
   * Колбэк, определяющий, какие объекты и массивы сворачивать по умолчанию.
   *
   * По умолчанию: false
   */
  shouldCollapse?: ShouldCollapse;
  /**
   * Целое значение — массивы длиннее этого предела отображаются
   * в группах со скобочной навигацией.
   *
   * По умолчанию: 1000
   */
  groupArraysAfterLength?: number;
  /**
   * Если значение не false, объекты и массивы можно копировать в буфер
   * обмена по клику на иконку. Поддерживается колбэк копирования.
   *
   * По умолчанию: true
   */
  enableClipboard?: EnableClipboard;
  /**
   * true — объекты и массивы подписываются размером.
   *
   * По умолчанию: true
   */
  displayObjectSize?: boolean;
  /**
   * true — перед значениями выводятся метки типов данных.
   *
   * По умолчанию: true
   */
  displayDataTypes?: boolean;
  /**
   * Если передана функция, включено редактирование значений. Колбэк
   * вызывается до завершения правки; возвращение false блокирует изменение.
   *
   * По умолчанию: false
   */
  onEdit?: InteractionCallback | false;
  /**
   * Если передана функция, включено добавление. Возвращение false
   * из onAdd блокирует изменение.
   *
   * По умолчанию: false
   */
  onAdd?: InteractionCallback | false;
  /**
   * Если передана функция, включено удаление. Возвращение false
   * из onDelete блокирует изменение.
   *
   * По умолчанию: false
   */
  onDelete?: InteractionCallback | false;
  /**
   * Если передана функция, клик по значению вызывает onSelect.
   *
   * По умолчанию: false
   */
  onSelect?: ((select: OnSelectProps) => void) | false;
  /**
   * Сообщение при отказе в onEdit, onAdd или onDelete.
   *
   * По умолчанию: "Validation Error"
   */
  validationMessage?: string;
  /**
   * true — сортировать ключи объектов.
   *
   * По умолчанию: false
   */
  sortKeys?: boolean;
  /**
   * Значение по умолчанию для новых ключей.
   *
   * По умолчанию: null
   */
  defaultValue?: TypeDefaultValue | TypeDefaultValue[] | null;
  /**
   * true — можно переименовывать ключи объектов.
   *
   * По умолчанию: true
   */
  editKeys?: boolean;
  /**
   * Высота контейнера в px. Если задано, включается виртуализованный
   * режим: строки дерева рисуются только в видимой области (+оверскан),
   * что позволяет работать с очень большими данными.
   */
  maxHeight?: number;
  /**
   * Запрос поиска. Узлы, чей ключ (объектов) или примитивное значение
   * содержит запрос (без учёта регистра), автоматически раскрываются
   * (сохранённый флаг раскрытия имеет приоритет), а текст вхождений
   * подсвечивается. Работает в обоих режимах (с maxHeight и без).
   */
  search?: string;
}
