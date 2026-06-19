import { Input } from 'antd';
import type { TextAreaProps } from 'antd/es/input';

import './PcsTextAreaField.scss';

const { TextArea } = Input;

export interface PcsTextAreaFieldProps extends Omit<
  TextAreaProps,
  'onChange' | 'value'
> {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  errorText?: string;
}

const PcsTextAreaField = ({
  label,
  value,
  onChange,
  errorText,
  className,
  ...props
}: PcsTextAreaFieldProps) => (
  <div
    className={['pcs-textarea-field-wrapper', className]
      .filter(Boolean)
      .join(' ')}
  >
    {label && <label className="pcs-textarea-field-label">{label}</label>}

    <TextArea
      {...props}
      className={[
        'pcs-textarea-field',
        errorText && 'pcs-textarea-field--error',
      ]
        .filter(Boolean)
        .join(' ')}
      status={errorText ? 'error' : props.status}
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
    />

    {errorText && <span className="pcs-textarea-field-error">{errorText}</span>}
  </div>
);

export default PcsTextAreaField;
