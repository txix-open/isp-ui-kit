import { Button, Input, Table } from 'antd';

import { ConfigTableProps } from './config-table.type';

import './config-table.scss';

const { Search } = Input;

const ConfigTable = ({
  onSearch,
  onClickBtn,
  textBtn = '',
  placeholderSearch = '',
  isAddBtn = true,
  isSearch = true,
  dataSource = [],
  ...rest
}: ConfigTableProps) => {
  return (
    <section className="config-table-wrapper">
      <header className="config-table-wrapper__header">
        {isSearch && (
          <Search
            className="config-table-wrapper__header__search"
            placeholder={
              placeholderSearch
                ? placeholderSearch
                : 'Введите текст для поиска по всем полям'
            }
            enterButton="Search"
            onSearch={onSearch}
          />
        )}
        {isAddBtn && (
          <Button
            className="config-table-wrapper__header__btn"
            data-testid="configTable_btn_add"
            onClick={onClickBtn}
            type="primary"
          >
            {textBtn ? textBtn : 'Добавить новый элемент'}
          </Button>
        )}
      </header>
      <Table
        className="config-table-wrapper__table"
        pagination={{
          total: dataSource?.length,
          showTotal: (total: number) => `Всего записей: ${total}`,
        }}
        dataSource={dataSource}
        {...rest}
      />
    </section>
  );
};

export default ConfigTable;
