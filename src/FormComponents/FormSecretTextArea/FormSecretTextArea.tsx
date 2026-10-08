import { FormTextAreaProps } from '../FormTextArea/form-text-area.type';
import { FieldValues, useController } from 'react-hook-form';
import { Button, Input } from 'antd';
import BaseField from '../BaseField/BaseField';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import './form-secret-text-area.scss';
import { useState } from 'react';

const { TextArea } = Input;

export default <T extends FieldValues>({
  trimOnBlur = true,
  forwardEvents = false,
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
    const value = trimOnBlur ? e.target.value.trim() : e.target.value;
    field.onChange(value);
    field.onBlur();
    if (forwardEvents) rest.onBlur?.(e);
  };

  return (
    <BaseField
      id={rest.id}
      label={label}
      required={Boolean(rules?.required?.value)}
      error={error}
      controlClassName={controlClassName}
      formItemProps={formItemProps}
      describedBy={rest['aria-describedby']}
    >
      {(accessibility) => (
        <div className="form-secret-textarea__input-wrapper">
          <TextArea
            {...rest}
            {...field}
            {...accessibility}
            status={error ? 'error' : rest.status}
            onChange={(event) => {
              field.onChange(event);
              if (forwardEvents) rest.onChange?.(event);
            }}
            onBlur={handleBlur}
            value={field.value || ''}
            className={[
              rest.className,
              isMasked ? 'form-secret-textarea__masked' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            autoComplete="new-password"
          />
          <Button
            className="form-secret-textarea__toggle"
            type="text"
            onClick={toggleMask}
            disabled={rest.disabled}
            aria-label={isMasked ? 'Показать содержимое' : 'Скрыть содержимое'}
            aria-pressed={!isMasked}
            aria-controls={accessibility.id}
            icon={isMasked ? <EyeInvisibleOutlined /> : <EyeOutlined />}
          />
        </div>
      )}
    </BaseField>
  );
};
