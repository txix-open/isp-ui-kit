import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { Meta, StoryObj } from '@storybook/react';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';

import { PcsButton, PcsFilterFieldType, PcsTableView } from '../../PcsKit';
import type {
  PcsExportOption,
  PcsFilterField,
  PcsTableSortInfo,
} from '../../PcsKit';

import './pcs-kit-storybook.scss';

interface WorkspaceItem {
  id: string;
  name: string;
  owner: string;
  status: 'draft' | 'active' | 'archived';
  section: 'content' | 'support' | 'billing';
  updatedAt: string;
  requests: number;
}

const rows: WorkspaceItem[] = [
  {
    id: '1',
    name: 'Список заявок',
    owner: 'Мария Смирнова',
    status: 'active',
    section: 'support',
    updatedAt: '18.06.2026',
    requests: 124,
  },
  {
    id: '2',
    name: 'Платежные операции',
    owner: 'Илья Морозов',
    status: 'draft',
    section: 'billing',
    updatedAt: '17.06.2026',
    requests: 48,
  },
  {
    id: '3',
    name: 'Контентный календарь',
    owner: 'Анна Сергеева',
    status: 'active',
    section: 'content',
    updatedAt: '16.06.2026',
    requests: 81,
  },
  {
    id: '4',
    name: 'Архив обращений',
    owner: 'Олег Петров',
    status: 'archived',
    section: 'support',
    updatedAt: '11.06.2026',
    requests: 12,
  },
];

const statusLabels: Record<WorkspaceItem['status'], string> = {
  draft: 'Черновик',
  active: 'Активно',
  archived: 'Архив',
};

const sectionLabels: Record<WorkspaceItem['section'], string> = {
  content: 'Контент',
  support: 'Поддержка',
  billing: 'Оплата',
};

const filterFields: PcsFilterField[] = [
  {
    name: 'status',
    label: 'Статус',
    type: PcsFilterFieldType.Select,
    options: [
      { value: 'draft', label: 'Черновик' },
      { value: 'active', label: 'Активно' },
      { value: 'archived', label: 'Архив' },
    ],
  },
  {
    name: 'section',
    label: 'Раздел',
    type: PcsFilterFieldType.MultiSelect,
    options: [
      { value: 'content', label: 'Контент' },
      { value: 'support', label: 'Поддержка' },
      { value: 'billing', label: 'Оплата' },
    ],
  },
  {
    name: 'requests',
    label: 'Заявки',
    type: PcsFilterFieldType.NumberRange,
    selectedLabel: ({ from, to }) => {
      if (from && to) return `Заявки: ${from}-${to}`;
      if (from) return `Заявки от ${from}`;
      if (to) return `Заявки до ${to}`;
      return undefined;
    },
  },
];

const meta: Meta = {
  title: 'PcsKit/TableView',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'PcsTableView собирает рабочую страницу списка из поиска, фильтра, тэгов выбранных фильтров, экспорта, таблицы и нижнего меню действий.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const WorkspaceList: Story = {
  name: 'Рабочий список',
  render: () => {
    const [query, setQuery] = useState('');
    const [filterValues, setFilterValues] = useState<Record<string, unknown>>({
      status: 'active',
    });
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(['1']);
    const [sortInfo, setSortInfo] = useState<PcsTableSortInfo>({
      field: 'updatedAt',
      order: null,
    });
    const [exportText, setExportText] = useState('Выгрузка не запускалась');

    const columns: ColumnsType<WorkspaceItem> = [
      {
        title: 'Название',
        dataIndex: 'name',
        key: 'name',
        sorter: true,
      },
      {
        title: 'Ответственный',
        dataIndex: 'owner',
        key: 'owner',
      },
      {
        title: 'Статус',
        dataIndex: 'status',
        key: 'status',
        render: (status: WorkspaceItem['status']) => statusLabels[status],
      },
      {
        title: 'Раздел',
        dataIndex: 'section',
        key: 'section',
        render: (section: WorkspaceItem['section']) => sectionLabels[section],
      },
      {
        title: 'Обновлено',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        sorter: true,
      },
      {
        title: 'Заявки',
        dataIndex: 'requests',
        key: 'requests',
        sorter: true,
      },
    ];

    const filteredRows = useMemo(() => {
      const status = filterValues.status as WorkspaceItem['status'] | undefined;
      const sections = filterValues.section as
        | WorkspaceItem['section'][]
        | undefined;
      const requests = filterValues.requests as [string, string] | undefined;
      const minRequests = Number(requests?.[0] || 0);
      const maxRequests = Number(requests?.[1] || Infinity);
      const normalizedQuery = query.toLowerCase();

      return rows.filter((row) => {
        const matchesQuery =
          !normalizedQuery ||
          [
            row.name,
            row.owner,
            statusLabels[row.status],
            sectionLabels[row.section],
          ]
            .join(' ')
            .toLowerCase()
            .includes(normalizedQuery);
        const matchesStatus = !status || row.status === status;
        const matchesSection =
          !sections?.length || sections.includes(row.section);
        const matchesRequests =
          row.requests >= minRequests && row.requests <= maxRequests;

        return (
          matchesQuery && matchesStatus && matchesSection && matchesRequests
        );
      });
    }, [filterValues, query]);

    const handleExport = (count: PcsExportOption) => {
      setExportText(
        count === 'all'
          ? 'Запрошена выгрузка всех записей'
          : `Запрошена выгрузка ${count} записей`,
      );
    };

    return (
      <div className="pcs-kit-story pcs-kit-story--table-view">
        <PcsTableView
          actions={
            <PcsButton icon={<PlusOutlined />} variant="lightblue">
              Добавить
            </PcsButton>
          }
          bottomMenu={{
            actions: [
              {
                key: 'edit',
                label: `Редактировать (${selectedRowKeys.length})`,
                icon: <EditOutlined />,
                disabled: selectedRowKeys.length !== 1,
                onClick: () => undefined,
              },
              {
                key: 'delete',
                label: 'Удалить',
                icon: <DeleteOutlined />,
                disabled: selectedRowKeys.length === 0,
                onClick: () => undefined,
              },
            ],
          }}
          exportAction={{
            options: [10, 50, 'all'],
            onExport: handleExport,
          }}
          filter={{
            fields: filterFields,
            values: filterValues,
            onApply: setFilterValues,
            onReset: () => setFilterValues({}),
          }}
          search={{
            value: query,
            placeholder: 'Поиск по названию или ответственному',
            onChange: setQuery,
          }}
          table={{
            columns,
            data: filteredRows,
            layout: 'container',
            minWidth: 920,
            rowKey: 'id',
            selection: {
              selectedRowKeys,
              onChange: setSelectedRowKeys,
            },
            sorting: {
              field: sortInfo.field,
              order: sortInfo.order,
              onChange: setSortInfo,
            },
            pagination: {
              current: 1,
              pageSize: 10,
              total: filteredRows.length,
              showSizeChanger: true,
            },
          }}
        />
        <div className="pcs-kit-story__export-status">{exportText}</div>
      </div>
    );
  },
};
