import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { List, Tooltip } from 'antd';
import { Column, NoData, EmptyData } from '../../Layout';
import '../styleConst.css';
const meta = {
  title: 'Layout/ThreeColumns',
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const renderColumnItems = (item: any) => (
  <List.Item>
    <Tooltip mouseEnterDelay={1} title={item.name}>
      <List.Item.Meta title={item.name} description={item.name} />
    </Tooltip>
  </List.Item>
);

/* -------------------------------------------------------------------------- */
/*                          Объединённый пример Layout + NoData               */
/* -------------------------------------------------------------------------- */

export const CombinedLayout: Story = {
  name: 'Комбинированный пример',
  args: {
    title: 'Комбинированный пример',
    showAddBtn: true,
    showUpdateBtn: true,
    showRemoveBtn: true,
  },
  render: (args: any) => {
    const [selectedId, setSelectedId] = useState<string>();
    const [searchValue, setSearchValue] = useState('');

    const items = [
      { id: '1', name: 'Первый элемент' },
      { id: '2', name: 'Второй элемент' },
    ];

    const isEmpty = items.length === 0;

    return (
      <div style={{ display: 'flex', gap: 24 }}>
        <Column
          {...args}
          items={items}
          selectedItemId={selectedId}
          setSelectedItemId={setSelectedId}
          searchValue={searchValue}
          onChangeSearchValue={setSearchValue}
          renderItems={renderColumnItems}
        />

        {/* Вторая колонка: выводим NoData, чтобы показать пустой стейт */}
        <div style={{ minWidth: 240 }}>
          {isEmpty ? <NoData /> : <NoData title="Пример пустого блока" />}
        </div>
      </div>
    );
  },
};

/* -------------------------------------------------------------------------- */
/* 2. Column + EmptyData                                                       */
/* -------------------------------------------------------------------------- */
export const CombinedColumnWithEmptyData: Story = {
  name: 'Колонка + EmptyData',
  args: {
    title: 'Колонка + EmptyData',
    showAddBtn: true,
    showUpdateBtn: true,
    showRemoveBtn: true,
  },
  render: (args: any) => {
    const [selected, setSelected] = useState<string>();
    const [search, setSearch] = useState('');

    const items = [
      { id: '1', name: 'Item A' },
      { id: '2', name: 'Item B' },
    ];

    return (
      <div style={{ display: 'flex', gap: 24 }}>
        <Column
          {...args}
          items={items}
          selectedItemId={selected}
          setSelectedItemId={setSelected}
          searchValue={search}
          onChangeSearchValue={setSearch}
          renderItems={renderColumnItems}
        />
        <EmptyData />
      </div>
    );
  },
};
