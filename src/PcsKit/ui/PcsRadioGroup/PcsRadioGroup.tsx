import { useId } from 'react';

import type { PcsFieldSize } from '../../types/pcsField.types';

import './PcsRadioGroup.scss';

export interface PcsRadioGroupOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface PcsRadioGroupProps {
  className?: string;
  name?: string;
  options?: PcsRadioGroupOption[];
  value?: string;
  size?: PcsFieldSize;
  onChange?: (value: string | undefined) => void;
}

const PcsRadioGroup = ({
  className,
  name,
  options = [],
  value,
  size = 'md',
  onChange,
}: PcsRadioGroupProps) => {
  const generatedName = useId();
  const radioName = name || generatedName;

  const handleChange = (nextValue: string, checked: boolean) => {
    if (checked) {
      onChange?.(nextValue);
    }
  };

  return (
    <div className={['pcs-radio-group', className].filter(Boolean).join(' ')}>
      {options.map((option) => (
        <label
          key={option.value}
          className={[
            'pcs-radio-group__option',
            `pcs-radio-group__option--${size}`,
            option.disabled && 'pcs-radio-group__option--disabled',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <input
            checked={value === option.value}
            className="pcs-radio-group__native"
            disabled={option.disabled}
            name={radioName}
            type="radio"
            value={option.value}
            onChange={(event) =>
              handleChange(option.value, event.target.checked)
            }
          />
          <span className="pcs-radio-group__control" aria-hidden="true">
            <span className="pcs-radio-group__marker" />
          </span>
          <span className="pcs-radio-group__label">{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default PcsRadioGroup;
