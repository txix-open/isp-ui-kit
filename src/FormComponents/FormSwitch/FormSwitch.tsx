import { Switch } from 'antd';
import { FieldValues, useController } from 'react-hook-form';
import { FormSwitchProps } from './form-switch.type';
import BaseField from '../BaseField/BaseField';
import './form-switch.style.scss';
import type { FocusEvent } from 'react';

export default <T extends FieldValues>({
  control,
  name,
  label,
  rules,
  formItemProps,
  controlClassName,
  forwardEvents = false,
  ...rest
}: FormSwitchProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control, rules });
  const blurHandler = {
    onBlur: (event: FocusEvent<HTMLButtonElement>) => {
      field.onBlur();
      if (forwardEvents) rest.onBlur?.(event);
    },
  };
  return (
    <BaseField
      id={rest.id}
      label={label}
      required={Boolean(rules?.required?.value)}
      error={error}
      controlClassName={controlClassName}
      formItemProps={{
        labelCol: undefined,
        valuePropName: 'checked',
        ...formItemProps,
      }}
      describedBy={rest['aria-describedby']}
    >
      {(accessibility) => (
        <div className="form-switch">
          <Switch
            {...rest}
            checked={field.value}
            {...field}
            {...accessibility}
            onChange={(checked, event) => {
              field.onChange(checked);
              if (forwardEvents) rest.onChange?.(checked, event);
            }}
            {...blurHandler}
          />
        </div>
      )}
    </BaseField>
  );
};
