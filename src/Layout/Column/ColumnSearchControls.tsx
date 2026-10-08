import { Select } from 'antd';
import { ColumnSearchControlsProps } from './column.type';

const ColumnSearchControls = <T extends object>({
  searchFields = [],
  searchFieldValue,
  searchOptions,
  onSearchChange,
}: ColumnSearchControlsProps<T>) => {
  if (searchFields.length === 0) {
    return null;
  }

  return (
    <div className="column__header__sort-controls">
      <div className="column__header__sort-controls__sort-select">
        <span className="column__header__sort-controls__sort-select__label">
          Поиск
        </span>
        <Select
          aria-label="Поле поиска"
          placeholder="Выберите поле"
          variant="borderless"
          size="small"
          value={String(searchFieldValue ?? searchOptions[0]?.value ?? '')}
          onChange={onSearchChange}
          options={searchOptions}
        />
      </div>
    </div>
  );
};

export default ColumnSearchControls;
