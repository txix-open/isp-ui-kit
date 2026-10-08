import { Radio } from 'antd';
import { FieldValues, useController } from 'react-hook-form';
import { FormRadioGroupProps } from './form-radio-group.type';
import BaseField from '../BaseField/BaseField';
import { LabelItem } from '../formTypes';

export default <T extends FieldValues>({
  forwardEvents = false,
  control,
  name,
  label,
  controlClassName,
  rules,
  type = 'radio',
  items,
  formItemProps,
  ...rest
}: FormRadioGroupProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control, rules });

  const renderItems = () =>
    items.map((item: LabelItem) => {
      if (type === 'button') {
        return (
          <Radio.Button key={item.value} value={item.value}>
            {item.label}
          </Radio.Button>
        );
      }
      return (
        <Radio key={item.value} value={item.value}>
          {item.label}
        </Radio>
      );
    });

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
        <Radio.Group
          {...rest}
          {...field}
          {...accessibility}
          role="radiogroup"
          ref={(node) =>
            field.ref({
              focus: () =>
                node
                  ?.querySelector<HTMLInputElement>('input:not(:disabled)')
                  ?.focus(),
            })
          }
          onChange={(event) => {
            field.onChange(event);
            if (forwardEvents) rest.onChange?.(event);
          }}
          onBlur={(event) => {
            field.onBlur();
            if (forwardEvents) rest.onBlur?.(event);
          }}
        >
          {renderItems()}
        </Radio.Group>
      )}
    </BaseField>
  );
};
