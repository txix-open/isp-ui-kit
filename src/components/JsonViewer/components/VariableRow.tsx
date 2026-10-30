import { memo, useMemo, useState } from 'react';

import { SINGLE_INDENT } from '../constants';
import { useViewer } from '../context';
import type { JsonValueType } from '../utils/valueType';
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
} from './DataTypes';
import { Edit, RemoveCircle as Remove } from './icons';
import { Highlight } from './Highlight';
import { CopyToClipboard } from './CopyToClipboard';
import { toPublicNamespace, toPublicSegments } from '../utils/namespace';
import type { ParsedInput } from '../utils/parseInput';
import { parseInput } from '../utils/parseInput';
import { stringifyVariable } from '../utils/stringifyVariable';
import type { JsonPath } from '../utils/immutable';
import { ValueEditor } from './ValueEditor';

interface VariableRowProps {
  /** Ключ значения (для массивов — строковый индекс). */
  name: string;
  value: unknown;
  type: JsonValueType;
  /** Тип контейнера (для отрисовки ключа). */
  parentType: 'array' | undefined;
  /** Путь контейнера от корня src. */
  parentPath: JsonPath;
  /** JSON-ключ абсолютного namespace (считается родителем один раз). */
  namespaceKeyStr: string;
}

/**
 * Строка примитивного значения + редактор (1:1 порт legacy
 * VariableEditor.jsx).
 */ const VariableRowBase = ({
  name,
  value,
  type,
  parentType,
  parentPath,
  namespaceKeyStr,
}: VariableRowProps) => {
  const {
    style,
    actions,
    rootName,
    indentWidth,
    editKeys,
    enableClipboard,
    onEdit,
    onDelete,
    onSelect,
    search,
  } = useViewer();

  const [editMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [parsedInput, setParsedInput] = useState<ParsedInput>({
    type: false,
    value: null,
  });
  const nodePath: JsonPath = useMemo(
    () => [...parentPath, name],
    [parentPath, name],
  );

  const prepopInput = () => {
    if (onEdit === false) {
      return;
    }
    const stringifiedValue = stringifyVariable(value);
    setEditMode(true);
    setEditValue(stringifiedValue);
    setParsedInput(parseInput(stringifiedValue));
  };

  const submitEdit = (submitDetected: boolean) => {
    const newValue =
      submitDetected && parsedInput.type ? parsedInput.value : editValue;
    setEditMode(false);
    actions.editVariable(parentPath, name, newValue, value);
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
        onClick={prepopInput}
      />
    </div>
  );

  const getEditKeyIcon = () => (
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
          actions.requestRenameKey(parentPath, name, value);
        }}
      />
    </div>
  );

  const getRemoveIcon = () => (
    <div className="click-to-remove" style={{ verticalAlign: 'top' }}>
      <Remove
        className="click-to-remove-icon"
        {...style('removeVarIcon')}
        onClick={() => {
          actions.removeVariable(parentPath, name, value);
        }}
      />
    </div>
  );

  const getValue = () => {
    const activeType = editMode ? false : type;
    switch (activeType) {
      case false:
        return getEditInput();
      case 'string':
        return <JsonString value={value} nodePath={nodePath} />;
      case 'integer':
        return <JsonInteger value={value} nodePath={nodePath} />;
      case 'float':
        return <JsonFloat value={value} nodePath={nodePath} />;
      case 'boolean':
        return <JsonBoolean value={value} nodePath={nodePath} />;
      case 'function':
        return <JsonFunction value={value} nodePath={nodePath} />;
      case 'null':
        return <JsonNull />;
      case 'nan':
        return <JsonNan />;
      case 'undefined':
        return <JsonUndefined />;
      case 'date':
        return <JsonDate value={value} nodePath={nodePath} />;
      case 'regexp':
        return <JsonRegexp value={value} nodePath={nodePath} />;
      default:
        // неanticipated-типы
        return <div className="object-value">{JSON.stringify(value)}</div>;
    }
  };

  const getEditInput = () => (
    <ValueEditor
      value={editValue}
      parsedInput={parsedInput}
      nodePath={nodePath}
      mainCheckDetected={false}
      onChange={(inputValue) => {
        setEditValue(inputValue);
        setParsedInput(parseInput(inputValue));
      }}
      onCommit={submitEdit}
      onCancel={() => {
        setEditMode(false);
        setEditValue('');
      }}
    />
  );

  return (
    <div
      {...style('objectKeyVal', {
        paddingLeft: indentWidth * SINGLE_INDENT,
      })}
      className="variable-row"
    >
      {isNaN(Number(name)) && onEdit !== false && editKeys && editMode === false
        ? getEditKeyIcon()
        : null}
      {parentType === 'array' ? (
        <span {...style('array-key')} key={name + '_' + namespaceKeyStr}>
          {name}
          <div {...style('colon')}>:</div>
        </span>
      ) : (
        <span>
          <span
            {...style('object-name')}
            className="object-key"
            key={name + '_' + namespaceKeyStr}
          >
            <span style={{ verticalAlign: 'top' }}>"</span>
            <span style={{ display: 'inline-block' }}>
              <Highlight text={name} search={search} />
            </span>
            <span style={{ verticalAlign: 'top' }}>"</span>
          </span>
          <span {...style('colon')}>:</span>
        </span>
      )}
      <div
        className="variable-value"
        onClick={
          onSelect === false && onEdit === false
            ? undefined
            : (e) => {
                if ((e.ctrlKey || e.metaKey) && onEdit !== false) {
                  prepopInput();
                } else if (onSelect !== false) {
                  onSelect({
                    name,
                    value: value as object | string | number | boolean | null,
                    type,
                    namespace: toPublicSegments(parentPath),
                  });
                }
              }
        }
        {...style('variableValue', {
          cursor: onSelect === false ? 'default' : 'pointer',
        })}
      >
        {getValue()}
      </div>
      {enableClipboard ? (
        <CopyToClipboard
          hidden={editMode}
          src={value}
          namespace={toPublicNamespace(rootName, parentPath)}
        />
      ) : null}
      {onEdit !== false && editMode === false ? getEditIcon() : null}
      {onDelete !== false && editMode === false ? getRemoveIcon() : null}
    </div>
  );
};

/**
 * мемоизация: parentPath стабильна (список детей строится родителем
 * один раз на изменение src), value — по ссылке, остальное — примитивы.
 */
export const VariableRow = memo(VariableRowBase);
