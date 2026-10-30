import { memo } from 'react';
import type { CSSProperties, ReactNode } from 'react';

import { useViewer } from '../context';
import {
  JsonBoolean,
  JsonDate,
  JsonFloat,
  JsonFunction,
  JsonInteger,
  JsonNan,
  JsonNull,
  JsonRegexp,
  JsonString,
  JsonUndefined,
} from '../components/DataTypes';
import { Edit, RemoveCircle as Remove } from '../components/icons';
import { Highlight } from '../components/Highlight';
import { ObjectName } from '../components/ObjectName';
import { CollapsedIcon, ExpandedIcon } from '../components/ToggleIcons';
import { CopyToClipboard } from '../components/CopyToClipboard';
import { VariableMeta } from '../components/VariableMeta';
import type { OnSelectProps } from '../json-viewer.type';
import {
  namespaceKey,
  toPublicName,
  toPublicSegments,
} from '../utils/namespace';
import {
  flatRowKey,
  rowGeometry,
  type BranchRowData,
  type EditorTarget,
  type FlatRow as FlatRowData,
  type ValueRowData,
} from './flatten';

interface FlatRowProps {
  row: FlatRowData;
  top: number;
  /** Ссылка на первую отрисованную строку (замер высоты). */
  firstRef?: (el: HTMLDivElement | null) => void;
  /** Открыть overlay с полным текстом значения. */
  onTextOverlay: (row: FlatRowData, text: string, top: number) => void;
  /** Открыть редактор значения (overlay). */
  onEditRequest: (target: EditorTarget, top: number, rowKey: string) => void;
}

/**
 * Одна строка плоского дерева (виртуализованный режим). Внешний вид —
 * 1:1 порт legacy-строк: те же DOM-классы, стили и действия; вложенность
 * уровней заменена позиционированием направляющих (rjv-guide).
 */
