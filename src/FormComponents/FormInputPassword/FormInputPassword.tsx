import { Form, Input } from 'antd';
import { FieldValues, useController } from 'react-hook-form';
import { FormInputPasswordProps } from './form-input-password.type';
import '../form-components.scss';

export default <T extends FieldValues>({
  control,
  name,
  rules,
  label,
  formItemProps,
  ...rest
}: FormInputPasswordProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control, rules });

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const trimmedValue = e.target.value.trim();
    field.onChange(trimmedValue);
    field.onBlur();
  };

  return (
    <div className={`${rules?.required?.value ? 'requiredInput' : ''}`}>
      <Form.Item
        labelCol={{ span: 24 }}
        label={label}
        validateStatus={error && 'error'}
        help={error && error.message}
        {...formItemProps}
      >
        {/* @ts-ignore */}
        <Input.Password
          {...rest}
          {...field}
          onBlur={handleBlur}
          autoComplete="new-password"
        />
      </Form.Item>
    </div>
  );
};
