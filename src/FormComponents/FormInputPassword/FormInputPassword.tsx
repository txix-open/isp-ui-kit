import { Form, Input } from 'antd';
import { FieldValues, useController } from 'react-hook-form';
import { FormInputPasswordProps } from './form-input-password.type';
import '../form-components.scss';

export default <T extends FieldValues>({
  control,
  name,
  rules,
  label,
  ...rest
}: FormInputPasswordProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control, rules });
  return (
    <div className={`${rules?.required?.value ? 'requiredInput' : ''}`}>
      <Form.Item
        labelCol={{ span: 24 }}
        label={label}
        validateStatus={error && 'error'}
        help={error && error.message}
      >
        {/* @ts-ignore */}
        <Input.Password {...rest} {...field} autoComplete="new-password" />
      </Form.Item>
    </div>
  );
};
