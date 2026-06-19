import './PcsCheckbox.scss';

export interface PcsCheckboxProps {
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
  isValid?: boolean;
  failure?: string;
}

const PcsCheckbox = ({
  label,
  checked = false,
  disabled = false,
  readonly = false,
  onChange,
  className,
  isValid = true,
  failure,
}: PcsCheckboxProps) => {
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
        className={`pcs-checkbox ${readonly ? 'pcs-checkbox__readonly' : ''}`}
        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
      >
        <input
          className="pcs-checkbox__native"
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          onClick={stopEventBubbling}
          disabled={disabled}
        />
        <div className="pcs-checkbox__square">
          <svg
            fill="none"
            stroke="#ff596d"
            strokeWidth="2px"
            viewBox="0 0 16 16"
            width="16"
            height="16"
          >
            <polyline points="13 5 6 12 2 8" />
          </svg>
        </div>
        {label && <span className="pcs-checkbox__label">{label}</span>}
      </label>
      {!isValid && <div className="pcs-checkbox__failure">{failure}</div>}
    </div>
  );
};

export default PcsCheckbox;
