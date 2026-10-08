import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import SearchInput from '../../components/SearchInput/SearchInput';
import { useState } from 'react';

function SearchModes({ submit }: { submit: boolean }) {
  const [draft, setDraft] = useState('');
  const [query, setQuery] = useState('');
  const items = [
    'isp-mapping-service',
    'isp-config-service',
    'isp-gate-service',
  ];
  const results = items.filter((item) => item.includes(query.toLowerCase()));
  return (
    <div style={{ maxWidth: 480 }}>
      <SearchInput
        placeholder="Найти…"
        aria-label="Поиск модулей"
        value={draft}
        onChange={(event) => {
          const value = event.target.value;
          setDraft(value);
          if (!submit || value === '') setQuery(value);
        }}
        onPressEnter={() => setQuery(draft)}
      />
      <p style={{ color: 'var(--ant-color-text-secondary)' }}>
        {submit
          ? 'Введите название модуля и нажмите Enter.'
          : 'Поиск по названию модуля при вводе.'}
      </p>
      <p role="status">Найдено: {results.length}</p>
      <ul>
        {results.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

const meta = {
  title: 'Components/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Поле поиска с нейтральной иконкой, очисткой и видимым фокусом. Наследует Input props: размер, disabled, readOnly, status и обработчики. Не выполняет фильтрацию и не добавляет задержку ввода. Ввод синхронизирован с Controls; тема и ширина задаются в панели Storybook.',
      },
    },
  },
  args: { placeholder: 'Найти элемент…', value: '', 'aria-label': 'Поиск' },
  render: function SearchExample(args) {
    const [, updateArgs] = useArgs();
    return (
      <div style={{ width: '100%', maxWidth: 480 }}>
        <SearchInput
          {...args}
          onChange={(event) => updateArgs({ value: event.target.value })}
        />
      </div>
    );
  },
} satisfies Meta<typeof SearchInput>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Input: Story = { name: 'Поиск и очистка' };
export const Filled: Story = {
  name: 'С заполненным запросом',
  args: { value: 'isp-config-service' },
};
export const Disabled: Story = {
  name: 'Недоступен',
  args: { disabled: true, value: 'Текущий запрос' },
};
export const LongPlaceholder: Story = {
  name: 'Длинная подсказка',
  args: {
    placeholder: 'Введите название, идентификатор или описание элемента',
  },
};
export const ReadOnly: Story = {
  name: 'Только просмотр',
  args: { readOnly: true, allowClear: false, value: 'isp-mapping-service' },
};
export const Error: Story = {
  name: 'Ошибка запроса',
  args: { status: 'error', value: 'Некорректный запрос', 'aria-invalid': true },
};
export const LiveSearch: Story = {
  name: 'Поиск при вводе',
  render: () => <SearchModes submit={false} />,
  parameters: {
    docs: {
      description: {
        story:
          'Приложение фильтрует список при каждом изменении. Короткий placeholder оставляет место запросу; описание доступных данных находится под полем.',
      },
    },
  },
};
export const SubmitSearch: Story = {
  name: 'Поиск по Enter',
  render: () => <SearchModes submit />,
  parameters: {
    docs: {
      description: {
        story:
          'Черновик запроса хранится отдельно от выполненного поиска. Enter обновляет результаты; очистка возвращает весь список. Режим реализован приложением без изменения API SearchInput.',
      },
    },
  },
};