const FlatRowBase = ({
  row,
  top,
  firstRef,
  onTextOverlay,
  onEditRequest,
}: FlatRowProps) => {
  const ctx = useViewer();
  const {
    style,
    store,
    actions,
    iconStyle,
    indentWidth,
    onEdit,
    onDelete,
    onSelect,
    editKeys,
    enableClipboard,
    search,
  } = ctx;

  const geom = rowGeometry(row, indentWidth);
  const rowKey = flatRowKey(row);

  // --- значение (примитивы) ---

  const renderValue = (v: ValueRowData) => {
    switch (v.type) {
      case 'string':
        return <JsonString value={v.value} nodePath={v.valuePath} />;
      case 'integer':
        return <JsonInteger value={v.value} nodePath={v.valuePath} />;
      case 'float':
        return <JsonFloat value={v.value} nodePath={v.valuePath} />;
      case 'boolean':
        return <JsonBoolean value={v.value} nodePath={v.valuePath} />;
      case 'function':
        return <JsonFunction value={v.value} nodePath={v.valuePath} />;
      case 'null':
        return <JsonNull />;
      case 'nan':
        return <JsonNan />;
      case 'undefined':
        return <JsonUndefined />;
      case 'date':
        return <JsonDate value={v.value} nodePath={v.valuePath} />;
      case 'regexp':
        return <JsonRegexp value={v.value} nodePath={v.valuePath} />;
      default:
        return <div className="object-value">{JSON.stringify(v.value)}</div>;
    }
  };

  const renderValueRow = (v: ValueRowData) => {
    const openEditor = () => {
      onEditRequest(
        {
          kind: 'value',
          parentPath: v.parentPath,
          name: v.name,
          value: v.value,
        },
        top,
        rowKey,
      );
    };
    const longText =
      typeof v.value === 'string'
        ? v.value
        : v.type === 'function'
          ? (v.value as { toString(): string }).toString()
          : null;

    return (
      <>
        {isNaN(Number(v.name)) && onEdit !== false && editKeys ? (
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
                actions.requestRenameKey(v.parentPath, v.name, v.value);
              }}
            />
          </div>
        ) : null}
        {v.parentType === 'array' ? (
          <span {...style('array-key')}>
            {v.name}
            <div {...style('colon')}>:</div>
          </span>
        ) : (
          <span>
            <span {...style('object-name')} className="object-key">
              <span style={{ verticalAlign: 'top' }}>"</span>
              <span style={{ display: 'inline-block' }}>
                <Highlight text={v.name} search={search} />
              </span>
              <span style={{ verticalAlign: 'top' }}>"</span>
            </span>
            <span {...style('colon')}>:</span>
          </span>
        )}
        <div
          className="variable-value"
          title={longText ?? undefined}
          onClick={
            onSelect === false && onEdit === false
              ? undefined
              : (e) => {
                  if ((e.ctrlKey || e.metaKey) && onEdit !== false) {
                    openEditor();
                    return;
                  }
                  if (onSelect !== false) {
                    onSelect({
                      name: v.name,
                      value: v.value as OnSelectProps['value'],
                      type: v.type,
                      namespace: toPublicSegments(v.parentPath),
                    });
                  }
                  // виртуальный режим: длинное значение — в overlay
                  if (
                    ctx.virtual &&
                    longText !== null &&
                    e.currentTarget.scrollWidth > e.currentTarget.clientWidth
                  ) {
                    onTextOverlay(row, longText, top);
                  }
                }
          }
          {...style('variableValue', {
            cursor: onSelect === false ? 'default' : 'pointer',
          })}
        >
          {renderValue(v)}
        </div>
        {enableClipboard ? (
          <CopyToClipboard
            src={v.value}
            namespace={[ctx.rootName, ...toPublicSegments(v.parentPath)]}
          />
        ) : null}
        {onEdit !== false ? (
          <div
            className="click-to-edit"
            style={{ verticalAlign: 'top' }}
            title="Edit Value"
          >
            <Edit
              className="click-to-edit-icon"
              {...style('editVarIcon')}
              onClick={openEditor}
            />
          </div>
        ) : null}
        {onDelete !== false ? (
          <div className="click-to-remove" style={{ verticalAlign: 'top' }}>
            <Remove
              className="click-to-remove-icon"
              {...style('removeVarIcon')}
              onClick={() => {
                actions.removeVariable(v.parentPath, v.name, v.value);
              }}
            />
          </div>
        ) : null}
      </>
    );
  };

  // --- ветка (объект/массив) ---

  const renderBranch = (node: BranchRowData, expanded: boolean) => {
    const IconComponent = expanded ? ExpandedIcon : CollapsedIcon;
    const canEditKey =
      editKeys !== false &&
      onEdit !== false &&
      node.parentType !== 'array' &&
      node.path.length > 0;
    const oldKey = canEditKey ? toPublicName(node.name) : null;

    const editValueIcon =
      onEdit !== false ? (
        <div
          className="click-to-edit"
          style={{ verticalAlign: 'top' }}
          title="Edit Value"
        >
          <Edit
            className="click-to-edit-icon"
            {...style('editVarIcon')}
            onClick={() => {
              onEditRequest(
                { kind: 'branch', nodePath: node.path, src: node.src },
                top,
                rowKey,
              );
            }}
          />
        </div>
      ) : null;

    const meta = (
      <VariableMeta
        size={node.size}
        src={node.src}
        nodePath={node.path}
        isEdit={false}
        renderIcon={editValueIcon}
      />
    );

    return (
      <>
        <span
          onClick={(e) => {
            e.stopPropagation();
            store.set('expanded', node.namespaceKeyStr, !expanded);
          }}
          {...style('brace-row')}
        >
          {canEditKey && oldKey !== null ? (
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
                  actions.requestRenameKey(
                    node.path.slice(0, -1),
                    oldKey,
                    node.src,
                  );
                }}
              />
            </div>
          ) : null}
          <div className="icon-container" {...style('icon-container')}>
            <IconComponent iconStyle={iconStyle} />
          </div>
          <ObjectName
            name={node.name}
            parentType={node.parentType}
            jsvRoot={node.jsvRoot}
            keySuffix={node.namespaceKeyStr}
          />
          <span {...style('brace')}>{node.type === 'array' ? '[' : '{'}</span>
        </span>
        {expanded ? (
          meta
        ) : (
          <>
            {node.size !== 0 ? (
              <span
                {...style('ellipsis')}
                className="node-ellipsis"
                onClick={() => {
                  store.set('expanded', node.namespaceKeyStr, true);
                }}
              >
                ...
              </span>
            ) : null}
            <span
              style={{
                ...style('brace').style,
                paddingLeft: '0px',
              }}
            >
              {node.type === 'array' ? ']' : '}'}
            </span>
            {meta}
          </>
        )}
      </>
    );
  };

  // --- группа длинного массива ---

  const renderGroup = (): ReactNode => {
    if (
      row.kind !== 'group-collapsed' &&
      row.kind !== 'group-open-collapsed' &&
      row.kind !== 'group-open' &&
      row.kind !== 'group-close'
    ) {
      return null;
    }
    const g = row.group;
    const groupKey = namespaceKey([...g.arrayNamespace, g.groupIndex]);
    const groupOpen = store.get('groupExpanded', groupKey, false);
    const IconComponent = groupOpen ? ExpandedIcon : CollapsedIcon;
    const sliceSize = g.rangeEnd - g.rangeStart;
    const toggleGroup = () => {
      store.set('groupExpanded', groupKey, !groupOpen);
    };

    const icon = (
      <div
        className="icon-container"
        {...style('icon-container')}
        onClick={toggleGroup}
      >
        <IconComponent iconStyle={iconStyle} />
      </div>
    );

    switch (row.kind) {
      case 'group-collapsed':
        return (
          <span {...style('brace-row')}>
            {icon}
            <span
              {...style('brace')}
              onClick={toggleGroup}
              className="array-group-brace"
            >
              [
              <div
                {...style('array-group-meta-data')}
                className="array-group-meta-data"
              >
                <span className="object-size" {...style('object-size')}>
                  {g.rangeStart}
                  {' - '}
                  {g.rangeEnd}
                </span>
              </div>
              ]
            </span>
          </span>
        );
      case 'group-open-collapsed':
        return (
          <span {...style('brace-row')}>
            {icon}
            <span {...style('brace')}>[</span>
            {g.expanded ? null : (
              <span
                {...style('ellipsis')}
                className="node-ellipsis"
                onClick={() => {
                  store.set('expanded', g.arrayNamespaceKeyStr, !g.expanded);
                }}
              >
                ...
              </span>
            )}
            <span
              style={{
                ...style('brace').style,
                paddingLeft: '0px',
              }}
            >
              ]
            </span>
            <VariableMeta
              size={sliceSize}
              src={g.src}
              nodePath={g.arrayPath}
              hideActions
            />
          </span>
        );
      case 'group-open':
        return (
          <span {...style('brace-row')}>
            {icon}
            <span {...style('brace')}>[</span>
            <VariableMeta
              size={sliceSize}
              src={g.src}
              nodePath={g.arrayPath}
              hideActions
            />
          </span>
        );
      case 'group-close':
        return (
          <span
            style={{
              ...style('brace').style,
              paddingLeft: '3px',
            }}
          >
            ]
          </span>
        );
    }
    return null;
  };

  // --- сборка строки ---

  let cls = 'object-key-val';
  if (row.kind === 'value') {
    cls = 'variable-row';
  } else if (row.kind.startsWith('group')) {
    cls = 'object-key-val array-group';
  }

  let content: ReactNode = null;
  switch (row.kind) {
    case 'node-collapsed':
      content = renderBranch(row.node, false);
      break;
    case 'node-open':
      content = renderBranch(row.node, true);
      break;
    case 'node-close':
      content = (
        <span
          style={{
            ...style('brace').style,
            paddingLeft: '3px',
          }}
        >
          {row.node.type === 'array' ? ']' : '}'}
        </span>
      );
      break;
    case 'array-group-header':
      content = (
        <>
          <ObjectName
            name={row.node.name}
            parentType={row.node.parentType}
            jsvRoot={row.node.jsvRoot}
            keySuffix={row.node.namespaceKeyStr}
          />
          <span>
            <VariableMeta
              size={row.node.size}
              src={row.node.src}
              nodePath={row.node.path}
            />
          </span>
        </>
      );
      break;
    case 'value':
      content = renderValueRow(row.value);
      break;
    default:
      content = renderGroup();
      break;
  }

  // Отступ задаётся переменной (а не прямым paddingLeft): по наведению
  // строка сдвигается на 1px влево, как в legacy (borderLeft 1px → 2px).
  const rowStyle: CSSProperties & Record<'--rjv-pl', string> = {
    top,
    '--rjv-pl': `${geom.paddingLeft}px`,
  };

  return (
    <div className={`rjv-row ${cls}`} style={rowStyle} ref={firstRef}>
      {geom.guides.map((x, i) => (
        <span
          key={i}
          className={
            i === geom.guides.length - 1
              ? 'rjv-guide rjv-guide--own'
              : 'rjv-guide'
          }
          style={{ left: x, ...style('rjv-guide').style }}
        />
      ))}
      <div className="rjv-row-content">{content}</div>
    </div>
  );
};

/** мемоизация: content строки стабилен до изменения данных/флагов. */
export const FlatRow = memo(FlatRowBase, (prev, next) => {
  if (prev.row !== next.row || prev.top !== next.top) {
    return false;
  }
  return (
    prev.firstRef === next.firstRef &&
    prev.onTextOverlay === next.onTextOverlay &&
    prev.onEditRequest === next.onEditRequest
  );
});
