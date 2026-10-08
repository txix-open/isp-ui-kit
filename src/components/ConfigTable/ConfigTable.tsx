import { Button, Empty, Input, Table } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import ruRU from 'antd/locale/ru_RU';
import { useEffect, useState } from 'react';

import { ConfigTableProps } from './config-table.type';

import './config-table.scss';

const { Search } = Input;

const ConfigTable = ({
  appearance = 'modern',
  searchValue,
  totalItemsCount,
  filteredItemsCount,
  onResetSearch,
  selectionActions,
  onClearSelection,
  onSearch,
  onClickBtn,
  textBtn = '',
  placeholderSearch = '',
  isAddBtn = true,
  isSearch = true,
  dataSource = [],
  className,
  ...rest
}: ConfigTableProps) => {
  const [draft, setDraft] = useState(searchValue ?? '');
  const [submitted, setSubmitted] = useState('');
  useEffect(() => {
    if (searchValue !== undefined) setDraft(searchValue);
  }, [searchValue]);
  const query = searchValue ?? submitted;
  const searching = query.trim().length > 0;
  const selectedCount = rest.rowSelection?.selectedRowKeys?.length ?? 0;
  const resetSearch = () => {
    setDraft('');
    setSubmitted('');
    if (onResetSearch) onResetSearch();
    else onSearch?.('');
  };
  return (
    <section
      className={`config-table-wrapper config-table-wrapper--${appearance}`}
    >
      {(isSearch || isAddBtn) && (
        <header className="config-table-wrapper__header">
          {isSearch && (
            <Search
              className="config-table-wrapper__header__search"
              placeholder={
                placeholderSearch
                  ? placeholderSearch
                  : 'Введите текст для поиска по всем полям'
              }
              aria-label={placeholderSearch || 'Поиск по таблице'}
              prefix={
                appearance === 'modern' ? (
                  <SearchOutlined aria-hidden="true" />
                ) : undefined
              }
              allowClear={appearance === 'modern'}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              enterButton={appearance === 'modern' ? 'Найти' : 'Search'}
              onSearch={(value) => {
                setSubmitted(value);
                onSearch?.(value);
              }}
            />
          )}
          {isAddBtn && (
            <Button
              className="config-table-wrapper__header__btn"
              data-testid="configTable_btn_add"
              onClick={onClickBtn}
              type="primary"
              icon={appearance === 'modern' ? <PlusOutlined /> : undefined}
            >
              {textBtn ? textBtn : 'Добавить новый элемент'}
            </Button>
          )}
        </header>
      )}
      {appearance === 'modern' && totalItemsCount !== undefined && (
        <div className="config-table-wrapper__summary" role="status">
          {searching
            ? `Найдено ${filteredItemsCount ?? dataSource.length} из ${totalItemsCount}`
            : `Всего записей: ${totalItemsCount}`}
        </div>
      )}
      {appearance === 'modern' && selectedCount > 0 && (
        <div className="config-table-wrapper__selection">
          <span role="status">Выбрано: {selectedCount}</span>
          {selectionActions}
          {onClearSelection && (
            <Button type="text" onClick={onClearSelection}>
              Снять выбор
            </Button>
          )}
        </div>
      )}
      <Table
        className={['config-table-wrapper__table', className]
          .filter(Boolean)
          .join(' ')}
        size={appearance === 'modern' ? 'small' : undefined}
        scroll={appearance === 'modern' ? { x: 'max-content' } : undefined}
        locale={
          appearance === 'modern'
            ? {
                ...ruRU.Table,
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      searching ? 'Ничего не найдено' : 'Данных пока нет'
                    }
                  >
                    {searching && (
                      <Button onClick={resetSearch}>Сбросить поиск</Button>
                    )}
                  </Empty>
                ),
              }
            : undefined
        }
        pagination={{
          total: dataSource?.length,
          locale: appearance === 'modern' ? ruRU.Pagination : undefined,
          showTotal: (total: number) => `Всего записей: ${total}`,
        }}
        dataSource={dataSource}
        {...rest}
      />
    </section>
  );
};

export default ConfigTable;
