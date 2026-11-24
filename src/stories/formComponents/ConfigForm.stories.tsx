import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import { ConfigForm } from '../../FormComponents';
import {
  FieldType,
  InputType,
  FormConfigType,
  FieldConfigType,
} from '../../FormComponents/ConfigForm/config-form.type';

const field = (
  id: string,
  label: string,
  inputType = InputType.INPUT,
  settings: FieldConfigType['settings'] = {},
  type = FieldType.SINGLE,
): FieldConfigType => ({ id, name: id, label, inputType, settings, type });
const config: FormConfigType = {
  name: 'Настройки подключения',
  id: 'connection',
  fieldId: 'name',
  endpoints: {},
  fields: [
    field('name', 'Название подключения', InputType.INPUT, {
      rules: { required: true },
    }),
    field('environment', 'Окружение', InputType.SELECT, {
      rules: { required: true },
      options: [
        { value: 'test', label: 'Тестовое' },
        { value: 'production', label: 'Производственное — основная площадка' },
      ],
    }),
    field('password', 'Пароль', InputType.INPUT_PASSWORD),
    field('retries', 'Количество повторов', InputType.INPUT_NUMBER),
    field('description', 'Описание', InputType.TEXT_AREA, {
      rules: { minRows: 2, maxRows: 5 },
    }),
    field('enabled', 'Подключение активно', InputType.CHECKBOX),
    field('mode', 'Режим запуска', InputType.RADIO_GROUP, {
      options: [
        { value: 'auto', label: 'Автоматический' },
        { value: 'manual', label: 'Ручной' },
      ],
    }),
    field('modules', 'Модули', InputType.MULTI_SELECT, {
      options: [
        { value: 'admin', label: 'Администрирование' },
        { value: 'monitor', label: 'Мониторинг' },
      ],
    }),
    field('hosts', 'Адреса серверов', InputType.INPUT, {}, FieldType.ARRAY),
    field(
      'headers',
      'Дополнительные заголовки',
      InputType.INPUT,
      {},
      FieldType.OBJECT,
    ),
  ],
};
const record = {
  name: 'Основное подключение',
  environment: 'test',
  password: '',
  retries: 3,
  description: 'Синхронизация модулей',
  enabled: true,
  mode: 'auto',
  modules: ['monitor'],
  hosts: ['https://api.example.test', 'https://backup.example.test'],
  headers: { 'X-Environment': 'test' },
};
const initialData = [record];

const meta: Meta<typeof ConfigForm> = {
  component: ConfigForm,
  title: 'FormComponents/ConfigForm',
  tags: ['autodocs'],
  args: { config, crudApi: {}, data: initialData },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Форма по конфигурации: одиночные поля, массивы и словарь. Оформление полей остаётся стандартным Ant Design. Сохранение запускается кнопкой или Enter после проверки React Hook Form; асинхронный onSubmit включает состояние загрузки. Исключение показывает ошибку над прокруткой, сохраняя введённые значения; следующая отправка повторяет сохранение. После смены data поздняя ошибка старой отправки игнорируется. Начальные значения берутся из data[0]. Для одиночных полей ключ значения — id, для массивов и объектов — name. Из settings.rules применяются required и minRows/maxRows для TextArea; min/max и minLength/maxLength сейчас не подключены.',
      },
    },
  },
  argTypes: {
    config: {
      description:
        'Описание и порядок полей. Изменение конфигурации не очищает накопленные значения.',
    },
    crudApi: {
      description:
        'Источники опций: crudApi[settings.dataSource.config].useGetListQuery(), возвращающий data, isLoading/isFetching и необязательные isError/error/refetch. Ошибка отображается отдельно от пустого списка; refetch включает кнопку повторной загрузки.',
    },
    data: {
      description:
        'Массив записей; форма загружает data[0] через reset и снимает сообщение старой ошибки. Запрос сохранения при этом не отменяется.',
    },
    onSubmit: {
      description:
        'Валидные значения формы. Можно вернуть Promise; во время сохранения кнопка показывает загрузку. Исключение или отклонение Promise обрабатывается формой; если обработать ошибку внутри callback без повторного throw, своё сообщение показывает приложение.',
    },
  },
};
export default meta;
type Story = StoryObj<typeof ConfigForm>;

