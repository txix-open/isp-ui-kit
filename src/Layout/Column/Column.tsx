import { DeleteOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { Button, List, Popconfirm } from 'antd';
import { ChangeEvent, createRef, RefObject, useEffect } from 'react';
import SimpleBar from 'simplebar-react';
import { ColumnProps } from './column.type';
import SearchInput from '../../SearchInput/SearchInput';

import './column.scss';

const Column = <T extends {}>({
  items = [],
  onAddItem = () => {},
  onRemoveItem = () => {},
  showRemoveBtn = true,
  showAddBtn = true,
  selectedItemId,
  setSelectedItemId,
  searchValue,
  onChangeSearchValue,
  renderItems,
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

  return (
    <section data-cy="firstColumn" className="column">
      <div className="column__header">
        <div className="column__header__actions">
          <SearchInput
            data-cy="searchInput"
            value={searchValue}
            onChange={handleOnChange}
          />
          {showAddBtn && (
            <Button
              data-cy="onAddItem"
              onClick={onAddItem}
              icon={<PlusSquareOutlined />}
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
        </div>
      </div>
      <SimpleBar className="column__items">
        <List
          dataSource={items}
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
    </section>
  );
};

export default Column;
