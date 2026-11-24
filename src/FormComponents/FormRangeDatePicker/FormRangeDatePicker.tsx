import { DatePicker } from 'antd';
import { FieldValues, useController, useWatch } from 'react-hook-form';
import { FormRangeDatePickerProps } from './form-range-date-picker.type';
import dayjs from '../../cfg/dayjs-config';
import BaseField from '../BaseField/BaseField';
import { ruRU } from '../../cfg/antd-locale';

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
    field,
    fieldState: { error },
  } = useController({ name, control, rules });
  // useController falls back to defaultValues when a cleared value is undefined.
  const value = useWatch({ name, control, exact: true });

  const dateFormat = format || 'DD.MM.YYYY';
  const defaultSaveDateFormat = saveDateFormat || 'YYYY-MM-DDTHH:mm:ssZ';

  const formattedValue = value
    ? value.map((date: string | null) => (date == null ? null : dayjs(date)))
    : null;

  const saveDate = (dates: (dayjs.Dayjs | null)[] | null) => {
    const formattedDates: (string | null)[] | undefined = dates
      ? dates.map((date) =>
          date == null
            ? null
            : dayjs(date).tz('Europe/Moscow').format(defaultSaveDateFormat),
        )
      : undefined;
    field.onChange(formattedDates);
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
          locale={ruRU.DatePicker}
          format={dateFormat}
          {...rest}
          {...field}
          {...accessibility}
          value={rest.value !== undefined ? rest.value : formattedValue}
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
            field.onBlur();
            if (forwardEvents) rest.onBlur?.(...args);
          }}
        />
      )}
    </BaseField>
  );
}
