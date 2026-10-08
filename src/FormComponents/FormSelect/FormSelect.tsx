import { Select } from 'antd';
import { FieldValues, useController } from 'react-hook-form';
import { FormSelectProps } from './form-select.type';
import BaseField from '../BaseField/BaseField';

export default <T extends FieldValues>({
  forwardEvents = false,
  control,
  name,
  label,
  controlClassName = '',
  mode,
  rules,
  formItemProps,
  ...rest
}: FormSelectProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control, rules });

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
        <Select
          data-cy="form-select"
          mode={mode}
          {...rest}
          {...field}
          {...accessibility}
          onBlur={(event) => {
            field.onBlur();
            if (forwardEvents) rest.onBlur?.(event);
          }}
          onChange={(value, option) => {
            const finalValue = value === undefined ? null : value;
            field.onChange(finalValue);
            if (rest.onChange) {
              rest.onChange(finalValue, option);
            }
          }}
        />
      )}
    </BaseField>
  );
};
