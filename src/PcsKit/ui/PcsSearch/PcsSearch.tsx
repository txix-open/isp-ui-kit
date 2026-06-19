import { Input } from 'antd';
import type { ChangeEvent, KeyboardEvent, ReactNode } from 'react';
import { useState } from 'react';

import { PcsSearchIcon } from '../../assets/icons';

import './PcsSearch.scss';

export interface PcsSearchProps {
  value?: string;
  defaultValue?: string;
  className?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  filterButton?: ReactNode;
}

const PcsSearch = ({
  value,
  defaultValue = '',
  className,
  onChange,
  onSearch,
  onSubmit,
  placeholder = 'Поиск',
  filterButton,
}: PcsSearchProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value ?? internalValue;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;

    if (value === undefined) {
      setInternalValue(nextValue);
    }

    onChange?.(nextValue);
  };

  const handleSearch = () => {
    onSearch?.(currentValue);
    onSubmit?.(currentValue);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const rootClassName = ['pcs-search', className].filter(Boolean).join(' ');

  return (
    <div className={rootClassName}>
      <div className="pcs-search__input-wrapper">
        <Input
          placeholder={placeholder}
          className="pcs-search__input"
          value={currentValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          suffix={filterButton}
        />
        <button
          aria-label="Найти"
          className="pcs-search__button"
          type="button"
          onClick={handleSearch}
        >
          <PcsSearchIcon
            className="pcs-search__button-icon"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
};

export default PcsSearch;
