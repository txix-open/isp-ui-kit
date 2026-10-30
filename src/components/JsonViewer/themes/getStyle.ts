import type { CSSProperties } from 'react';
import {
  createStyling,
  type Base16Theme,
  type Styling,
  type StylingConfig,
  type StylingFunction,
  type StylingValueFunction,
  type Theme as LibraryTheme,
} from 'react-base16-styling';
import type { TextareaAutosizeProps } from 'react-textarea-autosize';

import type { Theme } from '../json-viewer.type';
import { rjvDefault, rjvGrey } from './rjvThemes';
import { constants } from './styleConstants';

/**
 * Стили с псевдоклассами (legacy-карта содержит ':hover' — в рантайме React
 * их игнорирует, как и в legacy-компоненте).
 */
type PseudoStyles = CSSProperties & {
  [K in `:${string}`]?: CSSProperties;
};

const colorMap = (theme: Base16Theme) => ({
  backgroundColor: theme.base00,
  ellipsisColor: theme.base09,
  braceColor: theme.base07,
  expandedIcon: theme.base0D,
  collapsedIcon: theme.base0E,
  keyColor: theme.base07,
  arrayKeyColor: theme.base0C,
  objectSize: theme.base04,
  copyToClipboard: theme.base0F,
  copyToClipboardCheck: theme.base0D,
  objectBorder: theme.base02,
  dataTypes: {
    boolean: theme.base0E,
    date: theme.base0D,
    float: theme.base0B,
    function: theme.base0D,
    integer: theme.base0F,
    string: theme.base09,
    nan: theme.base08,
    null: theme.base0A,
    undefined: theme.base05,
    regexp: theme.base0A,
    background: theme.base02,
  },
  editVariable: {
    editIcon: theme.base0E,
    cancelIcon: theme.base09,
    removeIcon: theme.base09,
    addIcon: theme.base0E,
    checkIcon: theme.base0E,
    background: theme.base01,
    color: theme.base0A,
    border: theme.base07,
  },
  addKeyModal: {
    background: theme.base05,
    border: theme.base04,
    color: theme.base0A,
    labelColor: theme.base01,
  },
  validationFailure: {
    background: theme.base09,
    iconColor: theme.base01,
    fontColor: theme.base01,
  },
});

/**
 * react-textarea-autosize v8 не принимает `minHeight`/`maxHeight` в `style`
 * (бросает исключение при рендере: «Please use minRows/maxRows»), а тип
 * пропа `style` исключает эти ключи.
 * Legacy-запись `edit-input` содержит `minHeight`, поэтому в legacy при
 * переходе в режим редактирования на v8 компонент тоже падал
 * (латентный баг). Убираем эти ключи, а саму высоту задаём пропом
 * `minRows` (намерение legacy — однострочное поле).
 */
export const EDIT_INPUT_MIN_ROWS = 1;

export type TextareaStyle = NonNullable<TextareaAutosizeProps['style']>;

export const toTextareaStyle = (s?: CSSProperties): TextareaStyle => {
  const copy: CSSProperties = s ? { ...s } : {};
  delete copy.minHeight;
  delete copy.maxHeight;
  // Ключи minHeight/maxHeight удалены в рантайме — каст безопасен.
  return copy as TextareaStyle;
};

/**
 * Полная карта имён стилей (1:1 порт legacy getStyle.js).
 * Функции objectKeyVal/variableValue принимают дополнительный стиль
 * от вызывающего компонента (например, paddingLeft).
 */
