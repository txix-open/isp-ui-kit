import { memo, useMemo, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { DEPTH_INCREMENT, SINGLE_INDENT } from '../constants';
import { useViewer } from '../context';
import { useStoreFlag } from '../state/ViewerStore';
import type { PathSegment } from '../utils/immutable';
import {
  namespaceKey,
  toPublicNamespace,
  toPublicName,
} from '../utils/namespace';
import type { ParsedInput } from '../utils/parseInput';
import { parseInput } from '../utils/parseInput';
import { stringifyVariable } from '../utils/stringifyVariable';
import { toType } from '../utils/valueType';
import { ArrayGroup } from './ArrayGroup';
import { Edit } from './icons';
import { ObjectName } from './ObjectName';
import { ValueEditor } from './ValueEditor';
import { CollapsedIcon, ExpandedIcon } from './ToggleIcons';
import { VariableMeta } from './VariableMeta';
import { VariableRow } from './VariableRow';

interface NodeProps {
  src: unknown;
  name: string | number | false | null;
  /** Абсолютное namespace: корневое имя + путь от корня. */
  namespace: ReadonlyArray<string | number | null>;
  depth: number;
  parentType?: 'object' | 'array' | 'array_group';
  jsvRoot?: boolean;
  /** 'array' у узлов-массивов; у объектов — undefined (legacy-поведение). */
  type?: 'array';
  indexOffset?: number;
  /**
   * Перекрывает ctx.collapsed только для этого узла. Внутренние узлы
   * ArrayGroup получают {false} — legacy жёстко передавал
   * collapsed={false} групповому объекту.
   */
  collapsedOverride?: boolean | number;
}

/**
 * Узел-объект или массив: скобки, содержимое, редактор значения
 * (1:1 порт legacy DataTypes/Object.jsx).
 */
const NodeBase = (props: NodeProps) => {
  const {
    src,
    name,
    namespace,
    depth,
    parentType,
    jsvRoot,
    type,
    indexOffset,
  } = props;
  const ctx = useViewer();
  const { style, store, actions, iconStyle } = ctx;

  const [editMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [parsedInput, setParsedInput] = useState<ParsedInput>({
    type: false,
    value: null,
  });

  // Путь узла от корня src (без корневого имени)
  const nodePath = useMemo(
    () => namespace.slice(1) as PathSegment[],
    [namespace],
  );
  const objectType: 'object' | 'array' = type === 'array' ? 'array' : 'object';

  const size = useMemo(() => Object.keys((src as object) ?? {}).length, [src]);

  // JSON-ключ namespace считается один раз: store, ключи React-узлов
  // и ObjectName переиспользуют одну и ту же строку.
  const namespaceKeyStr = useMemo(() => namespaceKey(namespace), [namespace]);

  // Внутренние узлы групп не зависят от collapsed зрителя (legacy).
  const collapsedProp =
    props.collapsedOverride !== undefined
      ? props.collapsedOverride
      : ctx.collapsed;

  const shouldCollapseOk =
    ctx.shouldCollapse === false ||
    ctx.shouldCollapse({
      name: toPublicName(name),
      src: (src as object) ?? {},
      type: toType(src) === 'array' ? 'array' : 'object',
      namespace: toPublicNamespace(ctx.rootName, nodePath),
    }) === false;

  // legacy: (collapsed === false || (collapsed !== true && collapsed > depth))
  const isNumericCollapsed = typeof collapsedProp === 'number';
  const defaultExpanded =
    (collapsedProp === false ||
      (isNumericCollapsed && collapsedProp > depth)) &&
    shouldCollapseOk &&
    size !== 0;

  // Поиск (prop search): сохранённый флаг приоритетнее (useStoreFlag),
  // дефолт переопределяет попадание в индекс — то же правило, что в
  // flattenTree (виртуализованный режим).
  const searchAuto = ctx.searchExpandKeys?.has(namespaceKeyStr) ?? false;

  const expanded = useStoreFlag(
    store,
    'expanded',
    namespaceKeyStr,
    defaultExpanded || searchAuto,
  );

  const toggleCollapsed = () => {
    store.set('expanded', namespaceKeyStr, !expanded);
  };

  // --- редактор значения узла ---

  const prepopInput = () => {
    const stringifiedValue = stringifyVariable(src);
    setEditMode(true);
    setEditValue(stringifiedValue);
    setParsedInput(parseInput(stringifiedValue));
  };

  const submitEdit = (submitDetected: boolean) => {
    const newValue =
      submitDetected && parsedInput.type ? parsedInput.value : editValue;
    setEditMode(false);
    // existing_value — исходное поддерево (legacy передавал текст редактора)
    actions.editBranch(nodePath, newValue, src);
  };

  const getEditIcon = () => (
    <div
      className="click-to-edit"
      style={{ verticalAlign: 'top' }}
      title="Edit Value"
    >
      <Edit
        className="click-to-edit-icon"
        {...style('editVarIcon')}
        onClick={() => {
          prepopInput();
        }}
      />
    </div>
  );

  const getEditKeyIcon = () => {
    // переименование ключей доступно только с onEdit (legacy падал
    // без него) и скрыто на корневом узле (legacy порождал
    // самоссылку)
    if (ctx.editKeys === false || ctx.onEdit === false) {
      return null;
    }
    if (parentType === 'array') {
      return null;
    }
    if (namespace.length <= 1) {
      return null;
    }
    const oldKey = toPublicName(name);
    if (oldKey === null) {
      return null;
    }

    return (
      <div
        className="click-to-edit"
        style={{ verticalAlign: 'top' }}
        title="Edit Key"
      >
        <Edit
          className="click-to-edit-icon"
          {...style('editVarIcon')}
          onClick={(e) => {
            e.stopPropagation();
            actions.requestRenameKey(nodePath.slice(0, -1), oldKey, src);
          }}
        />
      </div>
    );
  };

  // --- отрисовка ---

  const getObjectMetaData = () => (
    <VariableMeta
      size={size}
      src={src}
      nodePath={nodePath}
      isEdit={editMode}
      renderIcon={getEditIcon()}
      hideActions={parentType === 'array_group'}
    />
  );

  const getBraceStart = () => {
    if (parentType === 'array_group') {
      return (
        <span>
          <span {...style('brace')}>{objectType === 'array' ? '[' : '{'}</span>
          {expanded ? getObjectMetaData() : null}
        </span>
      );
    }

    const IconComponent = expanded ? ExpandedIcon : CollapsedIcon;

    return (
      <span>
        <span
          onClick={(e) => {
            e.stopPropagation();
            toggleCollapsed();
          }}
          {...style('brace-row')}
        >
          {getEditKeyIcon()}
          <div className="icon-container" {...style('icon-container')}>
            <IconComponent iconStyle={iconStyle} />
          </div>
          <ObjectName
            name={name}
            parentType={parentType}
            jsvRoot={jsvRoot}
            keySuffix={namespaceKeyStr}
          />
          <span {...style('brace')}>{objectType === 'array' ? '[' : '{'}</span>
        </span>
        {expanded ? getObjectMetaData() : null}
      </span>
    );
  };

  const getEllipsis = () => {
    if (size === 0) {
      // у пустого узла не рисуем многоточие
      return null;
    }
    return (
      <div
        {...style('ellipsis')}
        className="node-ellipsis"
        onClick={toggleCollapsed}
      >
        ...
      </div>
    );
  };

  /**
   * Список дочерних элементов строится один раз на изменение
   * src/настроек: identity дочерних пропсов (включая namespace-массивы
   * и parentPath) стабильна, поэтому React.memo детей срабатывает.
   */
  const elements = useMemo(() => {
    const variables = (src as Record<string, unknown>) ?? {};
    let keys = Object.keys(variables);
    if (ctx.sortKeys && objectType !== 'array') {
      keys = [...keys].sort();
    }
    // legacy сортировал массивы на месте (мутируя src) — исправлено

    const list: ReactNode[] = [];

    keys.forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(variables, key)) {
        return;
      }

      const variableName: string | number =
        parentType === 'array_group' && indexOffset
          ? Number(key) + indexOffset
          : key;
      const value = variables[key];
      const variableType = toType(value);

      if (variableType === 'object') {
        list.push(
          <Node
            key={String(variableName)}
            depth={depth + DEPTH_INCREMENT}
            name={variableName}
            src={value}
            namespace={[...namespace, variableName]}
            parentType={objectType}
          />,
        );
      } else if (variableType === 'array') {
        const useGroup =
          ctx.groupArraysAfterLength !== 0 &&
          (value as unknown[]).length > ctx.groupArraysAfterLength;

        list.push(
          useGroup ? (
            <ArrayGroup
              key={String(variableName)}
              depth={depth + DEPTH_INCREMENT}
              name={variableName}
              src={value as unknown[]}
              namespace={[...namespace, variableName]}
              type="array"
              parentType={objectType}
            />
          ) : (
            <Node
              key={String(variableName)}
              depth={depth + DEPTH_INCREMENT}
              name={variableName}
              src={value}
              namespace={[...namespace, variableName]}
              type="array"
              parentType={objectType}
            />
          ),
        );
      } else {
        list.push(
          <VariableRow
            key={`${variableName}_${namespaceKeyStr}`}
            name={String(variableName)}
            value={value}
            type={variableType}
            parentType={objectType === 'array' ? 'array' : undefined}
            parentPath={nodePath}
            namespaceKeyStr={namespaceKeyStr}
          />,
        );
      }
    });

    return list;
  }, [
    src,
    ctx.sortKeys,
    ctx.groupArraysAfterLength,
    nodePath,
    namespace,
    objectType,
    parentType,
    indexOffset,
    namespaceKeyStr,
  ]);

  const getEditInput = () => (
    <ValueEditor
      value={editValue}
      parsedInput={parsedInput}
      nodePath={nodePath}
      mainCheckDetected
      onChange={(inputValue) => {
        setEditValue(inputValue);
        setParsedInput(parseInput(inputValue));
      }}
      onCommit={submitEdit}
      onCancel={() => {
        setEditMode(false);
      }}
    />
  );

  const styles: CSSProperties = {};
  if (!jsvRoot && parentType !== 'array_group') {
    styles.paddingLeft = ctx.indentWidth * SINGLE_INDENT;
  } else if (parentType === 'array_group') {
    styles.borderLeft = 0;
    styles.display = 'inline';
  }

  return (
    <div
      className="object-key-val"
      {...style(jsvRoot ? 'jsv-root' : 'objectKeyVal', styles)}
    >
      {getBraceStart()}
      {expanded ? (
        <div className="pushed-content object-container">
          <div className="object-content" {...style('pushed-content')}>
            {editMode ? getEditInput() : elements}
          </div>
        </div>
      ) : (
        getEllipsis()
      )}
      <span className="brace-row">
        <span
          style={{
            ...style('brace').style,
            paddingLeft: expanded ? '3px' : '0px',
          }}
        >
          {objectType === 'array' ? ']' : '}'}
        </span>
        {expanded ? null : getObjectMetaData()}
      </span>
    </div>
  );
};

/** Сравнение namespace-массивов по содержимому (identity не стабильна). */
const sameSegments = (
  a: ReadonlyArray<string | number | null>,
  b: ReadonlyArray<string | number | null>,
): boolean => {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
};

/**
 * мемоизация: toggle флага одного узла не перерисовывает соседей,
 * правка значения — только ветку с изменённой ссылкой src.
 */
export const Node = memo(
  NodeBase,
  (prev, next) =>
    prev.src === next.src &&
    prev.name === next.name &&
    sameSegments(prev.namespace, next.namespace) &&
    prev.depth === next.depth &&
    prev.parentType === next.parentType &&
    prev.jsvRoot === next.jsvRoot &&
    prev.type === next.type &&
    prev.indexOffset === next.indexOffset &&
    prev.collapsedOverride === next.collapsedOverride,
);
