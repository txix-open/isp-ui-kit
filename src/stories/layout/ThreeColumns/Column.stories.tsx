import type { Meta, StoryObj } from '@storybook/react-vite';
import { Column } from '../../../Layout';
import { useState } from 'react';
import { List, Tooltip } from 'antd';
import ThreeColumnsFrame from './ThreeColumnsFrame';
import { ColumnProps } from '../../../Layout/Column/column.type';

const meta = {
  component: Column,
  title: 'Layout/ThreeColumns/Column',
  decorators: [
    (Story) => (
      <ThreeColumnsFrame>
        <Story />
      </ThreeColumnsFrame>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Управляемый список с выбором, поиском, сортировкой и группами. Поиск фильтруется родителем; ширина и раскрытие групп управляются внутри Column.',
      },
    },
  },
  args: {
    searchValue: '',
    selectedItemId: '',
    setSelectedItemId: () => {},
    onChangeSearchValue: () => {},
    renderItems: () => <></>,
  },
  argTypes: {
    appearance: {
      description: 'Оформление: modern по умолчанию, classic — прежний вид.',
      control: 'radio',
      options: ['modern', 'classic'],
    },
    title: {
      description:
        'Текст или ReactNode заголовка. Пустой title скрывает название; действия шапки могут оставаться.',
    },
    extraTitle: {
      description:
        'Дополнительное содержимое заголовка. В modern располагается ниже основной строки.',
    },
    tooltipTitle: {
      description:
        'Подсказка стандартного текстового заголовка; для кастомного title задавайте подсказки внутри ReactNode.',
    },
    items: {
      description:
        'Отображаемые элементы с уникальным id и name. Фильтрацию поиска выполняет родитель.',
      control: false,
    },
    renderItems: {
      description:
        'Рендер содержимого строки. Метаданные, усечение названия и его Tooltip задаются здесь.',
      control: false,
    },
    searchPlaceholder: { description: 'Подсказка поля поиска.' },
    searchValue: {
      description: 'Текущий запрос. Сам по себе не фильтрует items.',
    },
    onChangeSearchValue: {
      description:
        'Получает новый запрос и событие Input; родитель обновляет значение и фильтрует данные.',
      control: false,
    },
    selectedItemId: {
      description:
        'ID выбранного элемента как строка. Пустая строка означает отсутствие выбора.',
    },
    setSelectedItemId: {
      description:
        'Получает строковый ID при выборе строки мышью или клавиатурой.',
      control: false,
    },
    onAddItem: {
      description:
        'Запускает добавление в приложении; Column не меняет items самостоятельно.',
      control: false,
    },
    onUpdateItem: {
      description:
        'Получает ID выбранного элемента для редактирования в приложении.',
      control: false,
    },
    onRemoveItem: {
      description:
        'Получает ID выбранного элемента для удаления. Родитель обновляет items и сбрасывает выбор.',
      control: false,
    },
    showAddBtn: {
      description: 'Показывает кнопку + в шапке modern. По умолчанию true.',
    },
    showUpdateBtn: {
      description:
        'Включает пункт редактирования в меню выбранного элемента. По умолчанию true.',
    },
    showRemoveBtn: {
      description:
        'Включает пункт удаления в меню выбранного элемента. По умолчанию true.',
    },
    loadingRemove: {
      description:
        'Загрузка удаления: индикатор в меню действий, повторные действия блокируются в modern.',
    },
    isLoading: {
      description:
        'Skeleton при загрузке списка; отличается от загрузки удаления.',
    },
    columnKey: {
      description:
        'Уникальный ключ для сохранения ширины независимой колонки в localStorage.',
    },
    isCollapsible: {
      description:
        'Разрешает сворачивание колонки. Изменение ширины остаётся доступно. По умолчанию true.',
    },
    sortableFields: {
      description:
        'Доступные поля сортировки: value — ключ T, label — подпись. Column сортирует переданные items.',
    },
    sortValue: {
      description: 'Ключ поля сортировки; undefined означает исходный порядок.',
    },
    onChangeSortValue: {
      description:
        'Получает выбранное поле или undefined при сбросе сортировки.',
      control: false,
    },
    directionValue: { description: 'Направление: asc или desc.' },
    onChangeDirectionValue: {
      description: 'Получает направление или undefined при сбросе сортировки.',
      control: false,
    },
    searchFields: {
      description:
        'Поля поиска: value — ключ T, label — подпись. Выбор поля не реализует фильтрацию.',
    },
    searchFieldValue: { description: 'Выбранное поле поиска.' },
    onChangeSearchField: {
      description:
        'Получает ключ поля поиска как строку; родитель меняет логику фильтрации.',
      control: false,
    },
    groupBy: {
      description:
        'Ключ T для группировки. Пустые значения попадают в группу «Без группы».',
    },
    renderHeaderGroup: {
      description:
        'Получает ключ группы и её элементы, возвращает ReactNode заголовка.',
      control: false,
    },
    sortGroups: {
      description:
        'Функция сравнения ключей групп; по умолчанию лексикографический порядок.',
      control: false,
    },
    totalItemsCount: {
      description:
        'Общее число элементов до фильтрации для надписи «Найдено N из M».',
    },
    removeConfirmDescription: {
      description: 'Дополнительное пояснение в подтверждении удаления.',
    },
    disableRemovePopconfirm: {
      description: 'Удаляет без подтверждения при true. По умолчанию false.',
    },
    onOpenChange: {
      description: 'Получает состояние открытия подтверждения удаления.',
      control: false,
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
  parameters: {
    docs: {
      description: {
        story:
          'Пустой список без действий. В modern отображается сообщение об отсутствии элементов.',
      },
    },
  },
  name: 'Пустая колонка',
  args: {
    title: 'Пустая колонка',
    showAddBtn: false,
    showUpdateBtn: false,
    showRemoveBtn: false,
  },
  render: (args: any) => {
    const [selectedId, setSelectedId] = useState('');
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
  parameters: {
    docs: {
      description: {
        story:
          'Выберите строку мышью, Enter или Space. Действия изменения данных скрыты.',
      },
    },
  },
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

    const [selectedId, setSelectedId] = useState('');
    return (
      <Column
        {...args}
        items={items}
        selectedItemId={selectedId}
        setSelectedItemId={setSelectedId}
        renderItems={renderColumnItems}
      />
    );
  },
};

/* -------------------------------------------------------------------------- */
/*                               ActiveElement                                */
/* -------------------------------------------------------------------------- */
export const ActiveElement: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Второй элемент выбран изначально. Переключение выбора меняет выделение, сохраняя геометрию строк.',
      },
    },
  },
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

    const [selectedId, setSelectedId] = useState('2');

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
  parameters: {
    docs: {
      description: {
        story:
          'Выберите элемент, откройте ⋯ и подтвердите удаление. Выполнение занимает одну секунду; после него выбор сбрасывается.',
      },
    },
  },
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
      setSelectedId('');
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
  parameters: {
    docs: {
      description: {
        story:
          'Родитель фильтрует названия по запросу без учёта регистра. Очистка поля возвращает весь список.',
      },
    },
  },
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
    const [selectedId, setSelectedId] = useState('');

    const filteredItems = allItems.filter((item) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase()),
    );

    return (
      <Column
        {...args}
        items={filteredItems}
        totalItemsCount={allItems.length}
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
  parameters: {
    docs: {
      description: {
        story:
          'Выберите имя или ID и переключите направление. По умолчанию восстанавливает исходный порядок; ID в этом примере — строковые значения.',
      },
    },
  },
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

    const [selectedId, setSelectedId] = useState('');
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
  parameters: {
    docs: {
      description: {
        story:
          'Добавление создаёт строку, редактирование дописывает название, удаление выполняется с подтверждением и индикатором загрузки.',
      },
    },
  },
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

    const [selectedId, setSelectedId] = useState('');
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
      setSelectedId('');
      setLoadingRemove(false);
    };

    const filteredItems = items.filter((item) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase()),
    );

    return (
      <Column
        {...args}
        items={filteredItems}
        totalItemsCount={items.length}
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
  parameters: {
    docs: {
      description: {
        story:
          'Произвольный renderItems отображает тип и название. Column добавляет выбор и доступный фокус.',
      },
    },
  },
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

    const [selectedId, setSelectedId] = useState('');
    return (
      <Column
        {...args}
        items={items}
        selectedItemId={selectedId}
        setSelectedItemId={setSelectedId}
        renderItems={renderCustomItem}
      />
    );
  },
};

