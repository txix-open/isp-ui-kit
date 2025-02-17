import type { Meta, StoryObj } from '@storybook/react';
import ConfigTable from '../../components/ConfigTable/ConfigTable';
import { useState } from 'react';

const meta: Meta<typeof ConfigTable> = {
  title: 'Components/ConfigTable',
  component: ConfigTable,
  parameters: {
    layout: 'centered',
    category: 'table',
    componentSubtitle:
      'Компонент ConfigTable, основан на базовом компоненте Table от Antd',
    docs: {
      description: {
        component: 'Подробнее можно ознакомиться на сайте Antd',
      },
    },
  },
  argTypes: {
    onSearch: {
      control: false,
      description: 'Функция, вызываемая по клику на кнопку в SearchInput',
    },
    onClickBtn: {
      control: false,
      description: 'Функция, вызываемая по клику на кнопку',
    },
    textBtn: {
      control: false,
      description: 'Текст, отображаемый в кнопке',
    },
    placeholderSearch: {
      control: false,
      description: 'Placeholder поисковой строки',
    },
    dataSource: {
      control: false,
      description: 'Массив данных таблицы',
    },
    isAddBtn: {
      control: false,
      description: 'Флаг отображения кнопки',
    },
    isSearch: {
      control: false,
      description: 'Флаг отображения поисковой строки',
    },
  },
  args: {
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
  render: (args) => {
    const [data, setData] = useState(args.dataSource);

    const handlerSearch = (searchValue: string) => {
      const filteredData = args.dataSource.filter((item) => {
        return Object.values(item).some((value: any) =>
          value.toString().toLowerCase().includes(searchValue.toLowerCase()),
        );
      });

      setData(filteredData);
    };

    return (
      <ConfigTable
        onSearch={handlerSearch}
        columns={Object.keys(data[0]).map((key) => ({
          title: key,
          width: 150,
          dataIndex: key,
          key: key,
        }))}
        dataSource={data}
      />
    );
  },
};
