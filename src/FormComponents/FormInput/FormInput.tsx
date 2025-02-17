import { Form, Input } from 'antd';
import { FieldValues, useController } from 'react-hook-form';
import { FormInputProps } from './form-input.type';
import '../form-components.scss';

export default <T extends FieldValues>({
  control,
  name,
  rules,
  label,
  controlClassName = '',
  ...rest
}: FormInputProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control, rules });

  return (
    <div className={`${rules?.required?.value ? 'requiredInput' : ''}`}>
      <Form.Item
        className={controlClassName}
        labelCol={{ span: 24 }}
        label={label}
        validateStatus={error && 'error'}
        help={error && error.message}
      >
        {/* @ts-ignore */}
        <Input {...rest} {...field} autoComplete="off" />
      </Form.Item>
    </div>
  );
};
