import { Dropdown } from 'antd';
import { useMemo, useState } from 'react';

import type { PcsFieldSize } from '../../types/pcsField.types';

import './PcsSelectMultipleField.scss';

export interface PcsSelectMultipleFieldOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface PcsSelectMultipleFieldProps {
  options?: PcsSelectMultipleFieldOption[];
  placeholder?: string;
  value?: string[];
  size?: PcsFieldSize;
  controlType?: 'checkbox' | 'radio';
  onChange?: (value: string[] | undefined) => void;
}

const EMPTY_OPTIONS: PcsSelectMultipleFieldOption[] = [];

const getValueLabel = (
  options: PcsSelectMultipleFieldOption[],
  value?: string[],
) => {
  if (!value?.length) return undefined;

  if (value.length === 1) {
    return options.find((option) => option.value === value[0])?.label;
  }

  return `${value.length} выбрано`;
};

const PcsSelectMultipleField = ({
  options = EMPTY_OPTIONS,
  placeholder,
  value,
  size = 'md',
  controlType = 'checkbox',
  onChange,
}: PcsSelectMultipleFieldProps) => {
  const [open, setOpen] = useState(false);

  const selectedValues = useMemo(() => value || [], [value]);
  const visibleValue = getValueLabel(options, value) || placeholder;

  const handleSelect = (nextValue: string, checked: boolean) => {
    if (controlType === 'radio') {
      onChange?.([nextValue]);
      return;
    }

    const nextValues = checked
      ? [...selectedValues, nextValue]
      : selectedValues.filter((selectedValue) => selectedValue !== nextValue);

    onChange?.(nextValues.length ? nextValues : undefined);
  };

  const stopEventBubbling = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const dropdownContent = (
    <div className="pcs-select-multiple-field__dropdown">
      <div className="pcs-select-multiple-field__list">
        {options.length ? (
          options.map((option) => {
            const checked = selectedValues.includes(option.value);

            return (
              <label
                key={option.value}
                className={[
                  'pcs-select-multiple-field__option',
                  `pcs-select-multiple-field__option--${controlType}`,
                  option.disabled &&
                    'pcs-select-multiple-field__option--disabled',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={stopEventBubbling}
              >
                <input
                  className="pcs-select-multiple-field__native"
                  checked={checked}
                  disabled={option.disabled}
                  type={controlType}
                  onChange={(event) =>
                    handleSelect(option.value, event.target.checked)
                  }
                  onClick={stopEventBubbling}
                />
                <span className="pcs-select-multiple-field__square">
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
                <span className="pcs-select-multiple-field__label">
                  {option.label}
                </span>
              </label>
            );
          })
        ) : (
          <div className="pcs-select-multiple-field__empty">Нет данных</div>
        )}
      </div>

      <div className="pcs-select-multiple-field__footer">
        <button
          className="pcs-select-multiple-field__apply"
          type="button"
          onClick={() => setOpen(false)}
        >
          Готово
        </button>
      </div>
    </div>
  );

  return (
    <Dropdown
      open={open}
      onOpenChange={setOpen}
      classNames={{ root: 'pcs-select-multiple-field__overlay' }}
      placement="bottomLeft"
      popupRender={() => dropdownContent}
      trigger={['click']}
    >
      <button
        className={[
          'pcs-select-multiple-field',
          `pcs-select-multiple-field--${size}`,
          open && 'pcs-select-multiple-field--open',
          visibleValue === placeholder &&
            'pcs-select-multiple-field--placeholder',
        ]
          .filter(Boolean)
          .join(' ')}
        type="button"
      >
        <span className="pcs-select-multiple-field__value">{visibleValue}</span>
        <span className="pcs-select-multiple-field__caret" />
      </button>
    </Dropdown>
  );
};

export default PcsSelectMultipleField;
