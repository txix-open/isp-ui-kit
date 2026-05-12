import {
  SortAscendingOutlined,
  SortDescendingOutlined,
} from '@ant-design/icons';
import { Button, Select } from 'antd';
import { ColumnSortControlsProps } from './column.type';

const ColumnSortControls = <T extends object>({
  sortableFields = [],
  sortValue,
  directionValue,
  sortOptions,
  onChangeDirectionValue,
  onSortChange,
}: ColumnSortControlsProps<T>) => {
  if (sortableFields.length === 0) {
    return null;
  }

  return (
    <div className="column__header__sort-controls">
      <div className="column__header__sort-controls__sort-select">
        <span className="column__header__sort-controls__sort-select__label">
          Сортировка
        </span>
        <Select
          placeholder="Выберите поле"
          variant="borderless"
          size="small"
          value={sortValue ? String(sortValue) : 'default'}
          onChange={onSortChange}
          options={sortOptions}
        />
      </div>
      <Button
        className="column__header__sort-controls__button"
        size="small"
        icon={
          directionValue === 'asc' ? (
            <SortDescendingOutlined />
          ) : (
            <SortAscendingOutlined />
          )
        }
        disabled={!sortValue}
        onClick={() =>
          onChangeDirectionValue
            ? onChangeDirectionValue(directionValue === 'asc' ? 'desc' : 'asc')
            : null
        }
      />
    </div>
  );
};

export default ColumnSortControls;
