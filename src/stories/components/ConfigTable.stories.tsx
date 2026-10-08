import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { Key } from 'react';
import { Button, Segmented, Tag } from 'antd';
import ConfigTable from '../../components/ConfigTable/ConfigTable';

const records = Array.from({ length: 24 }, (_, i) => ({
  id: `module-${i + 1}`,
  name: [
    'Обработка входящих сообщений',
    'Сервис доставки уведомлений внешним системам',
    'Нормализация адресов и персональных данных',
    'Проверка обязательных полей',
  ][i % 4],
  code: [
    'isp-mapping-service',
    'isp-notification-delivery-service',
    'isp-address-service',
    'isp-validation-service',
  ][i % 4],
  version: `3.${i % 4}.${i}`,
  instances: i % 5,
}));

const columns = [
  {
    title: 'Модуль',
    dataIndex: 'name',
    key: 'name',
    width: 280,
    sorter: (a: (typeof records)[number], b: (typeof records)[number]) =>
      a.name.localeCompare(b.name),
  },
  { title: 'Идентификатор', dataIndex: 'code', key: 'code', width: 250 },
  { title: 'Версия', dataIndex: 'version', key: 'version', width: 90 },
  {
    title: 'Экземпляры',
    dataIndex: 'instances',
    key: 'instances',
    width: 120,
    sorter: (a: (typeof records)[number], b: (typeof records)[number]) =>
      a.instances - b.instances,
    render: (value: number) => (
      <Tag color={value ? 'cyan' : 'default'}>
        {value ? `${value} активных` : 'Нет активных'}
      </Tag>
    ),
  },
];

