import { Input } from 'antd';
import { FieldValues, useController } from 'react-hook-form';
import { FormTextAreaProps } from './form-text-area.type';
import BaseField from '../BaseField/BaseField';

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
        <TextArea
          {...rest}
          {...field}
          {...accessibility}
          onChange={(event) => {
            field.onChange(event);
            if (forwardEvents) rest.onChange?.(event);
          }}
          onBlur={handleBlur}
        />
      )}
    </BaseField>
  );
};
