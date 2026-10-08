import { Input } from 'antd';
import { FieldValues, useController } from 'react-hook-form';
import { FormInputPasswordProps } from './form-input-password.type';
import BaseField from '../BaseField/BaseField';

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
}: FormInputPasswordProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control, rules });

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
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
        <Input.Password
          {...rest}
          {...field}
          {...accessibility}
          onChange={(event) => {
            field.onChange(event);
            if (forwardEvents) rest.onChange?.(event);
          }}
          onBlur={handleBlur}
          autoComplete="new-password"
        />
      )}
    </BaseField>
  );
};
