import { Form, Radio } from 'antd';
import { FieldValues, useController } from 'react-hook-form';
import { FormRadioGroupProps } from './form-radio-group.type';
import { LabelItem } from '../formTypes';

export default <T extends FieldValues>({
  control,
  name,
  label,
  rules,
  type = 'radio',
  items,
  formItemProps,
  ...rest
}: FormRadioGroupProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control, rules });

  const renderItems = () =>
    items.map((item: LabelItem) => {
      if (type === 'button') {
        return (
          <Radio.Button key={item.value} value={item.value}>
            {item.label}
          </Radio.Button>
        );
      }
      return (
        <Radio key={item.value} value={item.value}>
          {item.label}
        </Radio>
      );
    });

  return (
    <Form.Item
      labelCol={{ span: 24 }}
      label={label}
      validateStatus={error && 'error'}
      help={error && error.message}
      {...formItemProps}
    >
      <Radio.Group {...rest} {...field}>
        {renderItems()}
      </Radio.Group>
    </Form.Item>
  );
};
