import { memo, useMemo, useState } from 'react';

import { SINGLE_INDENT } from '../constants';
import { useViewer } from '../context';
import type { PathSegment } from '../utils/immutable';
import { childNamespaceKey, namespaceKey } from '../utils/namespace';
import { Node } from './Node';
import { ObjectName } from './ObjectName';
import { CollapsedIcon, ExpandedIcon } from './ToggleIcons';
import { VariableMeta } from './VariableMeta';

interface ArrayGroupProps {
  src: unknown[];
  name: string | number | false | null;
  /** Абсолютное namespace (с корневым именем). */
  namespace: ReadonlyArray<string | number | null>;
  depth: number;
  jsvRoot?: boolean;
  type?: 'array';
  parentType?: 'object' | 'array' | 'array_group';
}

/**
 * Группировка длинных массивов (1:1 порт legacy ArrayGroup.jsx):
 * блоки по groupArraysAfterLength элементов с отдельным раскрыванием.
 *
 * Состояние раскрытия групп — локальное (legacy держал его в
 * state компонента, а не в общем хранилище).
 */
const ArrayGroupBase = ({
  src,
  name,
  namespace,
  jsvRoot,
  parentType,
}: ArrayGroupProps) => {
  const {
    style,
    iconStyle,
    groupArraysAfterLength,
    indentWidth,
    searchExpandKeys,
  } = useViewer();

  const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>(
    {},
  );

  const namespaceKeyStr = useMemo(() => namespaceKey(namespace), [namespace]);

  const array = src;
  const nodePath = namespace.slice(1) as PathSegment[];

  const arrayGroupPaddingLeft = indentWidth * SINGLE_INDENT;
  const objectPaddingLeft = jsvRoot ? 0 : arrayGroupPaddingLeft;

  const size = groupArraysAfterLength;
  const groups = Math.ceil(array.length / size);

  // Точка переключения — видимое состояние (группа может быть открыта
  // поиском, без явного флага в expandedGroups).
  const toggleCollapsed = (i: number) => {
    const next = !isGroupOpen(i);
    setExpandedGroups((prev) => ({ ...prev, [i]: next }));
  };

  /**
   * Поиск: не трогаемая пользователем группа раскрывается, если
   * содержит совпадение (те же правила, что в flattenTree).
   */
  const searchGroupOpen = (i: number): boolean => {
    if (searchExpandKeys === null) {
      return false;
    }
    const end = Math.min(array.length, (i + 1) * size);
    for (let j = i * size; j < end; j += 1) {
      if (searchExpandKeys.has(childNamespaceKey(namespaceKeyStr, j))) {
        return true;
      }
    }
    return false;
  };

  const isGroupOpen = (i: number): boolean =>
    expandedGroups[i] ?? searchGroupOpen(i);

  const getExpandedIcon = (i: number) =>
    isGroupOpen(i) ? (
      <ExpandedIcon iconStyle={iconStyle} />
    ) : (
      <CollapsedIcon iconStyle={iconStyle} />
    );

  return (
    <div
      className="object-key-val"
      {...style(jsvRoot ? 'jsv-root' : 'objectKeyVal', {
        paddingLeft: objectPaddingLeft,
      })}
    >
      <ObjectName
        name={name}
        parentType={parentType}
        jsvRoot={jsvRoot}
        keySuffix={namespaceKeyStr}
      />

      <span>
        <VariableMeta size={array.length} src={array} nodePath={nodePath} />
      </span>
      {[...Array(groups)].map((_, i) => (
        <div
          key={i}
          className="object-key-val array-group"
          {...style('objectKeyVal', {
            marginLeft: 6,
            paddingLeft: arrayGroupPaddingLeft,
          })}
        >
          <span {...style('brace-row')}>
            <div
              className="icon-container"
              {...style('icon-container')}
              onClick={() => {
                toggleCollapsed(i);
              }}
            >
              {getExpandedIcon(i)}
            </div>
            {isGroupOpen(i) ? (
              <Node
                key={String(name) + i}
                depth={0}
                name={false}
                src={array.slice(i * size, i * size + size)}
                namespace={namespace}
                type="array"
                parentType="array_group"
                indexOffset={i * size}
                collapsedOverride={false}
              />
            ) : (
              <span
                {...style('brace')}
                onClick={() => {
                  toggleCollapsed(i);
                }}
                className="array-group-brace"
              >
                [
                <div
                  {...style('array-group-meta-data')}
                  className="array-group-meta-data"
                >
                  <span className="object-size" {...style('object-size')}>
                    {i * size}
                    {' - '}
                    {i * size + size > array.length
                      ? array.length
                      : i * size + size}
                  </span>
                </div>
                ]
              </span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
};

/**
 * мемоизация: ссылка src и namespace-массив стабильны (список детей
 * родитель строит один раз на изменение src); локальные состояния
 * раскрытия групп живут внутри компонента.
 */
export const ArrayGroup = memo(ArrayGroupBase);
