import {
  DeleteOutlined,
  EditOutlined,
  PlusSquareOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from '@ant-design/icons';
import { Button, List, Popconfirm, Tooltip, Select, Space } from 'antd';
import { createRef, RefObject, useEffect, useMemo, useState } from 'react';
import SimpleBar from 'simplebar-react';
import { ResizableBox } from 'react-resizable';
import { ColumnItem, ColumnProps } from './column.type';
import SearchInput from '../../components/SearchInput/SearchInput';
import { pluralize } from '../../utils/columnUtils';
import './column.scss';

const Column = <T extends object>({
  title = '',
  searchPlaceholder = 'Найти элемент',
  items = [],
  onAddItem = () => {},
  onUpdateItem = () => {},
  onRemoveItem = () => {},
  showRemoveBtn = true,
  showUpdateBtn = true,
  showAddBtn = true,
  sortableFields = [],
  selectedItemId,
  setSelectedItemId,
  searchValue,
  onChangeSearchValue,
  renderItems,
  columnKey,
  sortValue,
  onChangeSortValue,
  directionValue,
  onChangeDirectionValue,
  loading = false,
}: ColumnProps<T>) => {
  const isDisabled = !selectedItemId;
  const refs = useMemo(
    () =>
      items.reduce((acc: Record<string, RefObject<HTMLDivElement>>, item) => {
        acc[item.id] = createRef<HTMLDivElement>();
        return acc;
      }, {}),
    [items],
  );
  const [currentColumnWidth, setCurrentColumnWidth] = useState<number>(300);

  const sortOptions = useMemo(() => {
    const defaultOption = { value: 'default', label: 'По умолчанию' };
    return sortableFields.length > 0 ? [defaultOption, ...sortableFields] : [];
  }, [sortableFields]);

  useEffect(() => {
    const initColumnWidth = () => {
      const segments = window.location.pathname.replace(/^\/+/, '').split('/');
      const path = segments[0];
      const storageKey = columnKey ? `${path}_${columnKey}` : path;
      const storedWidth = localStorage.getItem(storageKey);
      if (storedWidth) {
        setCurrentColumnWidth(Number(storedWidth));
      }
    };

    initColumnWidth();
  }, [columnKey]);

  useEffect(() => {
    if (!selectedItemId) {
      return;
    }

    const currentRef = refs[selectedItemId];
    if (currentRef?.current) {
      setTimeout(() => {
        currentRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest',
        });
      }, 100);
    }
  }, [selectedItemId]);

  const handleSortChange = (value: string) => {
    if (value === 'default') {
      onChangeSortValue?.(undefined);
      onChangeDirectionValue?.(undefined);
    } else {
      onChangeSortValue?.(value as keyof T);
      onChangeDirectionValue?.(directionValue || 'asc');
    }
  };

  const sortItems = (arr: ColumnItem<T>[]) => {
    if (!sortValue || !directionValue) {
      return arr;
    }

    return arr.slice().sort((a, b) => {
      const valueA = a[sortValue];
      const valueB = b[sortValue];
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return directionValue === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return directionValue === 'asc' ? valueA - valueB : valueB - valueA;
      }

      return directionValue === 'asc'
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });
  };

  const checkIsActive = (id: string | number): boolean =>
    id.toString() === selectedItemId;

  return (
    <ResizableBox
      minConstraints={[300, 0]}
      className="column"
      width={currentColumnWidth}
      resizeHandles={['e']}
      axis="x"
      data-cy="firstColumn"
      handle={<span className="custom-resize-handle" />}
      onResizeStop={(_, { size }) => {
        setCurrentColumnWidth(size.width);
        const segments = window.location.pathname
          .replace(/^\/+/, '')
          .split('/');
        const path = segments[0];
        const storageKey = columnKey ? `${path}_${columnKey}` : path;
        localStorage.setItem(storageKey, size.width.toString());
      }}
    >
      <div className="column__header">
        {title && (
          <div className="column__header__wrap">
            <Tooltip placement="topLeft" title={title} mouseEnterDelay={1}>
              <h3 className="column__header__wrap__title">{title}</h3>
            </Tooltip>
            {items.length > 0 && (
              <span className="column__header__wrap__count">
                {items.length +
                  ' ' +
                  pluralize(items.length, ['элемент', 'элемента', 'элементов'])}
              </span>
            )}
          </div>
        )}
        <div className="column__header__actions">
          <SearchInput
            placeholder={searchPlaceholder}
            data-cy="searchInput"
            value={searchValue}
            onChange={(e) => onChangeSearchValue(e.target.value, e)}
          />
          <Space.Compact block className="button_group">
            {showAddBtn && (
              <Button
                data-cy="onAddItem"
                onClick={onAddItem}
                icon={<PlusSquareOutlined />}
              />
            )}
            {showUpdateBtn && (
              <Button
                data-cy="showUpdateBtn"
                disabled={isDisabled}
                onClick={() => onUpdateItem(selectedItemId)}
                icon={<EditOutlined />}
              />
            )}
            {showRemoveBtn && (
              <Popconfirm
                disabled={isDisabled}
                onConfirm={() => onRemoveItem(selectedItemId)}
                title="Вы действительно хотите удалить этот элемент?"
              >
                <Button
                  loading={loading}
                  data-cy="removeItem"
                  disabled={isDisabled}
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
            )}
          </Space.Compact>
        </div>
        {sortableFields.length > 0 && (
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
                onChange={handleSortChange}
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
                  ? onChangeDirectionValue(
                      directionValue === 'asc' ? 'desc' : 'asc',
                    )
                  : null
              }
            />
          </div>
        )}
      </div>
      <SimpleBar className="column__items">
        <List
          dataSource={sortItems(items)}
          renderItem={(item) => (
            <div
              aria-hidden="true"
              tabIndex={0}
              role="button"
              data-cy="firstColumnItem"
              ref={refs[item.id]}
              key={item.id}
              className={`column__items__item ${
                checkIsActive(item.id) ? 'active' : ''
              }`}
              onClick={() => setSelectedItemId(item.id.toString())}
              onKeyDown={(e) =>
                e.key === 'Enter' && setSelectedItemId(item.id.toString())
              }
            >
              {renderItems(item)}
            </div>
          )}
        />
      </SimpleBar>
    </ResizableBox>
  );
};

export default Column;
