import { Form, TreeSelect } from 'antd';
import { FieldValues, useController } from 'react-hook-form';

import { FormTreeSelectProps } from './form-tree-select.type';
import '../form-components.scss';

export default <T extends FieldValues>({
  control,
  name,
  label,
  rules,
  formItemProps,
  ...rest
}: FormTreeSelectProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control, rules });

  return (
    <div className={`${rules?.required?.value ? 'requiredInput' : ''}`}>
      <Form.Item
        className="form-tree-select"
        labelCol={{ span: 24 }}
        label={label}
        validateStatus={error && 'error'}
        help={error && error.message}
        {...formItemProps}
      >
        <TreeSelect {...rest} {...field} />
      </Form.Item>
    </div>
  );
};
