import { AutoComplete } from 'antd';
import { FieldValues, useController } from 'react-hook-form';
import { FormAutoCompleteProps } from './form-auto-complete.type';
import BaseField from '../BaseField/BaseField';

export default <T extends FieldValues>({
  forwardEvents = false,
  trimOnBlur = true,
  control,
  name,
  label,
  controlClassName = '',
  rules,
  formItemProps,
  ...rest
}: FormAutoCompleteProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control, rules });

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    field.onChange(trimOnBlur ? e.target.value.trim() : e.target.value);
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
        <AutoComplete
          {...rest}
          {...field}
          {...accessibility}
          onChange={(value, option) => {
            field.onChange(value);
            if (forwardEvents) rest.onChange?.(value, option);
          }}
          onBlur={handleBlur}
          filterOption={(inputValue, option) =>
            String(option?.value)
              .toUpperCase()
              .includes(inputValue.toUpperCase()) ?? false
          }
        />
      )}
    </BaseField>
  );
};
