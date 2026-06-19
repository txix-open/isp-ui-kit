import './PcsToggle.scss';

export interface PcsToggleProps {
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
  label?: string;
}

const PcsToggle = ({
  checked = false,
  disabled = false,
  onChange,
  className,
  label,
}: PcsToggleProps) => {
  const handleChange = () => {
    if (disabled) return;
    onChange?.(!checked);
  };

  return (
    <div className={`pcs-toggle ${className || ''}`}>
      <label className="pcs-toggle__label">
        <input
          type="checkbox"
          className="pcs-toggle__input"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
        />
        <span className="pcs-toggle__control" />
        <span className="pcs-toggle__bg" />
        {label && <span className="pcs-toggle__text">{label}</span>}
      </label>
    </div>
  );
};

export default PcsToggle;
