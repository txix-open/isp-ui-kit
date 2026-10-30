import type { Meta, StoryObj } from '@storybook/react'; // @ts-ignore
import { useState } from 'react';
import ReactJsonView from '../../components/JsonViewer';

const json = {
  string: 'this is a test string',
  integer: 42,
  array: [1, 2, 3, 'test', null],
  float: 3.14159,
  object: {
    'first-child': true,
    'second-child': false,
    'last-child': null,
  },
  string_number: '1234',
  date: '2024-05-02T09:11:06.360Z',
};

const meta: Meta<typeof ReactJsonView> = {
  component: ReactJsonView,
  title: 'Components/ReactJsonView',
  tags: ['autodocs'],
  argTypes: {
    src: {
      description: 'Данные для отрисовки',
      table: {
        type: { summary: 'json' },
      },
    },
    name: {
      description:
        'Содержит имя вашего корневого узла. Используйте null или false для отсутствия имени.',
      table: {
        type: { summary: 'string | false' },
        defaultValue: { summary: 'root' },
      },
      control: {
        type: 'text',
      },
    },
    theme: {
      description:
        'RJV поддерживает темы base-16. По умолчанию применяется пользовательская тема "rjv-default".',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'rjv-default' },
      },
      control: {
        type: 'text',
      },
    },
    style: {
      description:
        'Атрибуты стиля для контейнера react-json-view. Явные атрибуты стиля будут переопределять атрибуты, предоставленные темой.',
      table: {
        type: { summary: 'object' },
      },
    },
    iconStyle: {
      description:
        'Стиль иконок раскрытия/свертывания. Принимаемые значения: "circle", "triangle" или "square".',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'circle' },
      },
      control: {
        type: 'text',
      },
    },
    indentWidth: {
      description: 'Установка ширины отступа для вложенных объектов',
      table: {
        type: { summary: 'integer' },
        defaultValue: { summary: '4' },
      },
      control: {
        type: 'number',
      },
    },
    collapsed: {
      description:
        'Если установлено значение true, все узлы будут свернуты по умолчанию. Используйте целочисленное значение, чтобы свернуть на определенную глубину.',
      table: {
        type: { summary: 'boolean | integer' },
        defaultValue: { summary: 'false' },
      },
    },
    collapseStringsAfterLength: {
      description:
        'Если задано целое значение, строки будут обрываться на этой длине. После свернутых строк ставится многоточие. Содержимое строки можно развернуть или свернуть, щелкнув по ее значению.',
      table: {
        type: { summary: 'integer' },
        defaultValue: { summary: 'false' },
      },
    },
    shouldCollapse: {
      description:
        'Функция обратного вызова для контроля над тем, какие объекты и массивы должны быть свернуты по умолчанию. В обратный вызов передается объект, содержащий name, src, type ("array" или "object") и namespace',
      table: {
        type: { summary: '(field)=>{}' },
        defaultValue: { summary: 'false' },
      },
    },
    groupArraysAfterLength: {
      description:
        'Если задано целое значение, массивы будут отображаться в группах по количеству значений. Группы отображаются в виде скобок, которые можно разворачивать и сворачивать, нажимая на скобки.',
      table: {
        type: { summary: 'integer' },
        defaultValue: { summary: '100' },
      },
    },
    enableClipboard: {
      description:
        'Если значение prop не равно false, пользователь может копировать объекты и массивы в буфер обмена, нажав на значок буфера обмена. Поддерживаются обратные вызовы копирования.',
      table: {
        type: { summary: 'boolean or (copy)=>{}' },
        defaultValue: { summary: 'true' },
      },
    },
    displayObjectSize: {
      description:
        'Если установлено значение true, объекты и массивы помечаются размером',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    onEdit: {
      description:
        'Когда передается функция обратного вызова, функция редактирования включается. Обратный вызов вызывается перед завершением редактирования. Возврат false из функции onEdit предотвратит внесение изменений.',
      table: {
        type: { summary: '(edit)=>{}' },
        defaultValue: { summary: 'false' },
      },
      control: false,
    },
    onAdd: {
      description:
        'Когда передается функция обратного вызова, функция добавления включается. Обратный вызов вызывается перед завершением добавления. Возврат false из onAdd предотвратит внесение изменений.',
      table: {
        type: { summary: '(add)=>{}' },
        defaultValue: { summary: 'false' },
      },
      control: false,
    },
    defaultValue: {
      description:
        'Устанавливает значение по умолчанию, которое будет использоваться при добавлении элемента в json',
      table: {
        type: { summary: 'string | number | boolean | array | object' },
        defaultValue: { summary: 'null' },
      },
    },
    onDelete: {
      description:
        'Если передать функцию обратного вызова, то функция удаления будет включена. Обратный вызов вызывается перед завершением удаления. Возврат false из onDelete предотвратит внесение изменений',
      table: {
        type: { summary: '(delete)=>{}' },
        defaultValue: { summary: 'false' },
      },
      control: false,
    },
    onSelect: {
      description:
        'Когда функция передана, щелчок по значению вызывает вызов метода onSelect.',
      table: {
        type: { summary: '(select)=>{}' },
        defaultValue: { summary: 'false' },
      },
      control: false,
    },
    editKeys: {
      description: 'Установите значение true возможно редактирования ключей',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
      control: false,
    },
    sortKeys: {
      description: 'Установите значение true для сортировки ключей объектов',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
      control: false,
    },
    quotesOnKeys: {
      description:
        'установите значение false, чтобы убрать кавычки из ключей (например, "name": против name:).',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
      control: false,
    },
    validationMessage: {
      description:
        'Пользовательское сообщение для ошибок валидации в обратных вызовах onEdit, onAdd или onDelete',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Validation Error' },
      },
      control: false,
    },
    displayArrayKey: {
      description:
        'Если установлено значение true, индекс префиксных значений элементов',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
      control: false,
    },
    search: {
      description:
        'Запрос поиска: узлы с совпадениями (ключи объектов, примитивные значения) автоматически раскрываются, текст вхождений подсвечивается.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '(не задан)' },
      },
      control: {
        type: 'text',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ReactJsonView>;

export const JsonView: Story = {
  name: 'Пример',
  render: (args) => {
    return (
      <div>
        <ReactJsonView onEdit={() => {}} editKeys={true} src={json} {...args} />
      </div>
    );
  },
};

export const Interactive: Story = {
  name: 'Интерактив (onEdit/onAdd/onDelete)',
  parameters: { docs: { disable: true } },
  render: () => (
    <div>
      <ReactJsonView
        src={json}
        onEdit={() => {}}
        onAdd={() => {}}
        onDelete={() => {}}
        onSelect={() => {}}
        defaultValue={{ default: 'value' }}
      />
    </div>
  ),
};

export const ValidationFail: Story = {
  name: 'Валидация (отказ в onEdit/onAdd)',
  parameters: { docs: { disable: true } },
  render: () => (
    <div>
      <ReactJsonView src={json} onEdit={() => false} onAdd={() => false} />
    </div>
  ),
};

const largeLogs = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  ts: `2026-10-30T${String(i % 24).padStart(2, '0')}:${String(
    Math.floor(i / 24) % 60,
  ).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}.000Z`,
  level: ['info', 'warn', 'error', 'debug'][i % 4],
  service: `svc-${i % 7}`,
  message: `Request handled in ${i % 997}ms`,
  longMessage: `Detailed diagnostics for log entry ${i}: upstream latency ${i % 500}ms, queue depth ${i % 97}, retry ${i % 3}, trace ${i.toString(16)}, payload ${'x'.repeat(i % 300)}`,
}));

