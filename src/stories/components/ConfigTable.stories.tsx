import type { Meta, StoryObj } from '@storybook/react';
import ConfigTable from '../../components/ConfigTable/ConfigTable';
import { useState } from 'react';

/**
 * ================================================================
 *  Описание компонента ConfigTable
 * ================================================================
 *  Компонент-обёртка над Ant Design Table.
 *  Добавляет:
 *   • Поиск по всем полям таблицы
 *   • Кнопку "Добавить", которую можно переопределять
 *   • Единый заголовок с поиском + action-кнопкой
 *
 *  Данная Story демонстрирует:
 *   • Как работать с поиском
 *   • Как обновлять таблицу из внешнего состояния
 *   • Как задавать динамические колонки
 *   • Как работает кнопка Добавить
 * ================================================================
 */

const meta: Meta<typeof ConfigTable> = {
  title: 'Components/ConfigTable',
  tags: ['autodocs'],
  component: ConfigTable,
  parameters: {
    layout: 'centered',
    category: 'table',
    componentSubtitle:
      'Обёртка над Antd Table с конфигурируемыми колонками, поиском и API-совместимостью.',
    docs: {
      description: {
        component:
          'ConfigTable строит таблицу на основе конфигурации колонок и поддерживает интеграцию с API — поиск, добавление и обновление данных могут быть вынесены во внешние запросы. Колонки строятся на основе данных структуру, переданных в компонент',
      },
    },
  },
  argTypes: {
    isSearch: {
      control: 'boolean',
      description: 'Показать / скрыть строку поиска',
    },
    isAddBtn: {
      control: 'boolean',
      description: 'Показать / скрыть кнопку добавления',
    },
    textBtn: {
      control: 'text',
      description: 'Текст кнопки добавления',
    },
    placeholderSearch: {
      control: 'text',
      description: 'Текст placeholder для поиска',
    },
  },
  args: {
    isSearch: true,
    isAddBtn: true,
    textBtn: 'Добавить нового героя',
    placeholderSearch: 'Поиск по всем полям...',
    dataSource: [
      {
        id: 'ae76e1ce-d62a-4a27-90a3-5be49ff586d7',
        code: '00012341118',
        ballot: '905d3ea6-f865-4c04-94df-997d78b206bc',
        index: 29,
        name: '',
        firstName: 'Гребешок',
        lastName: 'ПЕТУШОК',
        middleName: 'Красненький',
      },
      {
        id: 'fd10122b-143b-43cf-9e93-8769ad2dc553',
        code: '00002728281',
        ballot: '905d3ea6-f865-4c04-94df-997d78b206bc',
        index: 27,
        name: '',
        firstName: 'Берег',
        lastName: 'КИСЕЛЬНЫЙ',
        middleName: 'Федорович',
      },
      {
        id: 'c8c27787-e25b-403e-906b-e1f6ec27593f',
        code: '00006261880',
        ballot: '905d3ea6-f865-4c04-94df-997d78b206bc',
        index: 9,
        name: '',
        firstName: 'Царь',
        lastName: 'ВОДЯНОЙ',
        middleName: 'Болотный',
      },
    ],
  },
};

export default meta;

type Story = StoryObj<typeof ConfigTable>;

export const Table: Story = {
  name: 'Пример',
  render: (args) => {
    /**
     * ------------------------------------------------------------
     *  Внешнее состояние таблицы
     * ------------------------------------------------------------
     *  Сторис показывает, как ConfigTable работает с изменяемыми
     *  данными: при поиске или добавлении таблица обновляется.
     * ------------------------------------------------------------
     */
    const [data, setData] = useState(args.dataSource);

    /**
     * ------------------------------------------------------------
     *  Обработчик поиска
     * ------------------------------------------------------------
     *  Выполняет фильтрацию по всем полям каждого элемента.
     *  Возможно благодаря Object.values(item).
     *
     *  SearchInput вызывает onSearch автоматически.
     * ------------------------------------------------------------
     */
    const handlerSearch = (value: string) => {
      const v = value.toLowerCase();

      const filtered = args.dataSource.filter((row) =>
        Object.values(row).some((field: any) =>
          field?.toString().toLowerCase().includes(v),
        ),
      );

      setData(filtered);
    };

    /**
     * ------------------------------------------------------------
     *  Обработчик кнопки "Добавить"
     * ------------------------------------------------------------
     *  Добавляет новую запись в таблицу.
     *
     *  Новый элемент создаётся с рандомным id и простыми данными.
     *  Показывает, как ConfigTable работает с внешним add-пайплайном.
     * ------------------------------------------------------------
     */
    const handlerAdd = () => {
      const newItem = {
        id: crypto.randomUUID(),
        code: String(Math.random()).slice(2, 12),
        ballot: 'new-ballot-element',
        index: data.length + 1,
        name: '',
        firstName: 'Новый',
        lastName: 'ЭЛЕМЕНТ',
        middleName: 'Добавленный',
      };

      setData((prev) => [...prev, newItem]);
    };

    /**
     * ------------------------------------------------------------
     *  Генерация колонок таблицы
     * ------------------------------------------------------------
     *  Колонки формируются автоматически на основе ключей объекта.
     *
     *  Это удобно, когда таблица имеет динамическую структуру.
     * ------------------------------------------------------------
     */
    const columns = Object.keys(data[0]).map((key) => ({
      title: key,
      width: 150,
      dataIndex: key,
      key,
    }));

    return (
      <ConfigTable
        {...args}
        onSearch={handlerSearch}
        onClickBtn={handlerAdd}
        columns={columns}
        dataSource={data}
      />
    );
  },
};
