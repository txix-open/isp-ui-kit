import type { Meta, StoryObj } from '@storybook/react-vite';
import { Column } from '../../../Layout';
import { useState } from 'react';
import { List, Tooltip } from 'antd';
import '../../styleConst.css';
import { ColumnProps } from '../../../Layout/Column/column.type';

const meta = {
  component: Column,
  title: 'Layout/ThreeColumns/Column',
  argTypes: {
    title: {
      description:
        'Заголовок колонки. При пустом значении заголовок будет скрыт',
    },
    items: {
      description: 'Список элементов списка',
      control: false,
      table: {
        type: {
          summary: '{ name: string; id: string | number; icon?: ReactNode}',
        },
      },
    },
    renderItems: {
      description: 'Функция рендера элементов списка',
    },
    sortableFields: {
      description: [
        'Список полей, по которым доступна сортировка в таблице.',
        '',
        'Каждый элемент представляет собой объект с полями:',
        '- `label`: отображаемое название поля',
        '- `value`: ключ, соответствующий `item.id`, по которому осуществляется сортировка',
      ].join('\n'),
      table: {
        type: {
          summary: 'Array<{ label: string; value: string }>',
        },
      },
    },
    searchValue: {
      description: 'Значение поля поиска',
    },
    selectedItemId: {
      description: 'идентификатор, выбранного элемента списка',
    },
    setSelectedItemId: {
      description: 'callback-функция для установки selectedItemId',
    },
    onAddHook: {
      description: 'callback-функция для добавления нового элемента списка',
    },
    onUpdateItem: {
      description: 'callback-функция для редактирования элемента списка',
    },
    onChangeSearchValue: {
      description: 'callback-функция для обновления searchValue',
    },
    onRemoveItem: {
      description: 'callback-функция для удаления элемента массива',
    },
    showUpdateBtn: {
      description:
        'Показать/скрыть кнопку редактирования элемента. Кнопка становится активной при выбранном элементе',
    },
    showAddBtn: {
      description: 'Показать/скрыть кнопку добавления нового элемента',
    },
    showRemoveBtn: {
      description:
        'Показать/скрыть кнопку удаления элемента. Кнопка становится активной при выбранном элементе',
    },
    loadingRemove: {
      description: 'Показывает состояние загрузки при удалении',
    },
  },
} satisfies Meta<typeof Column>;

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
/*                                    Empty                                   */
/* -------------------------------------------------------------------------- */
export const Empty: Story = {
  name: 'Пустая колонка',
  args: {
    title: 'Пустая колонка',
    showAddBtn: false,
    showUpdateBtn: false,
    showRemoveBtn: false,
  },
  render: (args: any) => {
    const [selectedId, setSelectedId] = useState<string>();
    const [searchValue, setSearchValue] = useState('');

    return (
      <Column
        {...args}
        items={[]}
        selectedItemId={selectedId}
        setSelectedItemId={setSelectedId}
        searchValue={searchValue}
        onChangeSearchValue={setSearchValue}
      />
    );
  },
};

/* -------------------------------------------------------------------------- */
/*                                WithElements                                */
/* -------------------------------------------------------------------------- */
export const WithElements: Story = {
  name: 'Колонка с элементами',
  args: {
    title: 'Колонка с элементами',
    showAddBtn: false,
    showUpdateBtn: false,
    showRemoveBtn: false,
  },
  render: (args: any) => {
    const items = [
      { id: '1', name: 'Первый элемент' },
      { id: '2', name: 'Второй элемент' },
      { id: '3', name: 'Третий элемент' },
    ];

    return <Column {...args} items={items} renderItems={renderColumnItems} />;
  },
};

/* -------------------------------------------------------------------------- */
/*                               ActiveElement                                */
/* -------------------------------------------------------------------------- */
export const ActiveElement: Story = {
  name: 'С выбранным элементом',
  args: {
    title: 'С выбранным элементом',
    showAddBtn: false,
    showUpdateBtn: false,
    showRemoveBtn: false,
  },
  render: (args: any) => {
    const items = [
      { id: '1', name: 'Первый элемент' },
      { id: '2', name: 'Второй элемент' },
      { id: '3', name: 'Третий элемент' },
    ];

    const [selectedId, setSelectedId] = useState('');

    return (
      <Column
        {...args}
        items={items}
        renderItems={renderColumnItems}
        selectedItemId={selectedId}
        setSelectedItemId={setSelectedId}
      />
    );
  },
};

/* -------------------------------------------------------------------------- */
/*                               LoadingRemove                                */
/* -------------------------------------------------------------------------- */
export const LoadingRemove: Story = {
  name: 'Удаление с загрузкой',
  args: {
    title: 'Удаление с загрузкой',
    showAddBtn: false,
    showUpdateBtn: false,
    showRemoveBtn: true,
  },
  render: (args: any) => {
    const initialItems = [
      { id: '1', name: 'Элемент 1' },
      { id: '2', name: 'Элемент 2' },
    ];

    const [list, setList] = useState(initialItems);
    const [selectedId, setSelectedId] = useState('');
    const [loadingRemove, setLoadingRemove] = useState(false);

    const removeItem = async (id: string) => {
      setLoadingRemove(true);
      await new Promise((r) => setTimeout(r, 1000));
      setList((prev) => prev.filter((i) => i.id !== id));
      setLoadingRemove(false);
    };

    return (
      <Column
        {...args}
        items={list}
        selectedItemId={selectedId}
        setSelectedItemId={setSelectedId}
        renderItems={renderColumnItems}
        onRemoveItem={removeItem}
        loadingRemove={loadingRemove}
      />
    );
  },
};

