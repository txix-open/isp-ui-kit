import { DatePicker } from 'antd';
import { FieldValues, useController } from 'react-hook-form';
import { FormDatePickerProps } from './form-date-picker.type';
import dayjs from '../../cfg/dayjs-config';
import BaseField from '../BaseField/BaseField';
import ru from 'antd/es/date-picker/locale/ru_RU';

export default function FormDatePicker<T extends FieldValues>({
  forwardEvents = false,
  control,
  name,
  rules,
  label,
  controlClassName = '',
  format,
  saveDateFormat,
  formItemProps,
  ...rest
}: FormDatePickerProps<T>) {
  const {
    field: { value, onChange, ...fieldRest },
    fieldState: { error },
  } = useController({ name, control, rules });
  const dateFormat = format || 'DD.MM.YYYY';
  const defaultSaveDateFormat = saveDateFormat || 'YYYY-MM-DDTHH:mm:ssZ';

  const saveDate = (date: unknown) => {
    const formattedDate = dayjs.isDayjs(date)
      ? dayjs(date).tz('Europe/Moscow').format(defaultSaveDateFormat)
      : undefined;

    onChange(formattedDate);
  };

  return (
    <BaseField
      id={typeof rest.id === 'string' ? rest.id : undefined}
      label={label}
      required={Boolean(rules?.required?.value)}
      error={error}
      controlClassName={controlClassName}
      formItemProps={formItemProps}
      describedBy={rest['aria-describedby']}
    >
      {(accessibility) => (
        <DatePicker
          locale={ru}
          format={dateFormat}
          value={value ? dayjs(value) : undefined}
          {...rest}
          {...fieldRest}
          {...accessibility}
          onChange={
            forwardEvents
              ? (date, dateString) => {
                  saveDate(date);
                  rest.onChange?.(date, dateString);
                }
              : (rest.onChange ?? saveDate)
          }
          onBlur={(...args) => {
            fieldRest.onBlur();
            if (forwardEvents) rest.onBlur?.(...args);
          }}
        />
      )}
    </BaseField>
  );
}
