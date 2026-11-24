import type { ReactNode } from 'react';

import { useViewer } from '../context';
import type { JsonPath } from '../utils/immutable';
import { toPublicNamespace } from '../utils/namespace';
import { toType } from '../utils/valueType';
import { CopyToClipboard } from './CopyToClipboard';
import { AddCircle as Add, RemoveCircle as Remove } from './icons';

interface VariableMetaProps {
  size: number;
  src: unknown;
  /** Путь узла от корня src (пустой — корневой узел). */
  nodePath: JsonPath;
  isEdit?: boolean;
  /** Иконка редактирования значения (узел-объект/массив). */
  renderIcon?: ReactNode;
  /**
   * Внутренние узлы ArrayGroup: только бейдж размера — операции над
   * срезами массива в legacy портили данные.
   */
  hideActions?: boolean;
}

/**
 * Метаданные узла (1:1 порт legacy VariableMeta.jsx): размер,
 * копирование, добавление, редактирование значения, удаление.
 */
export const VariableMeta = ({
  size,
  src,
  nodePath,
  isEdit,
  renderIcon,
  hideActions,
}: VariableMetaProps) => {
  const {
    style,
    actions,
    rootName,
    displayObjectSize,
    enableClipboard,
    onAdd,
    onEdit,
    onDelete,
  } = useViewer();

  const getObjectSize = () => {
    if (displayObjectSize) {
      return (
        <span className="object-size" {...style('object-size')}>
          {size} item{size === 1 ? '' : 's'}
        </span>
      );
    }
    return null;
  };

  const getAddAttribute = () => {
    const isObject = toType(src) === 'object';

    return (
      <span className="click-to-add" style={{ verticalAlign: 'top' }}>
        <Add
          className="click-to-add-icon"
          {...style('addVarIcon')}
          onClick={() => {
            if (isObject) {
              actions.requestAddKey(nodePath);
            } else {
              actions.appendToArray(nodePath, src);
            }
          }}
        />
      </span>
    );
  };

  const getRemoveObject = () => {
    // корневой узел удалять нельзя (legacy: namespace.length === 1)
    if (nodePath.length === 0) {
      return null;
    }

    const key = nodePath[nodePath.length - 1];

    return (
      <span className="click-to-remove">
        <Remove
          className="click-to-remove-icon"
          {...style('removeVarIcon')}
          onClick={() => {
            actions.removeVariable(nodePath.slice(0, -1), key, src);
          }}
        />
      </span>
    );
  };

  return (
    <div
      {...style('object-meta-data', { cursor: 'pointer' })}
      className="object-meta-data"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {/* размер */}
      {getObjectSize()}
      {/* копирование */}
      {!hideActions && enableClipboard && !isEdit ? (
        <CopyToClipboard
          src={src}
          namespace={toPublicNamespace(rootName, nodePath)}
        />
      ) : null}
      {/* добавление/редактирование/удаление */}
      {!hideActions && onAdd !== false && !isEdit ? getAddAttribute() : null}
      {!hideActions && onEdit !== false && !isEdit ? renderIcon : null}
      {!hideActions && onDelete !== false && !isEdit ? getRemoveObject() : null}
    </div>
  );
};
