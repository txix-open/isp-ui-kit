import { DatePicker, Form } from 'antd';
import { FieldValues, useController } from 'react-hook-form';
import { FormRangeDatePickerProps } from './form-range-date-picker.type';
import dayjs from '../../cfg/dayjs-config';
import ru from 'antd/es/date-picker/locale/ru_RU';

const { RangePicker } = DatePicker;

export default function FormRangeDatePicker<T extends FieldValues>({
  control,
  name,
  rules,
  label,
  controlClassName = '',
  format,
  saveDateFormat,
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

  return (
    <div
      className={`form-range-date-picker ${
        rules?.required?.value ? 'requiredInput' : ''
      }`}
    >
      <Form.Item
        className={controlClassName}
        labelCol={{ span: 24 }}
        label={label}
        validateStatus={error && 'error'}
        help={error && error.message}
      >
        <RangePicker
          locale={ru}
          format={dateFormat}
          value={formattedValue}
          onChange={(dates) => {
            const formattedDates: string[] | undefined = dates
              ? dates.map((date) =>
                  dayjs(date).tz('Europe/Moscow').format(defaultSaveDateFormat),
                )
              : undefined;
            onChange(formattedDates);
          }}
          {...rest}
          {...fieldRest}
        />
      </Form.Item>
    </div>
  );
}
