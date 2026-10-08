import { Control, useFieldArray } from 'react-hook-form';
import { Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { RenderFieldByType } from '../RenderFieldByType';
import './array-field-renderer.scss';
import { InputType, SettingsType } from '../config-form.type';
import { ReactNode } from 'react';

interface ArrayFieldRendererProps {
  name: string;
  label: ReactNode;
  inputType: InputType;
  control: Control<any>;
  settings: SettingsType;
  crudApi: any;
}

export const ArrayFieldRenderer = ({
  name,
  label,
  control,
  inputType,
  settings,
  crudApi,
}: ArrayFieldRendererProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
    keyName: 'formFieldId',
  });

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
            onClick={() => remove(index)}
          >
            <DeleteOutlined />
          </Button>
        </div>
      ))}
      <Button className="edit-field__btn" onClick={() => append('')}>
        Добавить элемент
      </Button>
    </fieldset>
  );
};
