import { DatePicker } from 'antd';
import { FieldValues, useController } from 'react-hook-form';
import { FormRangeDatePickerProps } from './form-range-date-picker.type';
import dayjs from '../../cfg/dayjs-config';
import BaseField from '../BaseField/BaseField';
import ru from 'antd/es/date-picker/locale/ru_RU';

const { RangePicker } = DatePicker;

export default function FormRangeDatePicker<T extends FieldValues>({
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
}: FormRangeDatePickerProps<T>) {
  const {
    field: { value, onChange, ...fieldRest },
    fieldState: { error },
  } = useController({ name, control, rules });

  const dateFormat = format || 'DD.MM.YYYY';
  const defaultSaveDateFormat = saveDateFormat || 'YYYY-MM-DDTHH:mm:ssZ';

  const formattedValue = value
    ? value.map((date: string) => dayjs(date))
    : undefined;

  const saveDate = (dates: (dayjs.Dayjs | null)[] | null) => {
    const formattedDates: string[] | undefined = dates
      ? dates.map((date) =>
          dayjs(date).tz('Europe/Moscow').format(defaultSaveDateFormat),
        )
      : undefined;
    onChange(formattedDates);
  };

  return (
    <BaseField
      wrapperClassName="form-range-date-picker"
      id={typeof rest.id === 'string' ? rest.id : rest.id?.start}
      label={label}
      required={Boolean(rules?.required?.value)}
      error={error}
      controlClassName={controlClassName}
      formItemProps={formItemProps}
      describedBy={rest['aria-describedby']}
    >
      {(accessibility) => (
        <RangePicker
          locale={ru}
          format={dateFormat}
          value={formattedValue}
          {...rest}
          {...fieldRest}
          {...accessibility}
          id={rest.id ?? accessibility.id}
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
