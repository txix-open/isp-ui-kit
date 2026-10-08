import { useDesignPreview } from '../../shared/DesignPreviewContext';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  Button,
  ConfigProvider,
  Input,
  List,
  Modal,
  Segmented,
  Switch,
  Tag,
  Tooltip,
  theme,
} from 'antd';
import { Column } from '../../../Layout';
import 'simplebar-react/dist/simplebar.min.css';
import 'react-resizable/css/styles.css';
import './column-redesign-story.scss';

type Item = {
  id: string;
  name: string;
  description: string;
  group: string;
  version?: string;
  date?: string;
  language?: string;
  status?: string;
  instances?: number;
};
type Dataset = 'converters' | 'modules' | 'sections';
const converters: Item[] = [
  {
    id: 'c1',
    name: 'ДТСЗН (дедубликация)',
    description: 'Удаление повторяющихся записей',
    group: 'ДТСЗН',
    version: '0.7',
    date: '30.09.2026',
    language: 'TS',
    status: 'Новый',
  },
  {
    id: 'c2',
    name: 'ДТСЗН УФМ — Проверка обязательных полей и форматов',
    description: 'Проверка данных перед передачей',
    group: 'ДТСЗН',
    version: '0.13',
    date: '25.06.2026',
    language: 'JS',
    status: 'Новый',
  },
  {
    id: 'c3',
    name: 'ДТСЗН',
    description: 'Основной преобразователь',
    group: 'ДТСЗН',
    version: '0.12',
    date: '16.09.2026',
    language: 'JS',
    status: 'Новый',
  },
  {
    id: 'c4',
    name: 'ЕГИССО Рождение ПРОКСИ',
    description: 'Подготовка сведений о рождении',
    group: 'ЕГИССО. Рождение',
    version: '1.2',
    date: '01.10.2026',
    language: 'TS',
    status: 'Готов',
  },
  {
    id: 'c5',
    name: 'ЕГИССО — Нормализация адресов и персональных данных',
    description: 'Приведение данных к единому формату',
    group: 'ЕГИССО. Рождение',
    version: '0.8',
    date: '28.09.2026',
    language: 'TS',
    status: 'Готов',
  },
  {
    id: 'c6',
    name: 'ЕГИССО — Проверка СНИЛС',
    description: 'Проверка контрольной суммы',
    group: 'ЕГИССО. Рождение',
    version: '2.1',
    date: '20.09.2026',
    language: 'JS',
    status: 'Готов',
  },
  {
    id: 'c7',
    name: 'ЕГИССО — Обогащение сведений',
    description: 'Дополнение сведений из справочников',
    group: 'ЕГИССО. Рождение',
    version: '0.4',
    date: '18.09.2026',
    language: 'TS',
    status: 'Новый',
  },
  {
    id: 'c8',
    name: 'ЕГИССО — Выгрузка',
    description: 'Формирование итогового пакета',
    group: 'ЕГИССО. Рождение',
    version: '1.0',
    date: '15.09.2026',
    language: 'JS',
    status: 'Готов',
  },
];
const modules: Item[] = [
  {
    id: 'm1',
    name: 'isp-admin-service',
    description: 'Управление системой',
    group: 'Сервисы',
    instances: 0,
  },
  {
    id: 'm2',
    name: 'isp-config-service',
    description: 'Хранение конфигурации',
    group: 'Сервисы',
    version: '3.11.0',
    instances: 1,
  },
  {
    id: 'm3',
    name: 'isp-gate-service',
    description: 'Маршрутизация запросов',
    group: 'Сервисы',
    version: '5.11.4',
    instances: 1,
  },
  {
    id: 'm4',
    name: 'isp-lock-service',
    description: 'Распределённые блокировки',
    group: 'Сервисы',
    version: '1.8.0',
    instances: 1,
  },
  {
    id: 'm5',
    name: 'isp-mapping-service',
    description: 'Преобразование данных',
    group: 'Сервисы',
    version: '2.3.1',
    instances: 2,
  },
  {
    id: 'm6',
    name: 'isp-notification-delivery-service',
    description: 'Доставка уведомлений',
    group: 'Сервисы',
    version: '1.4.2',
    instances: 0,
  },
  {
    id: 'm7',
    name: 'isp-audit-service',
    description: 'Журналирование событий',
    group: 'Сервисы',
    version: '3.2.0',
    instances: 1,
  },
];
const sections: Item[] = [
  'Клиенты',
  'Договоры',
  'Тарифы',
  'Заявки',
  'Платежи',
].map((name, index) => ({
  id: `s${index}`,
  name,
  description: 'Сведения и настройки раздела',
  group: 'Основное',
}));
const datasets: Record<Dataset, Item[]> = { converters, modules, sections };