const ExampleForm = ({
  args,
  delay = 0,
  height,
  failFirstSave = false,
}: {
  args: React.ComponentProps<typeof ConfigForm>;
  delay?: number;
  height?: number;
  failFirstSave?: boolean;
}) => {
  const [saved, setSaved] = useState<Record<string, unknown> | null>(null);
  const [saveCount, setSaveCount] = useState(0);
  const attempts = useRef(0);
  return (
    <div style={{ maxWidth: 640, minWidth: 0 }}>
      <div style={{ height, minWidth: 0 }}>
        <ConfigForm
          {...args}
          onSubmit={async (values) => {
            if (delay)
              await new Promise((resolve) => setTimeout(resolve, delay));
            if (failFirstSave && attempts.current++ === 0)
              throw new Error('Storybook: save failed');
            const safeValues = Object.fromEntries(
              Object.entries(values).filter(([key]) => key !== 'password'),
            );
            setSaved(safeValues);
            setSaveCount((count) => count + 1);
          }}
        />
      </div>
      {saved && (
        <div role="status">
          <p>Форма сохранена. Пароль исключён из примера результата.</p>
          <p>Сохранений: {saveCount}.</p>
          <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
            {JSON.stringify(saved, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
export const Example: Story = {
  name: 'Заполнение и сохранение',
  render: (args) => <ExampleForm args={args} />,
};
export const Validation: Story = {
  name: 'Обязательные поля и фокус на ошибке',
  args: { data: [{}] },
  render: Example.render,
  parameters: {
    docs: {
      description: {
        story:
          'Сохраните пустую форму: название и окружение обязательны, фокус переходит к первому ошибочному полю. Остальные значения можно оставить пустыми.',
      },
    },
  },
};
export const AsyncSave: Story = {
  name: 'Асинхронное сохранение',
  render: (args) => <ExampleForm args={args} delay={2000} />,
  parameters: {
    docs: {
      description: {
        story:
          'Сохранение занимает две секунды. Кнопка показывает загрузку, повторное нажатие или Enter не отправляет форму ещё раз.',
      },
    },
  },
};
export const FailedSave: Story = {
  name: 'Ошибка сохранения и повторная попытка',
  render: (args) => <ExampleForm args={args} failFirstSave height={360} />,
  parameters: {
    docs: {
      description: {
        story:
          'Первая отправка завершается ошибкой. Сообщение остаётся видимым над прокруткой; значения сохраняются. Повторное сохранение успешно.',
      },
    },
  },
};
export const SwitchDuringSave: Story = {
  name: 'Смена записи во время сохранения',
  render: function SwitchRecord(args) {
    const [data, setData] = useState(initialData);
    return (
      <div style={{ maxWidth: 640 }}>
        <Button
          onClick={() => setData([{ ...record, name: 'Другое подключение' }])}
        >
          Загрузить другую запись
        </Button>
        <ConfigForm
          {...args}
          data={data}
          onSubmit={async () => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            throw new Error('Storybook: delayed save failure');
          }}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Нажмите «Сохранить», затем в течение двух секунд загрузите другую запись. Поздняя ошибка старой отправки не должна появиться у новой записи. При сохранении без смены записи ошибка отображается.',
      },
    },
  },
};
export const ConstrainedHeight: Story = {
  name: 'Форма в ограниченной области',
  render: (args) => <ExampleForm args={args} height={360} />,
  parameters: {
    docs: {
      description: {
        story:
          'Родитель задаёт высоту 360 px. Поля прокручиваются внутри, сохранение остаётся видимым. Проверьте также ширину 360 px и тёмную тему в панели Storybook.',
      },
    },
  },
};
export const Empty: Story = {
  name: 'Конфигурация без полей',
  args: { config: { ...config, fields: [] } },
  render: Example.render,
};
export const EmptyOptions: Story = {
  name: 'Пустые варианты выбора',
  args: {
    config: {
      ...config,
      fields: [
        field('environment', 'Окружение', InputType.SELECT, {
          options: [],
          rules: { required: true },
        }),
      ],
    },
    data: [{}],
  },
  render: Example.render,
  parameters: {
    docs: {
      description: {
        story:
          'Пустой список отображается обычным Select и участвует в валидации. Отсутствие вариантов больше не означает бесконечный скелетон загрузки.',
      },
    },
  },
};
function useEnvironments() {
  const [data, setData] = useState<{ id: string; title: string }[]>();
  useEffect(() => {
    const timer = setTimeout(
      () =>
        setData([
          { id: 'test', title: 'Тестовое' },
          { id: 'production', title: 'Производственное' },
        ]),
      1500,
    );
    return () => clearTimeout(timer);
  }, []);
  return { data, isLoading: !data };
}
const sourceField = field('environment', 'Окружение из API', InputType.SELECT, {
  rules: { required: true },
  dataSource: { config: 'environments', valueField: 'id', labelField: 'title' },
});
export const RemoteOptions: Story = {
  name: 'Загрузка вариантов из API',
  args: {
    config: { ...config, fields: [sourceField] },
    crudApi: { environments: { useGetListQuery: useEnvironments } },
    data: [{}],
  },
  render: Example.render,
  parameters: {
    docs: {
      description: {
        story:
          'Локальная имитация API возвращает варианты через 1,5 секунды. Поле остаётся в форме во время загрузки, поэтому required продолжает работать.',
      },
    },
  },
};
function useFailedEnvironments() {
  const [recovered, setRecovered] = useState(false);
  return {
    data: recovered ? [{ id: 'test', title: 'Тестовое' }] : undefined,
    isError: !recovered,
    refetch: () => setRecovered(true),
  };
}
export const FailedOptions: Story = {
  name: 'Ошибка загрузки вариантов и повторная попытка',
  args: {
    config: { ...config, fields: [sourceField] },
    crudApi: { environments: { useGetListQuery: useFailedEnvironments } },
    data: [{}],
  },
  render: Example.render,
};
const DynamicExample = ({
  args,
}: {
  args: React.ComponentProps<typeof ConfigForm>;
}) => {
  const [extra, setExtra] = useState(false);
  return (
    <>
      <Button onClick={() => setExtra(!extra)}>
        {extra ? 'Скрыть' : 'Добавить'} поле из API
      </Button>
      <ExampleForm
        args={{
          ...args,
          config: {
            ...config,
            fields: extra
              ? [config.fields[0], sourceField]
              : [config.fields[0]],
          },
          crudApi: { environments: { useGetListQuery: useEnvironments } },
        }}
      />
    </>
  );
};
export const DynamicConfiguration: Story = {
  name: 'Изменение состава полей',
  render: (args) => <DynamicExample args={args} />,
  parameters: {
    docs: {
      description: {
        story:
          'Добавление поля с API не меняет порядок хуков родительской формы. Введённое название сохраняется; скрытые значения остаются в модели по прежним настройкам React Hook Form.',
      },
    },
  },
};
