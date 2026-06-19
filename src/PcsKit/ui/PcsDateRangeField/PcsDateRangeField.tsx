import { DatePicker } from 'antd';
import type { DatePickerProps } from 'antd';
import type { Dayjs } from 'dayjs';

import type { PcsFieldSize } from '../../types/pcsField.types';

import { PcsCalendarIcon } from '../../assets/icons';

import './PcsDateRangeField.scss';

export type PcsDateRangeValue = [Dayjs | null, Dayjs | null];

export interface PcsDateRangeFieldProps extends Omit<
  DatePickerProps,
  'className' | 'onChange' | 'placeholder' | 'size' | 'value'
> {
  className?: string;
  errorText?: string;
  placeholder?: [string, string];
  value?: PcsDateRangeValue;
  size?: PcsFieldSize;
  onChange?: (value: PcsDateRangeValue | undefined) => void;
}

const getCurrentValue = (value?: PcsDateRangeValue): PcsDateRangeValue => [
  value?.[0] || null,
  value?.[1] || null,
];

const PcsDateRangeField = ({
  className,
  classNames,
  errorText,
  format,
  placeholder = ['С', 'До'],
  popupClassName,
  showTime,
  value,
  size = 'md',
  onChange,
  ...props
}: PcsDateRangeFieldProps) => {
  const currentValue = getCurrentValue(value);

  const handleChange = (index: 0 | 1, nextDate: Dayjs | null) => {
    const nextRange: PcsDateRangeValue = [...currentValue];
    nextRange[index] = nextDate;
    onChange?.(nextRange.some(Boolean) ? nextRange : undefined);
  };

  const suffixIcon = (
    <PcsCalendarIcon
      className="pcs-date-range-field__icon"
      aria-hidden="true"
    />
  );
  const dateFormat = format ?? (showTime ? 'DD.MM.YYYY HH:mm' : 'DD.MM.YYYY');
  const rootClassName = [
    'pcs-date-range-field',
    `pcs-date-range-field--${size}`,
    errorText && 'pcs-date-range-field--error',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const popupRootClassName = ['pcs-date-range-field-dropdown', popupClassName]
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

  return (
    <div className="pcs-date-range-field-wrapper">
      <div className={rootClassName}>
        <DatePicker
          {...props}
          className="pcs-date-range-field__picker"
          classNames={pickerClassNames}
          format={dateFormat}
          placeholder={placeholder[0]}
          showTime={showTime}
          status={errorText ? 'error' : props.status}
          suffixIcon={props.suffixIcon ?? suffixIcon}
          value={currentValue[0]}
          onChange={(nextDate) => {
            handleChange(0, Array.isArray(nextDate) ? null : nextDate);
          }}
        />
        <DatePicker
          {...props}
          className="pcs-date-range-field__picker"
          classNames={pickerClassNames}
          format={dateFormat}
          placeholder={placeholder[1]}
          showTime={showTime}
          status={errorText ? 'error' : props.status}
          suffixIcon={props.suffixIcon ?? suffixIcon}
          value={currentValue[1]}
          onChange={(nextDate) => {
            handleChange(1, Array.isArray(nextDate) ? null : nextDate);
          }}
        />
      </div>

      {errorText && (
        <span className="pcs-date-range-field-error">{errorText}</span>
      )}
    </div>
  );
};

export default PcsDateRangeField;
