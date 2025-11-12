import { Form, Switch } from 'antd';
import { FieldValues, useController } from 'react-hook-form';
import { FormSwitchProps } from './form-switch.type';
import './form-switch.style.scss';

export default <T extends FieldValues>({
  control,
  name,
  label,
  rules,
  formItemProps,
  ...rest
}: FormSwitchProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control, rules });

  return (
    <Form.Item
      valuePropName="checked"
      validateStatus={error && 'error'}
      help={error && error.message}
      label={label}
      {...formItemProps}
    >
      <div className="form-switch">
        <Switch {...rest} checked={field.value} {...field} />
      </div>
    </Form.Item>
  );
};
