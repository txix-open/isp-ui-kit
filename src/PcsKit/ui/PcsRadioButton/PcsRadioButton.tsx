import type { PcsFieldSize } from '../../types/pcsField.types';

import './PcsRadioButton.scss';

export interface PcsRadioButtonProps {
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  name?: string;
  value?: string;
  className?: string;
  size?: PcsFieldSize;
  isValid?: boolean;
  failure?: string;
  onChange?: (checked: boolean) => void;
}

const PcsRadioButton = ({
  label,
  checked = false,
  disabled = false,
  readonly = false,
  name,
  value,
  className,
  size = 'md',
  isValid = true,
  failure,
  onChange,
}: PcsRadioButtonProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (readonly) return;
    onChange?.(event.target.checked);
  };

  const stopEventBubbling = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <div className={className} onClick={stopEventBubbling}>
      <label
        className={[
          'pcs-radio-button',
          `pcs-radio-button--${size}`,
          readonly && 'pcs-radio-button--readonly',
          disabled && 'pcs-radio-button--disabled',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <input
          checked={checked}
          className="pcs-radio-button__native"
          disabled={disabled}
          name={name}
          type="radio"
          value={value}
          onChange={handleChange}
          onClick={stopEventBubbling}
        />
        <span className="pcs-radio-button__control" aria-hidden="true">
          <span className="pcs-radio-button__marker" />
        </span>
        {label && <span className="pcs-radio-button__label">{label}</span>}
      </label>
      {!isValid && <div className="pcs-radio-button__failure">{failure}</div>}
    </div>
  );
};

export default PcsRadioButton;
