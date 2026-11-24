import { Checkbox } from 'antd';
import { FieldValues, useController } from 'react-hook-form';
import { FormCheckboxGroupProps } from './form-checkbox.type';
import BaseField from '../BaseField/BaseField';

export default function FormCheckbox<T extends FieldValues>({
  control,
  name,
  label,
  rules,
  formItemProps,
  controlClassName,
  forwardEvents = false,
  ...rest
}: FormCheckboxGroupProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control, rules });
  return (
    <BaseField
      id={rest.id}
      required={Boolean(rules?.required?.value)}
      error={error}
      controlClassName={controlClassName}
      formItemProps={{ valuePropName: 'checked', ...formItemProps }}
      describedBy={rest['aria-describedby']}
    >
      {(accessibility) => (
        <Checkbox
          {...rest}
          checked={field.value}
          {...field}
          {...accessibility}
          onChange={(event) => {
            field.onChange(event);
            if (forwardEvents) rest.onChange?.(event);
          }}
          onBlur={(event) => {
            field.onBlur();
            if (forwardEvents) rest.onBlur?.(event);
          }}
        >
          {label}
        </Checkbox>
      )}
    </BaseField>
  );
}
