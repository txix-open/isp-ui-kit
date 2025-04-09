import { FormTextAreaProps } from '../FormTextArea/form-text-area.type';
import { FieldValues, useController } from 'react-hook-form';
import { Button, Form, Input } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import './form-secret-text-area.scss';
import { useState } from 'react';

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

  const [isMasked, setIsMasked] = useState(true);

  const toggleMask = () => {
    setIsMasked((prev) => !prev);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const trimmedValue = e.target.value.trim();
    field.onChange(trimmedValue);
    field.onBlur();
  };

  return (
    <div
      className={`form-secret-textarea ${rules?.required ? 'requiredInput' : ''}`}
    >
      <Form.Item
        className={controlClassName}
        labelCol={{ span: 24 }}
        label={label}
        validateStatus={error ? 'error' : ''}
        help={error?.message}
        {...formItemProps}
      >
        <div className="form-secret-textarea__input-wrapper">
          <TextArea
            {...rest}
            {...field}
            onBlur={handleBlur}
            value={field.value || ''}
            className={isMasked ? 'form-secret-textarea__masked' : ''}
            autoComplete="new-password"
          />
          <Button
            className="form-secret-textarea__toggle"
            type="text"
            onClick={toggleMask}
            icon={isMasked ? <EyeInvisibleOutlined /> : <EyeOutlined />}
          />
        </div>
      </Form.Item>
    </div>
  );
};