const longArray = Array.from({ length: 12 }, (_, i) => `value-${i}`);

export const GroupedArrays: Story = {
  name: 'Группировка массивов',
  parameters: { docs: { disable: true } },
  render: () => (
    <div>
      <ReactJsonView src={{ list: longArray }} groupArraysAfterLength={4} />
    </div>
  ),
};

export const LargeData: Story = {
  name: 'Большие данные (maxHeight, виртуализация)',
  parameters: { docs: { disable: true } },
  render: (args) => (
    <div>
      <ReactJsonView
        src={{ logs: largeLogs }}
        name="logs-root"
        maxHeight={600}
        search={args.search ?? 'latency'}
        onEdit={() => {}}
        onAdd={() => {}}
        onDelete={() => {}}
        onSelect={() => {}}
      />
    </div>
  ),
};

const searchData = {
  server: {
    host: '10.0.4.2',
    ports: [8080, 8443],
    tls: {
      enabled: true,
      cert: 'server.crt',
      rotated: '2026-10-01',
    },
  },
  client: {
    id: 'c-1042',
    lastError: 'connection reset by peer at 10:11:12',
    retries: 3,
  },
  metrics: {
    latency_ms: 42.5,
    throughput: 1250,
    errors: 0,
  },
};

export const Search: Story = {
  name: 'Поиск (search, авто-раскрытие + подсветка)',
  parameters: { docs: { disable: true } },
  render: () => {
    const [query, setQuery] = useState('1042');
    return (
      <div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск (search)"
          style={{
            marginBottom: 8,
            padding: '4px 6px',
            fontFamily: 'monospace',
          }}
        />
        <ReactJsonView
          src={searchData}
          name="data"
          collapsed
          search={query}
          onEdit={() => {}}
        />
      </div>
    );
  },
};
