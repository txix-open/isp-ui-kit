import type { Meta, StoryObj } from '@storybook/react';
import { Column } from '../Layout';
import { ColumnItem } from '../Layout/Column/column.type';
import { useState } from 'react';

const meta: Meta<typeof Column> = {
  component: Column,
  title: 'Layout/ThreeColumns/Column',
  args: {},
  parameters: {
    layout: 'centered',
    componentSubtitle:
      'Компонент Column, служит базовым блоком для организации шаблона "Три колонки"',
  },
  argTypes: {
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
    searchValue: {
      description: 'Значение поля поиска',
    },
    selectedItemId: {
      description: 'идентификатор, выбранного элемента списка',
    },
    setSelectedItemId: {
      description: 'callback-функция для установки selectedItemId',
    },
    onAddItem: {
      description: 'callback-функция для добавления нового элемента списка',
    },
    onChangeSearchValue: {
      description: 'callback-функция для обновления searchValue',
    },
    onRemoveItem: {
      description: 'callback-функция для удаления элемента массива',
    },
    showAddBtn: {
      description: 'Показать/скрыть кнопку добавления нового элемента',
    },
    showRemoveBtn: {
      description:
        'Показать/скрыть кнопку удаления элемента элемента. Кнопка становится активной, при выбранном элементе',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Column>;

export const Empty: Story = {
  args: {},
};

export const WithElements: Story = {
  args: {
    items: [
      {
        id: '1',
        name: 'Первый элемент',
      },
      {
        id: '2',
        name: 'Второй элемент',
      },
      {
        id: '3',
        name: 'Третий элемент',
      },
    ],
    renderItems: (item: ColumnItem<any>) => <span>{item.name}</span>,
  },
  argTypes: { onAddItem: { action: 'clicked' } },
  render: (args) => {
    const [selectedId, setSelectedId] = useState<string>('');
    const [list, setList] = useState<ColumnItem<any>[]>(args.items);
    const onSelected = (id: string) => setSelectedId(id);
    const addItem = () =>
      setList((prevState: ColumnItem<any>[]) => {
        const id = Math.floor(Math.random() * (1 + 1 - 100)).toString();
        return [...prevState, { id: id, name: `Новое имя id${id}` }];
      });
    const removeItemById = (id: string) => {
      const updatedItems = list.filter((item) => item.id !== id);
      setList(updatedItems);
    };
    return (
      <Column
        {...args}
        items={list}
        onAddItem={addItem}
        onRemoveItem={removeItemById}
        selectedItemId={selectedId}
        setSelectedItemId={onSelected}
      />
    );
  },
};