const getDefaultThemeStyling = (base16: Base16Theme): StylingConfig => {
  const colors = colorMap(base16);

  const objectKeyVal: StylingValueFunction = (_styling, variableStyleArg) => {
    const variable_style = (variableStyleArg ?? {}) as {
      paddingLeft?: number;
    } & Record<string, unknown>;

    return {
      style: {
        paddingTop: constants.keyValPaddingTop,
        paddingRight: constants.keyValPaddingRight,
        paddingBottom: constants.keyValPaddingBottom,
        borderLeft: `${constants.keyValBorderLeft} ${colors.objectBorder}`,
        // legacy: без paddingLeft в variable_style здесь получается 'NaNpx'
        // (браузер игнорирует) — поведение сохранено 1:1.
        ':hover': {
          paddingLeft: `${(variable_style.paddingLeft as number) - 1}px`,
          borderLeft: `${constants.keyValBorderHover} ${colors.objectBorder}`,
        },
        ...variable_style,
      } as PseudoStyles,
    };
  };

  const variableValue: StylingValueFunction = (_styling, variableStyleArg) => {
    const variable_style = (variableStyleArg ?? {}) as Record<string, unknown>;

    return {
      style: {
        display: 'inline-block',
        paddingRight: constants.variableValuePaddingRight,
        position: 'relative',
        ...variable_style,
      },
    };
  };

  return {
    'app-container': {
      fontFamily: constants.globalFontFamily,
      cursor: constants.globalCursor,
      backgroundColor: colors.backgroundColor,
      position: 'relative',
    },
    ellipsis: {
      display: 'inline-block',
      color: colors.ellipsisColor,
      fontSize: constants.ellipsisFontSize,
      lineHeight: constants.ellipsisLineHeight,
      cursor: constants.ellipsisCursor,
    },
    'brace-row': {
      display: 'inline-block',
      cursor: 'pointer',
    },
    brace: {
      display: 'inline-block',
      cursor: constants.braceCursor,
      fontWeight: constants.braceFontWeight,
      color: colors.braceColor,
    },
    'expanded-icon': {
      color: colors.expandedIcon,
    },
    'collapsed-icon': {
      color: colors.collapsedIcon,
    },
    colon: {
      display: 'inline-block',
      margin: constants.keyMargin,
      color: colors.keyColor,
      verticalAlign: 'top',
    },
    objectKeyVal,
    // В legacy constants.keyValPadding отсутствует (undefined) — порт 1:1.
    'object-key-val-no-border': {
      padding: undefined,
    },
    'pushed-content': {
      marginLeft: constants.pushedContentMarginLeft,
    },
    variableValue,
    'object-name': {
      display: 'inline-block',
      color: colors.keyColor,
      letterSpacing: constants.keyLetterSpacing,
      fontStyle: constants.keyFontStyle,
      verticalAlign: constants.keyVerticalAlign,
      opacity: constants.keyOpacity,
      ':hover': {
        opacity: constants.keyOpacityHover,
      },
    } as PseudoStyles,
    'array-key': {
      display: 'inline-block',
      color: colors.arrayKeyColor,
      letterSpacing: constants.keyLetterSpacing,
      fontStyle: constants.keyFontStyle,
      verticalAlign: constants.keyVerticalAlign,
      opacity: constants.keyOpacity,
      ':hover': {
        opacity: constants.keyOpacityHover,
      },
    } as PseudoStyles,
    'object-size': {
      color: colors.objectSize,
      borderRadius: constants.objectSizeBorderRadius,
      fontStyle: constants.objectSizeFontStyle,
      margin: constants.objectSizeMargin,
      cursor: 'default',
    },
    'data-type-label': {
      fontSize: constants.dataTypeFontSize,
      marginRight: constants.dataTypeMarginRight,
      opacity: constants.datatypeOpacity,
    },
    boolean: {
      display: 'inline-block',
      color: colors.dataTypes.boolean,
    },
    date: {
      display: 'inline-block',
      color: colors.dataTypes.date,
    },
    'date-value': {
      marginLeft: constants.dateValueMarginLeft,
    },
    float: {
      display: 'inline-block',
      color: colors.dataTypes.float,
    },
    function: {
      display: 'inline-block',
      color: colors.dataTypes.function,
      cursor: 'pointer',
      whiteSpace: 'pre-line',
    },
    'function-value': {
      fontStyle: 'italic',
    },
    integer: {
      display: 'inline-block',
      color: colors.dataTypes.integer,
    },
    string: {
      display: 'inline-block',
      color: colors.dataTypes.string,
    },
    nan: {
      display: 'inline-block',
      color: colors.dataTypes.nan,
      fontSize: constants.nanFontSize,
      fontWeight: constants.nanFontWeight,
      backgroundColor: colors.dataTypes.background,
      padding: constants.nanPadding,
      borderRadius: constants.nanBorderRadius,
    },
    null: {
      display: 'inline-block',
      color: colors.dataTypes.null,
      fontSize: constants.nullFontSize,
      fontWeight: constants.nullFontWeight,
      backgroundColor: colors.dataTypes.background,
      padding: constants.nullPadding,
      borderRadius: constants.nullBorderRadius,
    },
    undefined: {
      display: 'inline-block',
      color: colors.dataTypes.undefined,
      fontSize: constants.undefinedFontSize,
      fontWeight: constants.undefinedFontWeight,
      padding: constants.undefinedPadding,
      borderRadius: constants.undefinedBorderRadius,
      backgroundColor: colors.dataTypes.background,
    },
    regexp: {
      display: 'inline-block',
      color: colors.dataTypes.regexp,
    },
    'copy-to-clipboard': {
      cursor: constants.clipboardCursor,
    },
    'copy-icon': {
      color: colors.copyToClipboard,
      fontSize: constants.iconFontSize,
      marginRight: constants.iconMarginRight,
      verticalAlign: 'top',
    },
    'copy-icon-copied': {
      color: colors.copyToClipboardCheck,
      marginLeft: constants.clipboardCheckMarginLeft,
    },
    'array-group-meta-data': {
      display: 'inline-block',
      padding: constants.arrayGroupMetaPadding,
    },
    'object-meta-data': {
      display: 'inline-block',
      padding: constants.metaDataPadding,
    },
    'icon-container': {
      display: 'inline-block',
      width: constants.iconContainerWidth,
    },
    tooltip: {
      padding: constants.tooltipPadding,
    },
    removeVarIcon: {
      verticalAlign: 'top',
      display: 'inline-block',
      color: colors.editVariable.removeIcon,
      cursor: constants.iconCursor,
      fontSize: constants.iconFontSize,
      marginRight: constants.iconMarginRight,
    },
    addVarIcon: {
      verticalAlign: 'top',
      display: 'inline-block',
      color: colors.editVariable.addIcon,
      cursor: constants.iconCursor,
      fontSize: constants.iconFontSize,
      marginRight: constants.iconMarginRight,
    },
    editVarIcon: {
      verticalAlign: 'top',
      display: 'inline-block',
      color: colors.editVariable.editIcon,
      cursor: constants.iconCursor,
      fontSize: constants.iconFontSize,
      marginRight: constants.iconMarginRight,
    },
    'edit-icon-container': {
      display: 'inline-block',
      verticalAlign: 'top',
    },
    'check-icon': {
      display: 'inline-block',
      cursor: constants.iconCursor,
      color: colors.editVariable.checkIcon,
      fontSize: constants.iconFontSize,
      paddingRight: constants.iconPaddingRight,
    },
    'cancel-icon': {
      display: 'inline-block',
      cursor: constants.iconCursor,
      color: colors.editVariable.cancelIcon,
      fontSize: constants.iconFontSize,
      paddingRight: constants.iconPaddingRight,
    },
    'edit-input': {
      display: 'inline-block',
      minHeight: constants.editInputHeight,
      minWidth: constants.editInputMinWidth,
      borderRadius: constants.editInputBorderRadius,
      backgroundColor: colors.editVariable.background,
      color: colors.editVariable.color,
      padding: constants.editInputPadding,
      marginRight: constants.editInputMarginRight,
      fontFamily: constants.editInputFontFamily,
    },
    'detected-row': {
      paddingTop: constants.detectedRowPaddingTop,
    },
    'key-modal-request': {
      position: constants.addKeyCoverPosition,
      top: constants.addKeyCoverPositionPx,
      left: constants.addKeyCoverPositionPx,
      right: constants.addKeyCoverPositionPx,
      bottom: constants.addKeyCoverPositionPx,
      backgroundColor: constants.addKeyCoverBackground,
    },
    'key-modal': {
      width: constants.addKeyModalWidth,
      backgroundColor: colors.addKeyModal.background,
      marginLeft: constants.addKeyModalMargin,
      marginRight: constants.addKeyModalMargin,
      padding: constants.addKeyModalPadding,
      borderRadius: constants.addKeyModalRadius,
      marginTop: '15px',
      position: 'relative',
    },
    'key-modal-label': {
      color: colors.addKeyModal.labelColor,
      marginLeft: '2px',
      marginBottom: '5px',
      fontSize: '11px',
    },
    'key-modal-input-container': {
      overflow: 'hidden',
    },
    'key-modal-input': {
      width: '100%',
      padding: '3px 6px',
      fontFamily: 'monospace',
      border: 'none',
      boxSizing: 'border-box',
      borderRadius: '2px',
    },
    'key-modal-cancel': {
      backgroundColor: colors.editVariable.removeIcon,
      position: 'absolute',
      top: '0px',
      right: '0px',
      borderRadius: '0px 3px 0px 3px',
      cursor: 'pointer',
    },
    'key-modal-cancel-icon': {
      color: colors.addKeyModal.labelColor,
      fontSize: constants.iconFontSize,
      transform: 'rotate(45deg)',
    },
    'key-modal-submit': {
      color: colors.editVariable.addIcon,
      fontSize: constants.iconFontSize,
      position: 'absolute',
      right: '2px',
      top: '3px',
      cursor: 'pointer',
    },
    'function-ellipsis': {
      display: 'inline-block',
      color: colors.ellipsisColor,
      fontSize: constants.ellipsisFontSize,
      lineHeight: constants.ellipsisLineHeight,
      cursor: constants.ellipsisCursor,
    },
    'validation-failure': {
      float: 'right',
      padding: '3px 6px',
      borderRadius: '2px',
      cursor: 'pointer',
      color: colors.validationFailure.fontColor,
      backgroundColor: colors.validationFailure.background,
    },
    'validation-failure-label': {
      marginRight: '6px',
    },
    'validation-failure-clear': {
      position: 'relative',
      verticalAlign: 'top',
      cursor: 'pointer',
      color: colors.validationFailure.iconColor,
      fontSize: constants.iconFontSize,
      transform: 'rotate(45deg)',
    },
    // --- виртуализованный режим (prop maxHeight) ---
    // Вертикальная направляющая вложенности: 1px-линия (width задан в CSS,
    // чтобы при наведении на строку она расширялась до 2px).
    'rjv-guide': {
      position: 'absolute',
      top: 0,
      bottom: 0,
      backgroundColor: colors.objectBorder,
    },
    // Оверлей поверх строк: полный текст длинного значения или редактор.
    'rjv-overlay': {
      position: 'absolute',
      zIndex: 10,
      backgroundColor: colors.backgroundColor,
      border: `1px solid ${colors.objectBorder}`,
      borderRadius: '2px',
      overflowY: 'auto',
      padding: '4px 6px',
    },
    'rjv-overlay-text': {
      color: colors.dataTypes.string,
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-all',
      cursor: 'pointer',
    },
    // --- поиск (prop search) ---
    // Подсветка вхождений запроса в ключе/значении.
    'search-match': {
      backgroundColor: colors.dataTypes.background,
      borderRadius: '2px',
      padding: '0 1px',
    },
  };
};

