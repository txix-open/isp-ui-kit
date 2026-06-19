import './PcsCheckboxGroup.scss';

export interface PcsCheckboxGroupOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface PcsCheckboxGroupProps {
  className?: string;
  options?: PcsCheckboxGroupOption[];
  value?: string[];
  onChange?: (value: string[] | undefined) => void;
}

const PcsCheckboxGroup = ({
  className,
  options = [],
  value = [],
  onChange,
}: PcsCheckboxGroupProps) => {
  const handleChange = (nextValue: string, checked: boolean) => {
    const nextValues = checked
      ? [...value, nextValue]
      : value.filter((currentValue) => currentValue !== nextValue);

    onChange?.(nextValues.length ? nextValues : undefined);
  };

  return (
    <div
      className={['pcs-checkbox-group', className].filter(Boolean).join(' ')}
    >
      {options.map((option) => (
        <label
          key={option.value}
          className={[
            'pcs-checkbox-group__option',
            option.disabled && 'pcs-checkbox-group__option--disabled',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <input
            checked={value.includes(option.value)}
            className="pcs-checkbox-group__native"
            disabled={option.disabled}
            type="checkbox"
            onChange={(event) =>
              handleChange(option.value, event.target.checked)
            }
          />
          <span className="pcs-checkbox-group__square">
            <svg
              fill="none"
              height="16"
              stroke="#ff596d"
              strokeWidth="2px"
              viewBox="0 0 16 16"
              width="16"
            >
              <polyline points="13 5 6 12 2 8" />
            </svg>
          </span>
          <span className="pcs-checkbox-group__label">{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default PcsCheckboxGroup;
