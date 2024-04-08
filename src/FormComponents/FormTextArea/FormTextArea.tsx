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
  ...rest
}: FormTextAreaProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control, rules });

  return (
    // @ts-ignore
    <div className={`${rules?.required?.value ? 'requiredInput' : ''}`}>
      <Form.Item
        className={controlClassName}
        labelCol={{ span: 24 }}
        label={label}
        validateStatus={error && 'error'}
        help={error && error.message}
      >
        {/* @ts-ignore */}
        <TextArea {...rest} {...field} />
      </Form.Item>
    </div>
  );
};
