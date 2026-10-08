import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { List, Tag, Tooltip } from 'antd';
import { Column, NoData, EmptyData } from '../../Layout';
import ThreeColumnsFrame from './ThreeColumns/ThreeColumnsFrame';

const meta = {
  title: 'Layout/ThreeColumns',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
type Item = { id: string; name: string; description: string };
const projects: Item[] = [
  { id: 'p1', name: 'Личный кабинет', description: 'Клиенты и обслуживание' },
  { id: 'p2', name: 'Интеграции', description: 'Подключения внешних систем' },
  { id: 'p3', name: 'Новый проект', description: 'Пока без задач' },
];
const tasks: Record<string, Item[]> = {
  p1: [
    {
      id: 't1',
      name: 'Профиль клиента',
      description: 'Контактные данные и настройки',
    },
    { id: 't2', name: 'История платежей', description: 'Расчёты и квитанции' },
  ],
  p2: [
    {
      id: 't3',
      name: 'Проверка обязательных полей',
      description: 'Контроль входящих данных',
    },
  ],
  p3: [],
};
const renderItem = (item: Item) => (
  <List.Item>
    <Tooltip title={item.name}>
      <List.Item.Meta title={item.name} description={item.description} />
    </Tooltip>
  </List.Item>
);

function ThreeColumnsExample() {
  const [projectId, setProjectId] = useState('');
  const [taskId, setTaskId] = useState('');
  const [projectSearch, setProjectSearch] = useState('');
  const [taskSearch, setTaskSearch] = useState('');
  const projectTasks = tasks[projectId] ?? [];
  const selectedTask = projectTasks.find((task) => task.id === taskId);
  return (
    <ThreeColumnsFrame>
      <Column<Item>
        columnKey="three-columns-projects"
        title="Проекты"
        items={projects.filter((item) =>
          item.name.toLowerCase().includes(projectSearch.toLowerCase()),
        )}
        totalItemsCount={projects.length}
        selectedItemId={projectId}
        setSelectedItemId={(id) => {
          setProjectId(id);
          setTaskId('');
          setTaskSearch('');
        }}
        searchValue={projectSearch}
        onChangeSearchValue={setProjectSearch}
        renderItems={renderItem}
        showAddBtn={false}
        showUpdateBtn={false}
        showRemoveBtn={false}
      />
      <div
        style={{
          width: projectId && projectTasks.length > 0 ? 'auto' : 300,
          flexShrink: 0,
          minHeight: 0,
        }}
      >
        {!projectId ? (
          <EmptyData
            content={
              <>
                <h2>Выберите проект</h2>
                <p>Его задачи появятся в этой колонке.</p>
              </>
            }
          />
        ) : projectTasks.length === 0 ? (
          <NoData
            content={
              <>
                <h2>В проекте нет задач</h2>
                <p>После добавления задачи появятся здесь.</p>
              </>
            }
          />
        ) : (
          <Column<Item>
            columnKey="three-columns-tasks"
            title="Задачи проекта"
            items={projectTasks.filter((item) =>
              item.name.toLowerCase().includes(taskSearch.toLowerCase()),
            )}
            totalItemsCount={projectTasks.length}
            selectedItemId={taskId}
            setSelectedItemId={setTaskId}
            searchValue={taskSearch}
            onChangeSearchValue={setTaskSearch}
            renderItems={renderItem}
            showAddBtn={false}
            showUpdateBtn={false}
            showRemoveBtn={false}
          />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 240, minHeight: 0 }}>
        {selectedTask ? (
          <div
            className="column-state"
            style={{
              textAlign: 'left',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
            }}
          >
            <div>
              <Tag>Задача</Tag>
              <h2 style={{ marginTop: 16 }}>{selectedTask.name}</h2>
              <p>{selectedTask.description}</p>
            </div>
          </div>
        ) : (
          <EmptyData />
        )}
      </div>
    </ThreeColumnsFrame>
  );
}
export const CombinedLayout: Story = {
  name: 'Три колонки: проекты, задачи и подробности',
  parameters: {
    docs: {
      description: {
        story:
          'Выберите проект и задачу, чтобы открыть подробности. Смена проекта сбрасывает выбранную задачу. Поиск фильтрует данные в родителе; проект без задач показывает NoData, ожидание выбора — EmptyData. Действия изменения данных в этом примере скрыты.',
      },
    },
  },
  render: () => <ThreeColumnsExample />,
};
export const CombinedColumnWithEmptyData: Story = {
  name: 'Колонка и пустое состояние',
  parameters: {
    docs: {
      description: {
        story:
          'Пример размещения списка рядом с EmptyData. Поиск и выбор строки работают, а правая область намеренно остаётся в состоянии ожидания. Связанное отображение подробностей показано в примере с тремя колонками.',
      },
    },
  },
  render: () => {
    const [selectedId, setSelectedId] = useState('');
    const [search, setSearch] = useState('');
    return (
      <ThreeColumnsFrame>
        <Column<Item>
          title="Проекты"
          columnKey="three-columns-empty-example"
          items={projects.filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase()),
          )}
          selectedItemId={selectedId}
          setSelectedItemId={setSelectedId}
          searchValue={search}
          onChangeSearchValue={setSearch}
          renderItems={renderItem}
          showAddBtn={false}
          showUpdateBtn={false}
          showRemoveBtn={false}
        />
        <EmptyData />
      </ThreeColumnsFrame>
    );
  },
};
