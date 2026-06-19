import { Input } from 'antd';

import type { PcsFieldSize } from '../../types/pcsField.types';

import './PcsNumberRangeField.scss';

export type PcsNumberRangeValue = [string, string];

export interface PcsNumberRangeFieldProps {
  value?: PcsNumberRangeValue;
  size?: PcsFieldSize;
  onChange?: (value: PcsNumberRangeValue) => void;
}

const PcsNumberRangeField = ({
  value,
  size = 'md',
  onChange,
}: PcsNumberRangeFieldProps) => {
  const currentValue: PcsNumberRangeValue = value || ['', ''];

  const handleChange = (index: 0 | 1, nextValue: string) => {
    const nextRange: PcsNumberRangeValue = [...currentValue];
    nextRange[index] = nextValue;
    onChange?.(nextRange);
  };

  return (
    <div className={`pcs-number-range-field pcs-number-range-field--${size}`}>
      <Input
        className="pcs-number-range-field__input"
        inputMode="numeric"
        placeholder="От"
        value={currentValue[0]}
        onChange={(event) => handleChange(0, event.target.value)}
      />
      <Input
        className="pcs-number-range-field__input"
        inputMode="numeric"
        placeholder="До"
        value={currentValue[1]}
        onChange={(event) => handleChange(1, event.target.value)}
      />
    </div>
  );
};

export default PcsNumberRangeField;
