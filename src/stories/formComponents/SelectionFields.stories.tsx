import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from 'antd';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  FormSelect,
  FormTreeSelect,
  FormAutoComplete,
} from '../../FormComponents';

const options = [
  {
    value: 'mapping',
    label: 'Обработка входящих сообщений и преобразование данных',
  },
  {
    value: 'delivery',
    label: 'Доставка уведомлений внешним информационным системам',
  },
  { value: 'validation', label: 'Проверка обязательных полей', disabled: true },
];
const treeData = [
  {
    title: 'Интеграционные сервисы',
    value: 'group',
    selectable: false,
    children: options.map((item) => ({
      title: item.label,
      value: item.value,
      disabled: item.disabled,
    })),
  },
];

function SelectionExample({
  forwardEvents = false,
  disabled = false,
}: {
  forwardEvents?: boolean;
  disabled?: boolean;
}) {
  const { control, watch, reset, handleSubmit } = useForm({
    defaultValues: {
      settings: {
        module: null as string | null,
        modules: [] as string[],
        tree: null as string | null,
        endpoint: '',
      },
    },
  });
  const [submitted, setSubmitted] = useState(false);
  const [events, setEvents] = useState({
    select: 0,
    tree: 0,
    complete: 0,
    blur: 0,
  });
  const bump = (key: keyof typeof events) =>
    setEvents((prev) => ({ ...prev, [key]: prev[key] + 1 }));
  const required = { required: { value: true, message: 'Выберите модуль.' } };
  const values = watch('settings');
  return (
    <form
      style={{ maxWidth: 560 }}
      onSubmit={handleSubmit(
        () => setSubmitted(true),
        () => setSubmitted(false),
      )}
    >
      <p>
        Базовый вид Ant Design. Длинные варианты, поиск, очистка, несколько
        значений и вложенные имена полей.
      </p>
      <FormSelect
        control={control}
        name="settings.module"
        id="selection-module"
        label="Модуль обработки входящих сообщений"
        options={options}
        allowClear
        showSearch
        optionFilterProp="label"
        style={{ width: '100%' }}
        disabled={disabled}
        rules={required}
        forwardEvents={forwardEvents}
        onChange={() => bump('select')}
        onBlur={() => bump('blur')}
        formItemProps={{
          extra: 'Очистка одиночного Select сохраняет null, как прежде.',
        }}
      />
      <FormSelect
        control={control}
        name="settings.modules"
        id="selection-multiple"
        label="Дополнительные модули"
        options={options}
        mode="multiple"
        allowClear
        maxTagCount="responsive"
        optionFilterProp="label"
        style={{ width: '100%' }}
        disabled={disabled}
      />
      <FormTreeSelect
        control={control}
        name="settings.tree"
        id="selection-tree"
        label="Модуль в дереве сервисов"
        treeData={treeData}
        treeDefaultExpandAll
        allowClear
        showSearch
        treeNodeFilterProp="title"
        style={{ width: '100%' }}
        disabled={disabled}
        forwardEvents={forwardEvents}
        onChange={() => bump('tree')}
        onBlur={() => bump('blur')}
      />
      <FormAutoComplete
        control={control}
        name="settings.endpoint"
        id="selection-complete"
        label="Адрес назначения"
        options={[
          { value: 'https://mapping.example.test' },
          { value: 'https://delivery.example.test' },
        ]}
        allowClear
        style={{ width: '100%' }}
        disabled={disabled}
        forwardEvents={forwardEvents}
        onChange={() => bump('complete')}
        onBlur={() => bump('blur')}
        formItemProps={{
          extra:
            'Можно выбрать подсказку или ввести свой адрес. По умолчанию пробелы по краям обрезаются на blur.',
        }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <Button htmlType="submit" type="primary" disabled={disabled}>
          Проверить выбор
        </Button>
        <Button
          onClick={() => {
            reset();
            setSubmitted(false);
            setEvents({ select: 0, tree: 0, complete: 0, blur: 0 });
          }}
        >
          Сбросить форму
        </Button>
      </div>
      <pre
        data-testid="selection-summary"
        role="status"
        style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}
      >
        {JSON.stringify({ values, events, submitted }, null, 2)}
      </pre>
    </form>
  );
}
const meta = {
  title: 'Редизайн/Поля выбора',
  component: SelectionExample,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Select, TreeSelect и AutoComplete сохраняют базовое оформление Ant Design. Обязательность, подписи и ошибки используют общую обёртку. Прежние callbacks сохранены: Select.onChange работает без новых опций, TreeSelect/AutoComplete передают перекрытые события только при forwardEvents=true. У AutoComplete trimOnBlur=true по умолчанию. Примеры дат и переключателей доступны в разделе «Редизайн/Переключатели и даты».',
      },
    },
  },
} satisfies Meta<typeof SelectionExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Example: Story = { name: 'Выбор, поиск и очистка' };
export const ForwardedEvents: Story = {
  name: 'Новые события включены',
  args: { forwardEvents: true },
};
export const Disabled: Story = {
  name: 'Недоступные поля',
  args: { disabled: true },
};
