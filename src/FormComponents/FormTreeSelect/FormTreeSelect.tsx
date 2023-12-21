import { Form, TreeSelect } from 'antd';
import { FieldValues, useController } from 'react-hook-form';

import './from-tree-select.scss';
import { FormTreeSelectProps } from './form-tree-select.type';

export default <T extends FieldValues>({
  control,
  name,
  label,
  rules,
  ...rest
}: FormTreeSelectProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control, rules });

  return (
    // @ts-ignore
    <div className={`${rules?.required.value ? 'requiredInput' : ''}`}>
      <Form.Item
        className="form-tree-select"
        labelCol={{ span: 24 }}
        label={label}
        validateStatus={error && 'error'}
        help={error && error.message}
      >
        {/* @ts-ignore */}
        <TreeSelect {...rest} {...field} />
      </Form.Item>
    </div>
  );
};