function ColumnScenario({
  mode,
}: {
  mode: 'long' | 'no-results' | 'loading' | 'custom-header';
}) {
  const [items, setItems] = useState([
    {
      id: '1',
      name: 'Проверка обязательных полей и форматов входящих сообщений',
      group: 'Преобразование',
      description: 'v0.13 · 25.06.2026 · TypeScript',
    },
    {
      id: '2',
      name: 'Нормализация адресов и персональных данных клиента',
      group: 'Преобразование',
      description: 'v1.2 · 30.09.2026 · JavaScript',
    },
    {
      id: '3',
      name: 'Доставка уведомлений внешним информационным системам',
      group: 'Интеграции',
      description: 'v3.1 · 01.10.2026 · TypeScript',
    },
  ]);
  const [selected, setSelected] = useState('1');
  const [search, setSearch] = useState(
    mode === 'no-results' ? 'несуществующий элемент' : '',
  );
  const [showInfo, setShowInfo] = useState(false);
  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <Column
      title={
        mode === 'custom-header' ? (
          <div>
            <span>Интеграции</span>
            <button
              type="button"
              onClick={() => setShowInfo(!showInfo)}
              style={{ display: 'block', marginTop: 8 }}
            >
              {showInfo ? 'Скрыть информацию' : 'Показать информацию'}
            </button>
            {showInfo && (
              <p style={{ fontSize: 12, fontWeight: 400 }}>
                Пользовательское содержимое заголовка меняет его высоту.
              </p>
            )}
          </div>
        ) : (
          'Список преобразователей входящих сообщений'
        )
      }
      columnKey={`storybook-column-${mode}`}
      items={mode === 'loading' ? [] : filtered}
      totalItemsCount={items.length}
      selectedItemId={selected}
      setSelectedItemId={setSelected}
      searchValue={search}
      onChangeSearchValue={setSearch}
      renderItems={(item) => (
        <List.Item>
          <Tooltip title={item.name}>
            <List.Item.Meta title={item.name} description={item.description} />
          </Tooltip>
        </List.Item>
      )}
      groupBy={mode === 'long' ? 'group' : undefined}
      isLoading={mode === 'loading'}
      onAddItem={() => {
        const id = crypto.randomUUID();
        setItems((prev) => [
          ...prev,
          {
            id,
            name: 'Новый преобразователь',
            group: 'Преобразование',
            description: 'v0.1 · Новый',
          },
        ]);
        setSearch('');
        setSelected(id);
      }}
      onUpdateItem={(id) =>
        setItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, name: `${item.name} (изменён)` } : item,
          ),
        )
      }
      onRemoveItem={(id) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
        setSelected('');
      }}
    />
  );
}
export const LongGrouped: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Длинный заголовок переносится, названия строк обрезаются с подсказкой. Группы можно сворачивать независимо.',
      },
    },
  },
  name: 'Длинные названия и группы',
  render: () => <ColumnScenario mode="long" />,
};
export const NoResults: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Начальный запрос не совпадает ни с одним элементом. Очистите поле, чтобы восстановить список.',
      },
    },
  },
  name: 'Поиск без результатов',
  render: () => <ColumnScenario mode="no-results" />,
};
export const InitialLoading: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Имитирует ожидание первой порции данных: items пуст, isLoading включён. Skeleton заменяет сообщение о пустоте.',
      },
    },
  },
  name: 'Первоначальная загрузка',
  render: () => <ColumnScenario mode="loading" />,
};
export const CustomHeader: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Кнопка внутри ReactNode title показывает пояснение. Шапка растёт, список получает меньше высоты; общая высота колонки сохраняется.',
      },
    },
  },
  name: 'Кастомный заголовок меняет высоту',
  render: () => <ColumnScenario mode="custom-header" />,
};
