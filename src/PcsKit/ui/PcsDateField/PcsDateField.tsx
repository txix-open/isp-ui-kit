import { DatePicker } from 'antd';
import type { DatePickerProps } from 'antd';
import type { Dayjs } from 'dayjs';

import type { PcsFieldSize } from '../../types/pcsField.types';

import { PcsCalendarIcon } from '../../assets/icons';

import './PcsDateField.scss';

export interface PcsDateFieldProps extends Omit<
  DatePickerProps,
  'onChange' | 'value' | 'size'
> {
  errorText?: string;
  size?: PcsFieldSize;
  value?: Dayjs | null;
  onChange?: (value: Dayjs | null) => void;
}

const PcsDateField = ({
  className,
  classNames,
  errorText,
  format,
  popupClassName,
  showTime,
  size = 'md',
  value,
  onChange,
  ...props
}: PcsDateFieldProps) => {
  const rootClassName = ['pcs-date-field-wrapper', className]
    .filter(Boolean)
    .join(' ');

  const pickerClassName = [
    'pcs-date-field',
    `pcs-date-field--${size}`,
    errorText && 'pcs-date-field--error',
  ]
    .filter(Boolean)
    .join(' ');

  const suffixIcon = (
    <PcsCalendarIcon className="pcs-date-field__icon" aria-hidden="true" />
  );

  const popupRootClassName = ['pcs-date-field-dropdown', popupClassName]
    .filter(Boolean)
    .join(' ');
  const popupClassNames =
    typeof classNames === 'function' ? undefined : classNames?.popup;
  const popupUserRootClassName =
    typeof popupClassNames === 'object'
      ? popupClassNames.root
      : popupClassNames;
  const pickerClassNames =
    typeof classNames === 'function'
      ? classNames
      : {
          ...classNames,
          popup: {
            ...(typeof popupClassNames === 'object' ? popupClassNames : {}),
            root: [popupRootClassName, popupUserRootClassName]
              .filter(Boolean)
              .join(' '),
          },
        };

  const dateFormat = format ?? (showTime ? 'DD.MM.YYYY HH:mm' : 'DD.MM.YYYY');

  return (
    <div className={rootClassName}>
      <DatePicker
        {...props}
        className={pickerClassName}
        classNames={pickerClassNames}
        format={dateFormat}
        showTime={showTime}
        status={errorText ? 'error' : props.status}
        suffixIcon={props.suffixIcon ?? suffixIcon}
        value={value ?? null}
        onChange={(nextDate) => {
          onChange?.(Array.isArray(nextDate) ? null : nextDate);
        }}
      />

      {errorText && <span className="pcs-date-field-error">{errorText}</span>}
    </div>
  );
};

export default PcsDateField;
