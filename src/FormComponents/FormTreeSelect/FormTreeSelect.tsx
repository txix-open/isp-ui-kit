import { TreeSelect } from 'antd';
import { FieldValues, useController } from 'react-hook-form';

import { FormTreeSelectProps } from './form-tree-select.type';
import BaseField from '../BaseField/BaseField';

export default <T extends FieldValues>({
  forwardEvents = false,
  control,
  name,
  label,
  controlClassName = '',
  rules,
  formItemProps,
  ...rest
}: FormTreeSelectProps<T>) => {
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
      controlClassName={['form-tree-select', controlClassName]
        .filter(Boolean)
        .join(' ')}
      formItemProps={formItemProps}
      describedBy={rest['aria-describedby']}
    >
      {(accessibility) => (
        <TreeSelect
          {...rest}
          {...field}
          {...accessibility}
          onChange={(value, labelList, extra) => {
            field.onChange(value);
            if (forwardEvents) rest.onChange?.(value, labelList, extra);
          }}
          onBlur={(event) => {
            field.onBlur();
            if (forwardEvents) rest.onBlur?.(event);
          }}
        />
      )}
    </BaseField>
  );
};