/* -------------------------------------------------------------------------- */
/*                               WithSearch                                  */
/* -------------------------------------------------------------------------- */
export const WithSearch: Story = {
  name: 'Колонка с поиском',
  args: {
    title: 'Колонка с поиском',
    searchPlaceholder: 'Поиск по имени...',
    showAddBtn: false,
    showUpdateBtn: false,
    showRemoveBtn: false,
  },
  render: (args: any) => {
    const allItems = [
      { id: '1', name: 'Апельсин' },
      { id: '2', name: 'Банан' },
      { id: '3', name: 'Виноград' },
      { id: '4', name: 'Груша' },
    ];

    const [searchValue, setSearchValue] = useState('');
    const [selectedId, setSelectedId] = useState<string>();

    const filteredItems = allItems.filter((item) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase()),
    );

    return (
      <Column
        {...args}
        items={filteredItems}
        selectedItemId={selectedId}
        setSelectedItemId={setSelectedId}
        searchValue={searchValue}
        onChangeSearchValue={setSearchValue}
        renderItems={renderColumnItems}
      />
    );
  },
};

/* -------------------------------------------------------------------------- */
/*                             WithSorting                                 */
/* -------------------------------------------------------------------------- */
export const WithSorting: Story = {
  name: 'Колонка с сортировкой',
  args: {
    title: 'Колонка с сортировкой',
    sortableFields: [
      { label: 'Имя', value: 'name' },
      { label: 'ID', value: 'id' },
    ],
    showAddBtn: false,
    showUpdateBtn: false,
    showRemoveBtn: false,
  },
  render: (args: any) => {
    const items = [
      { id: '10', name: 'Зинаида' },
      { id: '2', name: 'Анна' },
      { id: '7', name: 'Борис' },
      { id: '1', name: 'Яков' },
    ];

    const [selectedId, setSelectedId] = useState<string>();
    const [sortValue, setSortValue] = useState<keyof (typeof items)[0]>();
    const [directionValue, setDirectionValue] = useState<'asc' | 'desc'>('asc');

    return (
      <Column
        {...args}
        items={items}
        selectedItemId={selectedId}
        setSelectedItemId={setSelectedId}
        renderItems={renderColumnItems}
        sortValue={sortValue}
        onChangeSortValue={setSortValue}
        directionValue={directionValue}
        onChangeDirectionValue={setDirectionValue}
      />
    );
  },
};

/* -------------------------------------------------------------------------- */
/*                         FullFeaturedColumn                               */
/* -------------------------------------------------------------------------- */
export const FullFeaturedColumn: Story = {
  name: 'Полнофункциональная колонка',
  args: {
    title: 'Полнофункциональная колонка',
    searchPlaceholder: 'Искать элемент...',
    sortableFields: [{ label: 'Название', value: 'name' }],
  },
  render: (args: any) => {
    const [items, setItems] = useState([
      { id: '1', name: 'Элемент A' },
      { id: '2', name: 'Элемент B' },
      { id: '3', name: 'Элемент C' },
    ]);

    const [selectedId, setSelectedId] = useState<string>();
    const [searchValue, setSearchValue] = useState('');
    const [sortValue, setSortValue] = useState<keyof (typeof items)[0]>();
    const [directionValue, setDirectionValue] = useState<'asc' | 'desc'>('asc');
    const [loadingRemove, setLoadingRemove] = useState(false);

    const addItem = () => {
      const newId = String(Date.now());
      setItems((prev) => [
        ...prev,
        { id: newId, name: `Новый элемент ${newId}` },
      ]);
    };

    const updateItem = (id: string) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, name: `${item.name} (изменён)` } : item,
        ),
      );
    };

    const removeItem = async (id: string) => {
      setLoadingRemove(true);
      await new Promise((r) => setTimeout(r, 600));
      setItems((prev) => prev.filter((i) => i.id !== id));
      setSelectedId(undefined);
      setLoadingRemove(false);
    };

    const filteredItems = items.filter((item) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase()),
    );

    return (
      <Column
        {...args}
        items={filteredItems}
        selectedItemId={selectedId}
        setSelectedItemId={setSelectedId}
        searchValue={searchValue}
        onChangeSearchValue={setSearchValue}
        renderItems={renderColumnItems}
        onAddItem={addItem}
        onUpdateItem={updateItem}
        onRemoveItem={removeItem}
        loadingRemove={loadingRemove}
        sortValue={sortValue}
        onChangeSortValue={setSortValue}
        directionValue={directionValue}
        onChangeDirectionValue={setDirectionValue}
      />
    );
  },
};

/* -------------------------------------------------------------------------- */
/*                           CustomRenderItem                               */
/* -------------------------------------------------------------------------- */
export const CustomRenderItem: Story = {
  name: 'Кастомный рендер',
  args: {
    title: 'Кастомный рендер',
    showAddBtn: false,
    showUpdateBtn: false,
    showRemoveBtn: false,
  },
  render: (args: ColumnProps<any>) => {
    const items = [
      { id: '1', name: 'PDF-документ', type: 'file' },
      { id: '2', name: 'Настройки профиля', type: 'settings' },
      { id: '3', name: 'Отчёт за май', type: 'report' },
    ];

    const renderCustomItem = (item: any) => (
      <div
        className="custom-item"
        style={{ padding: '8px 12px', display: 'flex', gap: '8px' }}
      >
        <span style={{ fontWeight: 'bold', color: '#555' }}>[{item.type}]</span>
        <span>{item.name}</span>
      </div>
    );

    return <Column {...args} items={items} renderItems={renderCustomItem} />;
  },
};
