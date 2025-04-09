import { Form, Input } from 'antd';
import { FieldValues, useController } from 'react-hook-form';
import { FormTextAreaProps } from './form-text-area.type';
import '../form-components.scss';

const { TextArea } = Input;

export default <T extends FieldValues>({
  control,
  name,
  rules,
  label,
  controlClassName = '',
  formItemProps,
  ...rest
}: FormTextAreaProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control, rules });

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
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
        <TextArea {...rest} {...field} onBlur={handleBlur} />
      </Form.Item>
    </div>
  );
};
