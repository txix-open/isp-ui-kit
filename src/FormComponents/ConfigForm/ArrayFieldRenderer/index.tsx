import { Control, useFieldArray } from 'react-hook-form';
import { Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { RenderFieldByType } from '../RenderFieldByType';
import './array-field-renderer.scss';
import { InputType, SettingsType } from '../config-form.type';
import { ReactNode, useEffect, useRef } from 'react';

interface ArrayFieldRendererProps {
  name: string;
  label: ReactNode;
  inputType: InputType;
  control: Control<any>;
  settings: SettingsType;
  crudApi: any;
  focusField: (name: string) => void;
}

export const ArrayFieldRenderer = ({
  name,
  label,
  control,
  inputType,
  settings,
  crudApi,
  focusField,
}: ArrayFieldRendererProps) => {
  const pendingFocus = useRef<number | null | undefined>(undefined);
  const addButton = useRef<{ focus: () => void } | null>(null);
  const { fields, append, remove } = useFieldArray({
    control,
    name,
    keyName: 'formFieldId',
  });

  useEffect(() => {
    const index = pendingFocus.current;
    if (index === undefined) return;
    pendingFocus.current = undefined;
    if (index === null) addButton.current?.focus();
    else focusField(`${name}[${index}]`);
  }, [fields, focusField, name]);

  return (
    <fieldset className="config-form__group config-form__array">
      <legend>{label}</legend>
      {fields.map((field: any, index: number) => (
        <div
          key={field.formFieldId}
          className="edit-field"
          data-testid="edit-field"
        >
          <span className="edit-field__label" aria-hidden="true">
            {index + 1}
          </span>
          <RenderFieldByType
            field={{
              inputType,
              settings,
              id: `${name}[${index}]`,
              ariaLabel: `${label}: ${index + 1}`,
            }}
            control={control}
            crudApi={crudApi}
          />
          <Button
            type="text"
            danger
            aria-label={`Удалить элемент ${index + 1}: ${label}`}
            onClick={() => {
              pendingFocus.current =
                fields.length > 1 ? Math.min(index, fields.length - 2) : null;
              remove(index);
            }}
          >
            <DeleteOutlined />
          </Button>
        </div>
      ))}
      <Button
        ref={(node) => {
          addButton.current = node;
        }}
        className="edit-field__btn"
        onClick={() => {
          pendingFocus.current = fields.length;
          append('', { shouldFocus: false });
        }}
      >
        Добавить элемент
      </Button>
    </fieldset>
  );
};
