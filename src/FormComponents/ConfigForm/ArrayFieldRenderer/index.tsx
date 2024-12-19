import { Control, useFieldArray } from 'react-hook-form';
import { Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { RenderFieldByType } from '../RenderFieldByType';
import './array-field-renderer.scss';
import { InputType, SettingsType } from '../config-form.type';

interface ArrayFieldRendererProps {
  name: string;
  label: string;
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
    <div>
      <label>{label}</label>
      {fields.map((field: any, index: number) => (
        <div
          key={field.formFieldId}
          className="edit-field"
          data-testid="edit-field"
        >
          <label className="edit-field__label">{index}</label>
          {RenderFieldByType({
            field: { inputType, settings, id: `${name}[${index}]` },
            control,
            value: field,
            crudApi,
          })}
          <Button type="link" danger onClick={() => remove(index)}>
            <DeleteOutlined />
          </Button>
        </div>
      ))}
      <Button className="edit-field__btn" onClick={() => append('')}>
        Добавить элемент
      </Button>
    </div>
  );
};
