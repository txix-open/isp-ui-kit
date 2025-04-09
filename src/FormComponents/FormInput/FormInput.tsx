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
  formItemProps,
  ...rest
}: FormInputProps<T>) => {
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
        className={controlClassName}
        labelCol={{ span: 24 }}
        label={label}
        validateStatus={error && 'error'}
        help={error && error.message}
        {...formItemProps}
      >
        {/* @ts-ignore */}
        <Input {...rest} {...field} onBlur={handleBlur} autoComplete="off" />
      </Form.Item>
    </div>
  );
};
