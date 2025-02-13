import {
  DeleteOutlined,
  EditOutlined,
  PlusSquareOutlined,
} from '@ant-design/icons';
import { Button, List, Popconfirm, Tooltip } from 'antd';
import { ChangeEvent, createRef, RefObject, useEffect } from 'react';
import SimpleBar from 'simplebar-react';
import { ResizableBox } from 'react-resizable';
import { ColumnItem, ColumnProps } from './column.type';
import SearchInput from '../../components/SearchInput/SearchInput';

import './column.scss';

const Column = <T extends {}>({
  title = '',
  searchPlaceholder = 'Найти элемент',
  items = [],
  onAddItem = () => {},
  onUpdateItem = () => {},
  onRemoveItem = () => {},
  showRemoveBtn = true,
  showUpdateBtn = true,
  showAddBtn = true,
  selectedItemId,
  setSelectedItemId,
  searchValue,
  onChangeSearchValue,
  renderItems,
  isSortByName = true,
}: ColumnProps<T>) => {
  const isDisabled = !selectedItemId;
  const refs: Record<string, RefObject<HTMLDivElement>> = items.reduce(
    (acc: Record<string, RefObject<HTMLDivElement>>, value) => {
      acc[value.id] = createRef<HTMLDivElement>();
      return acc;
    },
    {},
  );

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
      width={300}
      resizeHandles={['e']}
      axis="x"
      data-cy="firstColumn"
    >
      <div className="column__header">
        {title && (
          <Tooltip placement="topLeft" title={title} mouseEnterDelay={1}>
            <h3 className="column__header__title">{title}</h3>
          </Tooltip>
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