const meta = {
  title: 'Components/ConfigTable',
  tags: ['autodocs'],
  component: ConfigTable,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Таблица с поиском и действием добавления. modern включён по умолчанию, classic сохраняет прежний вид. Поиск выполняется по Enter, кнопке «Найти» и при очистке; onSearch передаёт запрос родителю, сам компонент не фильтрует данные и не строит колонки. columns, pagination, rowSelection, loading, locale и остальные Table props остаются под контролем приложения. Тему и ширину примеров меняйте в панели Storybook.',
      },
    },
  },
  argTypes: {
    searchValue: {
      description:
        'Выполненный запрос. При внешнем управлении родитель обновляет его через onSearch.',
      control: 'text',
    },
    totalItemsCount: {
      description: 'Общее число записей до поиска.',
      control: 'number',
    },
    filteredItemsCount: {
      description:
        'Число совпадений при серверной пагинации; иначе используется dataSource.length.',
      control: 'number',
    },
    selectionActions: {
      description:
        'Действия приложения для выбранных строк; панель требует rowSelection.selectedRowKeys.',
      control: false,
    },
    onClearSelection: {
      description: 'Обработчик снятия выбора в приложении.',
      control: false,
    },
    onResetSearch: {
      description:
        'Сброс поиска в приложении. Если не передан, вызывается onSearch с пустой строкой.',
      control: false,
    },
    appearance: {
      control: 'radio',
      options: ['modern', 'classic'],
      description: 'modern по умолчанию; classic для миграции.',
    },
    isSearch: {
      control: 'boolean',
      description: 'Показывает поиск; по умолчанию true.',
    },
    isAddBtn: {
      control: 'boolean',
      description: 'Показывает действие добавления; по умолчанию true.',
    },
    textBtn: { control: 'text', description: 'Текст кнопки добавления.' },
    placeholderSearch: {
      control: 'text',
      description: 'Подсказка и доступное название поля поиска.',
    },
    onSearch: {
      control: false,
      description:
        'Передаёт запрос родителю для локального поиска или запроса к API.',
    },
    onClickBtn: {
      control: false,
      description:
        'Запускает добавление в приложении; dataSource автоматически не меняется.',
    },
  },
  args: {
    isSearch: true,
    isAddBtn: true,
    textBtn: 'Добавить модуль',
    placeholderSearch: 'Название, идентификатор или версия…',
    dataSource: records,
    columns,
  },
} satisfies Meta<typeof ConfigTable>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Table: Story = {
  name: 'Поиск, добавление и пагинация',
  parameters: {
    docs: {
      description: {
        story:
          'Введите запрос и нажмите Enter или «Найти». Очистка возвращает список. Добавление создаёт модуль; сортировка доступна по названию и числу экземпляров. Выберите строки флажками и переключите страницу. У таблицы нет неявного действия клика по строке.',
      },
    },
  },
  render: function TableExample(args) {
    const [items, setItems] = useState(args.dataSource ?? []);
    const [search, setSearch] = useState(args.searchValue ?? '');
    const [selected, setSelected] = useState<Key[]>([]);
    const [density, setDensity] = useState<'small' | 'middle'>('small');
    const data = items.filter((row) =>
      Object.values(row).some((value) =>
        String(value ?? '')
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    );
    return (
      <div>
        <div style={{ marginBottom: 12 }}>
          <Segmented
            aria-label="Плотность таблицы"
            options={[
              { label: 'Компактно', value: 'small' },
              { label: 'Обычно', value: 'middle' },
            ]}
            value={density}
            onChange={setDensity}
          />
        </div>
        <ConfigTable
          rowKey="id"
          pagination={{
            pageSize: 5,
            showSizeChanger: false,
            showTotal: (total) => `Всего записей: ${total}`,
          }}
          rowSelection={{
            selectedRowKeys: selected,
            onChange: setSelected,
            preserveSelectedRowKeys: true,
          }}
          size={density}
          totalItemsCount={items.length}
          onClearSelection={() => setSelected([])}
          selectionActions={
            <Button
              onClick={() =>
                setItems((prev) =>
                  prev.map((row) =>
                    selected.includes(row.id)
                      ? { ...row, version: '4.0.0' }
                      : row,
                  ),
                )
              }
            >
              Обновить версии
            </Button>
          }
          {...args}
          searchValue={search}
          onSearch={setSearch}
          onClickBtn={() =>
            setItems((prev) => [
              {
                id: crypto.randomUUID(),
                name: 'Новый модуль',
                code: 'isp-new-service',
                version: '0.1.0',
                instances: 0,
              },
              ...prev,
            ])
          }
          dataSource={data}
        />
      </div>
    );
  },
};
export const NoResults: Story = {
  name: 'Поиск без результатов',
  args: { searchValue: 'несуществующий модуль' },
  render: Table.render,
  parameters: {
    docs: {
      description: {
        story:
          'Отправленный запрос без совпадений. «Сбросить поиск» очищает поле и восстанавливает список. До отправки нового запроса счётчик отражает последний выполненный поиск.',
      },
    },
  },
};
export const FixedHeader: Story = {
  name: 'Фиксированная шапка',
  args: { scroll: { x: 800, y: 280 }, pagination: false },
  render: Table.render,
  parameters: {
    docs: {
      description: {
        story:
          'scroll.y ограничивает высоту списка строк. Заголовки остаются видимыми при вертикальной прокрутке, горизонтальная прокрутка доступна внутри таблицы. Выбор сохраняется при смене плотности.',
      },
    },
  },
};
export const Empty: Story = {
  name: 'Нет данных',
  args: { dataSource: [], isAddBtn: false },
  render: Table.render,
  parameters: {
    docs: {
      description: {
        story:
          'Пустой dataSource с заданными columns. Сообщение об отсутствии данных можно заменить через locale.emptyText.',
      },
    },
  },
};
export const Loading: Story = {
  name: 'Загрузка',
  args: { loading: true, isAddBtn: false },
  render: Table.render,
  parameters: {
    docs: {
      description: {
        story:
          'loading передан в Ant Design Table: строки остаются видимыми под индикатором загрузки. Кнопка добавления скрыта приложением.',
      },
    },
  },
};
export const WithoutToolbar: Story = {
  name: 'Без поиска и добавления',
  args: { isSearch: false, isAddBtn: false, pagination: false },
  render: Table.render,
  parameters: {
    docs: {
      description: {
        story:
          'Панель полностью скрыта без пустого отступа. pagination=false отключает пагинацию через стандартный Table prop.',
      },
    },
  },
};
export const LongValues: Story = {
  name: 'Длинные значения',
  args: {
    dataSource: [
      {
        ...records[0],
        name: 'Проверка обязательных полей и форматов входящих сообщений от внешних информационных систем',
        code: 'isp-notification-delivery-service-with-long-identifier',
      },
    ],
  },
  render: Table.render,
  parameters: {
    docs: {
      description: {
        story:
          'Длинные значения переносятся внутри ячеек; на узкой области таблица прокручивается горизонтально. Панель поиска и добавления переносится независимо от строк.',
      },
    },
  },
};
export const CustomTableProps: Story = {
  name: 'Настройки приложения',
  args: {
    size: 'middle',
    bordered: true,
    rowSelection: undefined,
    scroll: { x: 740 },
    pagination: { pageSize: 3, showSizeChanger: false },
    locale: { emptyText: 'Модули не найдены' },
  },
  render: Table.render,
  parameters: {
    docs: {
      description: {
        story:
          'Переданные size, bordered, scroll, pagination, rowSelection и locale переопределяют значения по умолчанию. Запрос без совпадений показывает пользовательское сообщение.',
      },
    },
  },
};
