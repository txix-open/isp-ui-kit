import { useCallback, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { KeyModal } from './components/KeyModal';
import { Tree } from './components/Tree';
import { ValidationFailure } from './components/ValidationFailure';
import { VirtualTree } from './virtual/VirtualTree';
import {
  ViewerContext,
  type KeyRequest,
  type ThemedStyleFn,
  type ViewerActions,
  type ViewerContextValue,
} from './context';
import type {
  InteractionCallback,
  InteractionProps,
  ReactJsonViewProps,
  Theme,
} from './json-viewer.type';
import { ViewerStore } from './state/ViewerStore';
import { getThemedStyle } from './themes/getStyle';
import { buildSearchIndex } from './utils/search';
import {
  getAtPath,
  removeAtPath,
  renameKeyAtPath,
  setAtPath,
  type JsonPath,
  type PathSegment,
} from './utils/immutable';
import { toPublicName, toPublicNamespace } from './utils/namespace';
import { isTheme, toType } from './utils/valueType';

// некоторые стилевые поведения требуют CSS
import './json-viewer.scss';

const DEFAULT_VALIDATION_MESSAGE = 'Validation Error';

interface ValidatedState {
  src: unknown;
  name: string | number | false | null;
  theme: Theme | false;
}

/**
 * Проверка проповсов (1:1 порт legacy validateState): некорректная
 * тема объекта заменяется на "rjv-default", не-объектный src —
 * на служебное сообщение с именем "ERROR".
 */
const validateState = (
  srcProp: unknown,
  nameProp: string | number | false | null | undefined,
  themeProp: Theme | false | undefined,
): ValidatedState => {
  let src: unknown = srcProp === undefined ? {} : srcProp;
  let name: string | number | false | null =
    nameProp === undefined ? 'root' : nameProp;
  let theme: Theme | false =
    themeProp === undefined ? 'rjv-default' : themeProp;

  if (typeof theme === 'object' && theme !== null && !isTheme(theme)) {
    console.error(
      'react-json-view error:',
      'theme prop must be a theme name or valid base-16 theme object.',
      'defaulting to "rjv-default" theme',
    );
    theme = 'rjv-default';
  }

  if (toType(src) !== 'object' && toType(src) !== 'array') {
    console.error(
      'react-json-view error:',
      'src property must be a valid json object',
    );
    name = 'ERROR';
    src = { message: 'src property must be a valid json object' };
  }

  return { src, name, theme };
};

/**
 * Современная реализация компонента ReactJsonView (function
 * component + hooks). Публичный API и внешнее оформление
 * совпадают с legacy-версией (ReactJsonView/).
 */
const JsonViewer = (props: ReactJsonViewProps) => {
  const validated = useMemo(
    () => validateState(props.src, props.name, props.theme),
    [props.src, props.name, props.theme],
  );

  // src, закоммиченные внутренними правками (legacy state.src)
  const [committedSrc, setCommittedSrc] = useState(validated.src);
  const prevSrc = useRef(props.src);
  if (prevSrc.current !== props.src) {
    // внешний src изменился — синхронизируем (legacy
    // getDerivedStateFromProps)
    prevSrc.current = props.src;
    setCommittedSrc(validated.src);
  }

  const [validationFailure, setValidationFailure] = useState(false);
  const [keyRequest, setKeyRequest] = useState<KeyRequest | null>(null);

  const storeRef = useRef<ViewerStore | null>(null);
  if (storeRef.current === null) {
    storeRef.current = new ViewerStore();
  }
  const store = storeRef.current;

  const style: ThemedStyleFn = useMemo(
    () => getThemedStyle(validated.theme),
    [validated.theme],
  );

  const rootName = validated.name;
  const rootNamePublic = toPublicName(rootName);
  const rootSegment = rootName === false || rootName === null ? null : rootName;
  const virtualMode = props.maxHeight !== undefined;

  // Поиск (prop search): набор предков совпавших узлов для
  // авто-раскрытия; пересчитывается по коммиченным данным.
  const searchExpandKeys = useMemo(
    () =>
      props.search
        ? buildSearchIndex(committedSrc, rootSegment, props.search)
        : null,
    [committedSrc, rootSegment, props.search],
  );

  const onEdit: InteractionCallback | false = props.onEdit ?? false;
  const onAdd: InteractionCallback | false = props.onAdd ?? false;
  const onDelete: InteractionCallback | false = props.onDelete ?? false;

  /**
   * Применение изменения: вычисление нового дерева → колбэк →
   * false от колбэка означает отклонение (баннер валидации,
   * дерево не меняется) — поведение legacy.
   */
  const commit = useCallback(
    (
      callback: InteractionCallback | false,
      updated: unknown,
      payload: Omit<InteractionProps, 'updated_src' | 'existing_src'>,
    ) => {
      const fullPayload: InteractionProps = {
        ...payload,
        updated_src: updated as object,
        existing_src: committedSrc as object,
      };
      const result =
        typeof callback === 'function' ? callback(fullPayload) : undefined;

      if (result === false) {
        setValidationFailure(true);
      } else {
        setCommittedSrc(updated);
      }
    },
    [committedSrc],
  );

  // identity actions стабильна до изменения src/колбэков: контекст
  // (и подписчики useViewer) не перерисовывается на каждом рендере зрителя.
  const actions: ViewerActions = useMemo(
    () => ({
      editVariable: (
        parentPath: JsonPath,
        key: PathSegment,
        newValue: unknown,
        existingValue: unknown,
      ) => {
        const updated = setAtPath(committedSrc, [...parentPath, key], newValue);
        commit(onEdit, updated, {
          name: String(key),
          namespace: toPublicNamespace(rootSegment, parentPath),
          existing_value: existingValue as InteractionProps['existing_value'],
          new_value: newValue as InteractionProps['new_value'],
        });
      },
      editBranch: (
        nodePath: JsonPath,
        newValue: unknown,
        existingValue: unknown,
      ) => {
        const updated = setAtPath(committedSrc, nodePath, newValue);
        const isRoot = nodePath.length === 0;
        commit(onEdit, updated, {
          name: isRoot
            ? toPublicName(rootName)
            : toPublicName(nodePath[nodePath.length - 1]),
          namespace: toPublicNamespace(rootSegment, nodePath),
          existing_value: existingValue as InteractionProps['existing_value'],
          new_value: newValue as InteractionProps['new_value'],
        });
      },
      removeVariable: (
        parentPath: JsonPath,
        key: PathSegment,
        existingValue: unknown,
      ) => {
        const nodePath: JsonPath = [...parentPath, key];
        const updated = removeAtPath(committedSrc, nodePath);
        // флаги удалённого поддерева больше не актуальны
        store.prune([rootSegment, ...nodePath]);
        commit(onDelete, updated, {
          name: String(key),
          namespace: toPublicNamespace(rootSegment, parentPath),
          existing_value: existingValue as InteractionProps['existing_value'],
        });
      },
      appendToArray: (nodePath: JsonPath, existingValue: unknown) => {
        const isRoot = nodePath.length === 0;
        const current = isRoot
          ? committedSrc
          : getAtPath(committedSrc, nodePath);
        const newArray = [...(current as unknown[]), null];
        const updated = isRoot
          ? newArray
          : setAtPath(committedSrc, nodePath, newArray);
        commit(onAdd, updated, {
          name: isRoot ? null : toPublicName(nodePath[nodePath.length - 1]),
          namespace: isRoot
            ? []
            : toPublicNamespace(rootSegment, nodePath.slice(0, -1)),
          existing_value: existingValue as InteractionProps['existing_value'],
          new_value: newArray as InteractionProps['new_value'],
        });
      },
      requestAddKey: (nodePath: JsonPath) => {
        setKeyRequest({ mode: 'add', nodePath });
      },
      requestRenameKey: (
        parentPath: JsonPath,
        oldKey: string,
        existingValue: unknown,
      ) => {
        setKeyRequest({ mode: 'edit', parentPath, oldKey, existingValue });
      },
      reset: () => {
        setKeyRequest(null);
        setValidationFailure(false);
      },
    }),
    [
      commit,
      committedSrc,
      onEdit,
      onAdd,
      onDelete,
      store,
      rootSegment,
      rootName,
    ],
  );

  // --- модалка ключей ---

  const closeKeyModal = () => {
    setKeyRequest(null);
    setValidationFailure(false);
  };

  const submitAddKey = (input: string) => {
    if (keyRequest === null || keyRequest.mode !== 'add') {
      return;
    }
    const { nodePath } = keyRequest;
    const isRoot = nodePath.length === 0;
    const node = (isRoot ? committedSrc : getAtPath(committedSrc, nodePath)) as
      | Record<string, unknown>
      | null
      | undefined;
    const nodeObject = node !== null && typeof node === 'object' ? node : {};
    const nodeValue = {
      ...nodeObject,
      [input]: props.defaultValue ?? null,
    };
    // в legacy добавление в корень портилось (первый ключ = null) —
    // исправлено: новый ключ ставится в существующий корень
    const updated = isRoot
      ? nodeValue
      : setAtPath(committedSrc, nodePath, nodeValue);

    commit(onAdd, updated, {
      name: isRoot ? null : toPublicName(nodePath[nodePath.length - 1]),
      namespace: isRoot
        ? []
        : toPublicNamespace(rootSegment, nodePath.slice(0, -1)),
      existing_value: nodeObject as InteractionProps['existing_value'],
      new_value: (isRoot
        ? (props.defaultValue ?? null)
        : nodeValue) as InteractionProps['new_value'],
    });
    setKeyRequest(null);
  };

  const submitRenameKey = (input: string) => {
    if (keyRequest === null || keyRequest.mode !== 'edit') {
      return;
    }
    const { parentPath, oldKey, existingValue } = keyRequest;
    const updated = renameKeyAtPath(
      committedSrc,
      [...parentPath, oldKey],
      input,
    );
    // поддерево старого ключа удалено — его флаги не актуальны
    store.prune([rootSegment, ...parentPath, oldKey]);
    commit(onEdit, updated, {
      name: oldKey,
      namespace: toPublicNamespace(rootSegment, parentPath),
      existing_value: existingValue as InteractionProps['existing_value'],
      new_value: existingValue as InteractionProps['new_value'],
    });
    setKeyRequest(null);
  };

  let keyModal: ReactNode = null;
  if (keyRequest !== null) {
    let initialInput = '';
    let isValid: (input: string) => boolean;
    let onSubmit: (input: string) => void;
    let modalKey: string;

    if (keyRequest.mode === 'add') {
      const node = (
        keyRequest.nodePath.length === 0
          ? committedSrc
          : getAtPath(committedSrc, keyRequest.nodePath)
      ) as Record<string, unknown> | null | undefined;
      const existingKeys =
        node !== null && typeof node === 'object' ? Object.keys(node) : [];
      isValid = (input) =>
        input !== '' && input !== null && !existingKeys.includes(input);
      onSubmit = submitAddKey;
      modalKey = `add-${JSON.stringify(keyRequest.nodePath)}`;
    } else {
      initialInput = keyRequest.oldKey;
      isValid = (input) => input !== '';
      onSubmit = submitRenameKey;
      modalKey = `edit-${JSON.stringify(keyRequest.parentPath)}-${keyRequest.oldKey}`;
    }

    keyModal = (
      <KeyModal
        key={modalKey}
        initialInput={initialInput}
        isValid={isValid}
        onSubmit={onSubmit}
        onClose={closeKeyModal}
      />
    );
  }

  // identity контекста стабильна до изменения props/данных —
  // подписчики useViewer не перерисовываются «вхолостую».
  const contextValue: ViewerContextValue = useMemo(
    () => ({
      rootName: rootNamePublic,
      store,
      style,
      virtual: virtualMode,
      searchExpandKeys,
      search: props.search ?? '',
      collapsed: props.collapsed ?? false,
      collapseStringsAfterLength: props.collapseStringsAfterLength ?? false,
      shouldCollapse: props.shouldCollapse ?? false,
      sortKeys: props.sortKeys ?? false,
      editKeys: props.editKeys ?? true,
      groupArraysAfterLength: props.groupArraysAfterLength ?? 1000,
      indentWidth: props.indentWidth ?? 4,
      enableClipboard: props.enableClipboard ?? true,
      displayObjectSize: props.displayObjectSize ?? true,
      displayDataTypes: props.displayDataTypes ?? true,
      iconStyle: props.iconStyle ?? 'triangle',
      defaultValue: props.defaultValue ?? null,
      onEdit: props.onEdit ?? false,
      onAdd: props.onAdd ?? false,
      onDelete: props.onDelete ?? false,
      onSelect: props.onSelect ?? false,
      actions,
    }),
    [
      rootNamePublic,
      store,
      style,
      virtualMode,
      searchExpandKeys,
      props.search,
      props.collapsed,
      props.collapseStringsAfterLength,
      props.shouldCollapse,
      props.sortKeys,
      props.editKeys,
      props.groupArraysAfterLength,
      props.indentWidth,
      props.enableClipboard,
      props.displayObjectSize,
      props.displayDataTypes,
      props.iconStyle,
      props.defaultValue,
      props.onEdit,
      props.onAdd,
      props.onDelete,
      props.onSelect,
      actions,
    ],
  );

  return (
    <ViewerContext.Provider value={contextValue}>
      <div
        className={`react-json-view${virtualMode ? ' rjv-virtual' : ''}`}
        style={{ ...style('app-container').style, ...props.style }}
      >
        <ValidationFailure
          active={validationFailure}
          message={props.validationMessage ?? DEFAULT_VALIDATION_MESSAGE}
        />
        {props.maxHeight !== undefined ? (
          <VirtualTree
            src={committedSrc}
            rootName={rootName}
            maxHeight={props.maxHeight}
          />
        ) : (
          <Tree src={committedSrc} rootName={rootName} />
        )}
        {keyModal}
      </div>
    </ViewerContext.Provider>
  );
};

export default JsonViewer;
