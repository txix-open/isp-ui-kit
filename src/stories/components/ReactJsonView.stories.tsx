import type { Meta, StoryObj } from '@storybook/react'; // @ts-ignore
import ReactJsonView from '../../components/ReactJsonView/js';

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
  },
};

export default meta;

type Story = StoryObj<typeof ReactJsonView>;

export const JsonView: Story = {
  render: (args) => {
    return (
      <div>
        <ReactJsonView onEdit={() => {}} editKeys={true} src={json} />
      </div>
    );
  },
};