const stringCache = new Map<string, StylingFunction>();
const objectCache = new WeakMap<object, StylingFunction>();

/**
 * Возвращает функцию получения стилей для заданной темы:
 * `style('objectKeyVal', { paddingLeft: 20 })` → { className?, style? }.
 *
 * Поведение совпадает с legacy: неизвестные имена тем и theme={false}/'none'
 * отрисовываются базовой (соответственно rjv-default / rjv-grey) палитрой,
 * объекты тем — своей палитрой. Функция мемоизируется по теме.
 */
export const getThemedStyle = (
  theme: Theme | false | undefined,
): ((name: string, extraStyle?: CSSProperties) => Styling) => {
  if (theme === undefined) {
    console.error('theme has not been set');
  }

  const defaultBase16: Base16Theme =
    theme === false || theme === 'none' ? rjvGrey : rjvDefault;

  const build = (): StylingFunction => {
    const themed = createStyling(getDefaultThemeStyling, {
      defaultBase16,
    })(theme as unknown as LibraryTheme | undefined);
    return themed;
  };

  if (typeof theme === 'string') {
    const cached = stringCache.get(theme);
    if (cached) {
      return cached;
    }
    const built = build();
    stringCache.set(theme, built);
    return built;
  }

  if (theme !== null && typeof theme === 'object') {
    const cached = objectCache.get(theme);
    if (cached) {
      return cached;
    }
    const built = build();
    objectCache.set(theme, built);
    return built;
  }

  // theme === false — дешёвый случай, кэшировать не нужно
  return build();
};
