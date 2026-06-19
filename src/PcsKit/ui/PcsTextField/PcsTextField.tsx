import { Input } from 'antd';
import type { InputProps } from 'antd';

import type { PcsFieldSize } from '../../types/pcsField.types';

import './PcsTextField.scss';

export type PcsTextFieldProps = Omit<
  InputProps,
  'onChange' | 'value' | 'size'
> & {
  label?: string;
  value?: string;
  size?: PcsFieldSize;
  validatePattern?: RegExp;
  customValidator?: (value: string) => string | null;
  onChange?: (value: string, error?: string) => void;
  errorText?: string;
};

const PcsTextField = ({
  label,
  value,
  validatePattern,
  customValidator,
  onChange,
  errorText: externalErrorText,
  className,
  placeholder,
  size = 'md',
  ...props
}: PcsTextFieldProps) => {
  const currentValue = value ?? '';
  const hasPlaceholder = Boolean(placeholder);
  const isPlaceholderCaption = hasPlaceholder && currentValue.length > 0;
  const hasLabel = Boolean(label && !hasPlaceholder);

  const validate = (nextValue: string): string | null => {
    if (externalErrorText) return externalErrorText;

    if (validatePattern && !validatePattern.test(nextValue)) {
      return 'Неверный формат данных';
    }

    return customValidator?.(nextValue) || null;
  };

  const errorText = validate(currentValue);
  const hasError = Boolean(errorText || props.status === 'error');
  const rootClassName = [
    'pcs-text-field-wrapper',
    `pcs-text-field-wrapper--${size}`,
    (hasLabel || errorText) &&
      !hasPlaceholder &&
      'pcs-text-field-wrapper--form',
    hasPlaceholder && 'pcs-text-field-wrapper--placeholder',
    isPlaceholderCaption && 'pcs-text-field-wrapper--placeholder-caption',
    hasError && 'pcs-text-field-wrapper--error',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const inputClassName = [
    'pcs-text-field',
    `pcs-text-field--${size}`,
    (hasLabel || errorText) && !hasPlaceholder && 'pcs-text-field--form',
    hasPlaceholder && 'pcs-text-field--placeholder',
    isPlaceholderCaption && 'pcs-text-field--placeholder-caption',
    hasError && 'pcs-text-field--error',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClassName}>
      {hasLabel && <label className="pcs-text-field-label">{label}</label>}
      {placeholder && (
        <span className="pcs-text-field-placeholder">{placeholder}</span>
      )}

      <Input
        {...props}
        className={inputClassName}
        placeholder={undefined}
        status={hasError ? 'error' : props.status}
        value={currentValue}
        onChange={(event) => {
          const nextValue = event.target.value;
          const nextError = validate(nextValue);

          onChange?.(nextValue, nextError || undefined);
        }}
      />

      {errorText && <span className="pcs-text-field-error">{errorText}</span>}
    </div>
  );
};

export default PcsTextField;
