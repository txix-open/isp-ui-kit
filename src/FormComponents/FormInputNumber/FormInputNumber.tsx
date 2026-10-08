import { InputNumber } from 'antd';
import { FieldValues, useController } from 'react-hook-form';
import { FormInputNumberProps } from './form-input-number.type';
import BaseField from '../BaseField/BaseField';

export default <T extends FieldValues>({
  forwardEvents = false,
  control,
  name,
  rules,
  label,
  controlClassName = '',
  formItemProps,
  ...rest
}: FormInputNumberProps<T>) => {
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
        <InputNumber
          {...rest}
          {...field}
          {...accessibility}
          onChange={(value) => {
            field.onChange(value);
            if (forwardEvents) rest.onChange?.(value);
          }}
          onBlur={(event) => {
            field.onBlur();
            if (forwardEvents) rest.onBlur?.(event);
          }}
          autoComplete="off"
        />
      )}
    </BaseField>
  );
};