function RichItem({ item, dataset }: { item: Item; dataset: Dataset }) {
  if (dataset === 'sections')
    return (
      <List.Item>
        <List.Item.Meta title={item.name} description={item.description} />
      </List.Item>
    );
  return (
    <div className="column-demo-item">
      <div className="column-demo-item__top">
        <Tooltip title={item.name} mouseEnterDelay={0.5}>
          <strong className="column-demo-item__name">{item.name}</strong>
        </Tooltip>
        {dataset === 'converters' ? (
          <span className="column-demo-item__status">{item.status}</span>
        ) : (
          item.version && (
            <span className="column-demo-item__version">{item.version}</span>
          )
        )}
      </div>
      <div className="column-demo-item__bottom">
        {dataset === 'converters' ? (
          <>
            <span className="column-demo-item__metadata">
              v{item.version} <span>{item.date}</span>
            </span>
            <span
              className={`column-demo-item__language column-demo-item__language--${item.language?.toLowerCase()}`}
            >
              {item.language}
            </span>
          </>
        ) : (
          <>
            <span>Активных экземпляров</span>
            <span
              className={`column-demo-item__instances ${item.instances === 0 ? 'column-demo-item__instances--zero' : ''}`}
              aria-label={`${item.instances} активных экземпляров`}
            >
              {item.instances}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

function ColumnPlayground() {
  const [dataset, setDataset] = useState<Dataset>('converters');
  const [appearance, setAppearance] = useState<'classic' | 'modern'>('modern');
  const preview = useDesignPreview();
  const dark = preview.theme === 'dark';
  const height =
    preview.height === 'short' ? 320 : preview.height === 'tall' ? 720 : 560;
  const [grouped, setGrouped] = useState(true);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState(converters);
  const [selectedId, setSelectedId] = useState('c2');
  const [search, setSearch] = useState('');
  const [searchField, setSearchField] = useState('name');
  const [sort, setSort] = useState<keyof Item>();
  const [direction, setDirection] = useState<string | undefined>('asc');
  const [editor, setEditor] = useState<'add' | 'edit' | null>(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [name, setName] = useState('');
  const selected = items.find((item) => item.id === selectedId);
  const filtered = items.filter((item) =>
    String(item[searchField as keyof Item])
      .toLocaleLowerCase()
      .includes(search.trim().toLocaleLowerCase()),
  );
  const openEditor = (mode: 'add' | 'edit') => {
    setName(mode === 'edit' ? (selected?.name ?? '') : '');
    setEditor(mode);
  };
  const saveItem = () => {
    if (!name.trim()) return;
    if (editor === 'add') {
      const id = crypto.randomUUID();
      setItems((prev) => [
        ...prev,
        {
          id,
          name: name.trim(),
          description: 'Новый элемент',
          group: dataset === 'converters' ? 'ДТСЗН' : 'Основное',
          ...(dataset === 'converters'
            ? {
                version: '0.1',
                date: '07.10.2026',
                language: 'TS',
                status: 'Новый',
              }
            : {}),
        },
      ]);
      setSearch('');
      setSelectedId(id);
    } else
      setItems((prev) =>
        prev.map((item) =>
          item.id === selectedId ? { ...item, name: name.trim() } : item,
        ),
      );
    setEditor(null);
  };
  return (
    <ConfigProvider
      theme={{
        cssVar: { key: 'column-redesign' },
        algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#3765df',
          borderRadius: 8,
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        },
      }}
    >
      <main
        className={`column-redesign column-playground ${dark ? 'column-playground--dark' : ''}`}
      >
        <header className="column-playground__heading">
          <div>
            <span className="column-playground__eyebrow">
              UI KIT · РЕДИЗАЙН
            </span>
            <h1>Column</h1>
            <p>Компактные списки с группами, версиями и статусами.</p>
          </div>
          <Segmented
            aria-label="Вариант оформления"
            value={appearance}
            onChange={(value) => setAppearance(value as 'classic' | 'modern')}
            options={[
              { label: 'Текущий', value: 'classic' },
              { label: 'Новый', value: 'modern' },
            ]}
          />
        </header>
        <div className="column-playground__settings">
          <Segmented
            aria-label="Наполнение колонки"
            value={dataset}
            options={[
              { label: 'Преобразователи', value: 'converters' },
              { label: 'Модули', value: 'modules' },
              { label: 'Простой список', value: 'sections' },
            ]}
            onChange={(value) => {
              const next = value as Dataset;
              setDataset(next);
              setItems(datasets[next]);
              setSelectedId(datasets[next][0].id);
              setSearch('');
              setSearchField('name');
              setGrouped(next === 'converters');
              setSort(undefined);
              setEditor(null);
            }}
          />
          <label>
            <Switch checked={grouped} onChange={setGrouped} size="small" />{' '}
            Группировка
          </label>
          <label>
            <Switch checked={loading} onChange={setLoading} size="small" />{' '}
            Загрузка
          </label>
          <label>
            <Switch
              checked={dark}
              onChange={(value) => preview.setTheme(value ? 'dark' : 'light')}
              size="small"
            />{' '}
            Тёмная тема
          </label>
          <Button
            size="small"
            type="text"
            onClick={() => {
              setItems(datasets[dataset]);
              setSelectedId(datasets[dataset][0].id);
              setSearch('');
            }}
          >
            Сбросить данные
          </Button>
        </div>
        <div className="column-playground__workspace" style={{ height }}>
          <Column<Item>
            appearance={appearance}
            title={
              dataset === 'converters' ? (
                'Список преобразователей'
              ) : dataset === 'modules' ? (
                <div className="column-demo-custom-title">
                  <h3>Модули</h3>
                  <Button block onClick={() => setMapOpen(true)}>
                    Открыть карту связей
                  </Button>
                </div>
              ) : (
                'Разделы'
              )
            }
            totalItemsCount={items.length}
            columnKey="redesign-column-demo"
            items={filtered}
            renderItems={(item) => <RichItem item={item} dataset={dataset} />}
            selectedItemId={selectedId}
            setSelectedItemId={setSelectedId}
            searchValue={search}
            onChangeSearchValue={setSearch}
            searchPlaceholder={
              dataset === 'modules' ? 'Введите имя или ID' : 'Найти элемент…'
            }
            searchFields={[
              { label: 'Название', value: 'name' },
              { label: 'Описание', value: 'description' },
              { label: 'ID', value: 'id' },
            ]}
            searchFieldValue={searchField}
            onChangeSearchField={setSearchField}
            sortableFields={[{ label: 'Название', value: 'name' }]}
            sortValue={sort}
            onChangeSortValue={setSort}
            directionValue={direction}
            onChangeDirectionValue={setDirection}
            groupBy={grouped ? 'group' : undefined}
            renderHeaderGroup={(group, groupItems) => (
              <div className="column-demo-group">
                <span>{group}</span>
                <span>{groupItems.length}</span>
              </div>
            )}
            isLoading={loading}
            showAddBtn={dataset !== 'modules'}
            showUpdateBtn={dataset !== 'modules'}
            onAddItem={() => openEditor('add')}
            onUpdateItem={() => openEditor('edit')}
            onRemoveItem={(id) => {
              setItems((prev) => prev.filter((item) => item.id !== id));
              setSelectedId('');
            }}
            removeConfirmDescription={
              selected
                ? `«${selected.name}» будет удалён из списка.`
                : undefined
            }
          />
          <section className="column-playground__detail" aria-live="polite">
            {selected ? (
              <>
                <Tag variant="filled">{selected.group}</Tag>
                <h2>{selected.name}</h2>
                <div className="column-playground__metadata">
                  {selected.version && <Tag>Версия {selected.version}</Tag>}
                  {selected.language && <Tag>{selected.language}</Tag>}
                  {selected.status && <Tag>{selected.status}</Tag>}
                </div>
                <p>{selected.description}</p>
                <Button onClick={() => openEditor('edit')}>
                  Редактировать
                </Button>
              </>
            ) : (
              <>
                <h2>Выберите элемент</h2>
                <p>Здесь появятся сведения о выбранном элементе.</p>
              </>
            )}
          </section>
        </div>
        <footer className="column-playground__footer">
          Потяните границу колонки, чтобы изменить ширину. Стрелка на границе
          сворачивает колонку.
        </footer>
        <Modal
          title="Карта связей · пример"
          open={mapOpen}
          onCancel={() => setMapOpen(false)}
          footer={null}
        >
          <p>Демонстрационные связи сервисов:</p>
          <div className="column-demo-map">
            <div>isp-admin-service</div>
            <span>↓</span>
            <div>isp-gate-service</div>
            <span>↓</span>
            <div>
              isp-config-service · isp-mapping-service · isp-lock-service
            </div>
          </div>
        </Modal>
        <Modal
          title={
            editor === 'add' ? 'Добавить элемент' : 'Редактировать элемент'
          }
          open={editor !== null}
          onCancel={() => setEditor(null)}
          onOk={saveItem}
          okText="Сохранить"
          cancelText="Отмена"
          okButtonProps={{ disabled: !name.trim() }}
          destroyOnHidden
        >
          <label htmlFor="column-item-name">Название</label>
          <Input
            id="column-item-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onPressEnter={saveItem}
            maxLength={120}
          />
        </Modal>
      </main>
    </ConfigProvider>
  );
}
const meta = {
  title: 'Редизайн/Column',
  component: ColumnPlayground,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ColumnPlayground>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {
  name: 'Рабочий пример',
  parameters: {
    docs: {
      description: {
        story:
          'Сравнение modern и classic на преобразователях и модулях: поиск, группы, выбор, добавление, редактирование и удаление с подтверждением. Кнопка карты связей передана через пользовательский title и открывает демонстрационное окно; это содержимое приложения, а не встроенная возможность Column.',
      },
    },
  },
};
