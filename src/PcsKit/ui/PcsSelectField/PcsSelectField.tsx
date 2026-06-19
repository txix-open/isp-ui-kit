import { Empty, Select } from 'antd';
import type { SelectProps } from 'antd';
import { useMemo, useState } from 'react';

import type {
  PcsSelectFieldChangeValue,
  PcsSelectFieldOption,
  PcsSelectFieldProps,
  PcsSelectFieldValue,
} from './pcsSelectField.types';

import './PcsSelectField.scss';

const { Option } = Select;

const EMPTY_OPTIONS: PcsSelectFieldOption[] = [];

const getOptionValue = (option: PcsSelectFieldOption): PcsSelectFieldValue => {
  const id = (option as { id?: unknown }).id;

  if (typeof id === 'number' || typeof id === 'string') {
    return id;
  }

  const value = (option as { value?: unknown }).value;

  return typeof value === 'number' || typeof value === 'string' ? value : '';
};

const getOptionTitle = (option: PcsSelectFieldOption): string => {
  const title = (option as { title?: unknown }).title;

  if (typeof title === 'string') {
    return title;
  }

  const label = (option as { label?: unknown }).label;

  return typeof label === 'string' ? label : '';
};

const getOptionDescription = (option: PcsSelectFieldOption) =>
  option.description;

const PcsSelectField = ({
  options = EMPTY_OPTIONS,
  label,
  placeholder,
  value,
  onChange,
  showSearch = true,
  filterOption,
  disabled = false,
  errorText,
  className,
  size = 'md',
  width,
  onlyActive = false,
  optionRender,
  mode,
  loading,
  allowClear = true,
}: PcsSelectFieldProps) => {
  const [searchValue, setSearchValue] = useState('');

  const availableOptions = useMemo(
    () =>
      onlyActive
        ? options.filter((option) => option.active !== false)
        : options,
    [onlyActive, options],
  );

  const filteredOptions = useMemo(() => {
    if (!searchValue) return availableOptions;

    const search = searchValue.toLowerCase();

    return availableOptions.filter((option) => {
      if (filterOption) return filterOption(search, option);

      return (
        getOptionTitle(option).toLowerCase().includes(search) ||
        getOptionDescription(option)?.toLowerCase().includes(search)
      );
    });
  }, [availableOptions, filterOption, searchValue]);

  const normalizedValue = value === null ? undefined : value;
  const hasPlaceholder = Boolean(placeholder);
  const hasLabel = Boolean(label && !hasPlaceholder);
  const hasValue = Array.isArray(normalizedValue)
    ? normalizedValue.length > 0
    : normalizedValue !== undefined;

  const handleChange = (
    nextValue: PcsSelectFieldValue | PcsSelectFieldValue[] | undefined,
  ) => {
    onChange?.((nextValue ?? null) as PcsSelectFieldChangeValue);
  };

  const selectProps: SelectProps = {
    allowClear,
    className: [
      'pcs-select-field',
      `pcs-select-field--${size}`,
      hasPlaceholder && 'pcs-select-field--placeholder',
      hasPlaceholder && hasValue && 'pcs-select-field--placeholder-caption',
      errorText && 'pcs-select-field--error',
      className,
    ]
      .filter(Boolean)
      .join(' '),
    classNames: {
      popup: {
        root: 'pcs-select-field-dropdown',
      },
    },
    disabled,
    filterOption: false,
    loading,
    mode,
    notFoundContent:
      filteredOptions.length === 0 ? (
        <Empty description="Нет данных" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : undefined,
    optionLabelProp: 'label',
    placeholder: hasPlaceholder ? undefined : placeholder,
    popupMatchSelectWidth: false,
    showSearch,
    style: { width: width || '100%' },
    value: normalizedValue,
    onChange: handleChange,
    onSearch: setSearchValue,
  };

  return (
    <div
      className={[
        'pcs-select-field-wrapper',
        `pcs-select-field-wrapper--${size}`,
        hasPlaceholder && 'pcs-select-field-wrapper--placeholder',
        hasPlaceholder &&
          hasValue &&
          'pcs-select-field-wrapper--placeholder-caption',
        errorText && 'pcs-select-field-wrapper--error',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {hasLabel && <label className="pcs-select-field-label">{label}</label>}
      {hasPlaceholder && (
        <span className="pcs-select-field-placeholder">{placeholder}</span>
      )}

      <Select {...selectProps}>
        {filteredOptions.map((option) => (
          <Option
            key={getOptionValue(option)}
            className="pcs-select-field-option"
            disabled={option.disabled}
            label={getOptionTitle(option)}
            value={getOptionValue(option)}
          >
            {optionRender ? (
              optionRender(option)
            ) : (
              <div className="pcs-select-field-option__content">
                <div className="pcs-select-field-option__title">
                  {getOptionTitle(option)}
                </div>
                {getOptionDescription(option) && (
                  <div className="pcs-select-field-option__description">
                    {getOptionDescription(option)}
                  </div>
                )}
              </div>
            )}
          </Option>
        ))}
      </Select>

      {errorText && <span className="pcs-select-field-error">{errorText}</span>}
    </div>
  );
};

export default PcsSelectField;
