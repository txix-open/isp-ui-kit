import { DatePicker, Form } from 'antd';
import { FieldValues, useController } from 'react-hook-form';
import { FormDatePickerProps } from './form-date-picker.type';
import dayjs from '../../cfg/dayjs-config';
import ru from 'antd/es/date-picker/locale/ru_RU';

export default function FormDatePicker<T extends FieldValues>({
  control,
  name,
  rules,
  label,
  controlClassName = '',
  format,
  saveDateFormat,
  ...rest
}: FormDatePickerProps<T>) {
  const {
    field: { value, onChange, ...fieldRest },
    fieldState: { error },
  } = useController({ name, control, rules });
  const dateFormat = format || 'DD.MM.YYYY';
  const defaultSaveDateFormat = saveDateFormat || 'YYYY-MM-DDTHH:mm:ssZ';

  return (
    <div className={`${rules?.required?.value ? 'requiredInput' : ''}`}>
      <Form.Item
        className={controlClassName}
        labelCol={{ span: 24 }}
        label={label}
        validateStatus={error && 'error'}
        help={error && error.message}
      >
        <DatePicker
          locale={ru}
          format={dateFormat}
          value={value ? dayjs(value) : undefined}
          onChange={(date) => {
            const formattedDate = date
              ? dayjs(date).tz('Europe/Moscow').format(defaultSaveDateFormat)
              : undefined;

            onChange(formattedDate);
          }}
          {...rest}
          {...fieldRest}
        />
      </Form.Item>
    </div>
  );
}
