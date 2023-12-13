import { Checkbox, Form } from 'antd';
import { FieldValues, useController } from 'react-hook-form';
import { FormCheckboxGroupProps } from './form-checkbox.type';

// eslint-disable-next-line react/function-component-definition
export default function FormCheckbox<T extends FieldValues>({
  control,
  name,
  label,
  rules,
  ...rest
}: FormCheckboxGroupProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control, rules });

  return (
    <Form.Item
      valuePropName="checked"
      validateStatus={error && 'error'}
      help={error && error.message}
    >
      {/* @ts-ignore */}
      <Checkbox {...rest} checked={field.value} {...field}>
        {label}
      </Checkbox>
    </Form.Item>
  );
}
