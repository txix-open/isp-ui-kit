import {
  DeleteOutlined,
  EditOutlined,
  PlusSquareOutlined,
} from '@ant-design/icons';
import { Button, List, Popconfirm, Tooltip } from 'antd';
import { ChangeEvent, createRef, RefObject, useEffect, useState } from 'react';
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
  isSortByName = true,
  selectedItemId,
  setSelectedItemId,
  searchValue,
  onChangeSearchValue,
  renderItems,
  columnKey,
}: ColumnProps<T>) => {
  const isDisabled = !selectedItemId;
  const refs: Record<string, RefObject<HTMLDivElement>> = items.reduce(
    (acc: Record<string, RefObject<HTMLDivElement>>, value) => {
      acc[value.id] = createRef<HTMLDivElement>();
      return acc;
    },
    {},
  );
  const itemsCount = items.length;
  const [currentColumnWidth, setCurrentColumnWidth] = useState<number>(300);

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
    const currentRef = refs[selectedItemId];
    if (currentRef) {
      setTimeout(() => {
        if (currentRef.current) {
          currentRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest',
          });
        }
      }, 100);
    }
  }, []);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) =>
    onChangeSearchValue(e.target.value, e);

  const handleRemove = () => {
    onRemoveItem(selectedItemId);
  };

  const checkIsActive = (id: string | number): boolean =>
    id.toString() === selectedItemId;

  function sortByName(arr: ColumnItem<T>[]) {
    return arr.slice().sort((a, b) => a.name.localeCompare(b.name));
  }

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
            {itemsCount > 0 && (
              <span className="column__header__wrap__count">
                {itemsCount +
                  ' ' +
                  pluralize(itemsCount, ['элемент', 'элемента', 'элементов'])}
              </span>
            )}
          </div>
        )}
        <div className="column__header__actions">
          <SearchInput
            placeholder={searchPlaceholder}
            data-cy="searchInput"
            value={searchValue}
            onChange={handleOnChange}
          />
          <Button.Group className="button_group">
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
                onConfirm={handleRemove}
                title="Вы действительно хотите удалить этот элемент?"
              >
                <Button
                  data-cy="removeItem"
                  disabled={isDisabled}
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
            )}
          </Button.Group>
        </div>
      </div>
      <SimpleBar className="column__items">
        <List
          dataSource={isSortByName ? sortByName(items) : items}
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
