import { useEffect, useRef } from 'react';
import AutosizeTextarea from 'react-textarea-autosize';

import { useViewer } from '../context';
import { EDIT_INPUT_MIN_ROWS, toTextareaStyle } from '../themes/getStyle';
import type { JsonPath } from '../utils/immutable';
import type { ParsedInput } from '../utils/parseInput';
import {
  BracesPreview,
  JsonBoolean,
  JsonDate,
  JsonFloat,
  JsonFunction,
  JsonInteger,
  JsonNan,
  JsonNull,
  JsonString,
  JsonUndefined,
} from './DataTypes';
import { CheckCircle, RemoveCircle as Remove } from './icons';

interface ValueEditorProps {
  /** Текст поля. */
  value: string;
  /** Опознанный тип введённого значения. */
  parsedInput: ParsedInput;
  /** Путь значения (для предпросмотра опознанного значения). */
  nodePath: JsonPath;
  /** Основная галочка: commit по опознанному типу (true) или сырому
   * тексту (false) — legacy-семантика Object.jsx и VariableEditor.jsx.
   */
  mainCheckDetected: boolean;
  onChange: (value: string) => void;
  /** Подтверждение (Ctrl/Cmd+Enter — всегда с опознанным типом). */
  onCommit: (submitDetected: boolean) => void;
  /** Отмена (Escape / ✕). */
  onCancel: () => void;
}

/**
 * Редактор значения: textarea + определение типа + подтверждение/отмена.
 * Общий для VariableRow, Node и overlay виртуализованного режима
 * (1:1 порт legacy-редакторов).
 */
export const ValueEditor = ({
  value,
  parsedInput,
  nodePath,
  mainCheckDetected,
  onChange,
  onCommit,
  onCancel,
}: ValueEditorProps) => {
  const { style } = useViewer();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const getDetectedInput = () => {
    const { type: detectedType, value: detectedValue } = parsedInput;
    if (detectedType === false) {
      return null;
    }
    switch (detectedType.toLowerCase()) {
      case 'object':
        return <BracesPreview kind="object" />;
      case 'array':
        return <BracesPreview kind="array" />;
      case 'string':
        return <JsonString value={detectedValue} nodePath={nodePath} />;
      case 'integer':
        return <JsonInteger value={detectedValue} nodePath={nodePath} />;
      case 'float':
        return <JsonFloat value={detectedValue} nodePath={nodePath} />;
      case 'boolean':
        return <JsonBoolean value={detectedValue} nodePath={nodePath} />;
      case 'function':
        return <JsonFunction value={detectedValue} nodePath={nodePath} />;
      case 'null':
        return <JsonNull />;
      case 'nan':
        return <JsonNan />;
      case 'undefined':
        return <JsonUndefined />;
      case 'date':
        return (
          <JsonDate
            value={new Date(detectedValue as Date)}
            nodePath={nodePath}
          />
        );
      default:
        return null;
    }
  };

  const showDetected = () => {
    const detected = getDetectedInput();
    if (detected) {
      return (
        <div>
          <div {...style('detected-row')}>
            {detected}
            <CheckCircle
              className="edit-check detected"
              style={{
                verticalAlign: 'top',
                paddingLeft: '3px',
                ...style('check-icon').style,
              }}
              onClick={() => {
                onCommit(true);
              }}
            />
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <AutosizeTextarea
        ref={textareaRef}
        value={value}
        className="variable-editor"
        onChange={(event) => {
          onChange(event.target.value);
        }}
        onKeyDown={(e) => {
          switch (e.key) {
            case 'Escape': {
              onCancel();
              break;
            }
            case 'Enter': {
              if (e.ctrlKey || e.metaKey) {
                onCommit(true);
              }
              break;
            }
          }
          e.stopPropagation();
        }}
        placeholder="update this value"
        minRows={EDIT_INPUT_MIN_ROWS}
        style={toTextareaStyle(style('edit-input').style)}
      />
      <div {...style('edit-icon-container')}>
        <Remove
          className="edit-cancel"
          {...style('cancel-icon')}
          onClick={onCancel}
        />
        <CheckCircle
          className="edit-check string-value"
          {...style('check-icon')}
          onClick={() => {
            onCommit(mainCheckDetected);
          }}
        />
        <div>{showDetected()}</div>
      </div>
    </div>
  );
};
