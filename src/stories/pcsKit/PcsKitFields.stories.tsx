import type { Meta, StoryObj } from '@storybook/react';
import dayjs from 'dayjs';
import { useState } from 'react';

import {
  PcsDateField,
  PcsDateRangeField,
  PcsNumberRangeField,
  PcsSelectField,
  PcsSelectMultipleField,
  PcsTagInput,
  PcsTextAreaField,
  PcsTextField,
} from '../../PcsKit';
import type {
  PcsDateRangeValue,
  PcsNumberRangeValue,
  PcsSelectFieldChangeValue,
} from '../../PcsKit';

import './pcs-kit-storybook.scss';

const meta: Meta = {
  title: 'PcsKit/Fields',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Формовые контролы PcsKit без привязки к react-hook-form. Все примеры управляют value во внешнем состоянии.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

const selectOptions = [
  {
    id: 'draft',
    title: 'Черновик',
    description: 'Запись еще не опубликована',
  },
  {
    id: 'active',
    title: 'Активно',
    description: 'Запись доступна пользователям',
  },
  {
    id: 'archived',
    title: 'Архив',
    description: 'Запись скрыта из рабочих списков',
  },
];

const multiOptions = [
  { value: 'content', label: 'Контент' },
  { value: 'support', label: 'Поддержка' },
  { value: 'billing', label: 'Оплата' },
  { value: 'system', label: 'Системное', disabled: true },
];

export const TextAndSelect: Story = {
  name: 'Текст и выбор',
  render: () => {
    const [title, setTitle] = useState('Рабочий список');
    const [description, setDescription] = useState(
      'Описание отображается в карточке и таблице.',
    );
    const [status, setStatus] = useState<PcsSelectFieldChangeValue>('active');
    const [sections, setSections] = useState<string[] | undefined>([
      'content',
      'support',
    ]);

    return (
      <div style={{ display: 'grid', width: 460, gap: 20 }}>
        <PcsTextField label="Название" value={title} onChange={setTitle} />
        <PcsTextField
          errorText="Поле обязательно для публикации"
          label="Поле с ошибкой"
          value=""
          onChange={() => undefined}
        />
        <PcsTextAreaField
          label="Описание"
          rows={4}
          value={description}
          onChange={setDescription}
        />
        <PcsSelectField
          label="Статус"
          options={selectOptions}
          value={status}
          onChange={setStatus}
        />
        <PcsSelectMultipleField
          options={multiOptions}
          placeholder="Выберите разделы"
          value={sections}
          onChange={setSections}
        />
      </div>
    );
  },
};

export const DateAndRange: Story = {
  name: 'Даты и диапазоны',
  render: () => {
    const [date, setDate] = useState(dayjs());
    const [dateRange, setDateRange] = useState<PcsDateRangeValue | undefined>([
      dayjs().subtract(7, 'day'),
      dayjs(),
    ]);
    const [numberRange, setNumberRange] = useState<PcsNumberRangeValue>([
      '10',
      '250',
    ]);

    return (
      <div style={{ display: 'grid', width: 460, gap: 20 }}>
        <PcsDateField value={date} onChange={setDate} />
        <PcsDateRangeField value={dateRange} onChange={setDateRange} />
        <PcsNumberRangeField value={numberRange} onChange={setNumberRange} />
      </div>
    );
  },
};

export const Tags: Story = {
  name: 'Тэги',
  render: () => {
    const [selected, setSelected] = useState(['important', 'marketing']);

    return (
      <div style={{ width: 520 }}>
        <PcsTagInput
          appended
          list={{
            important: '#important',
            marketing: '#marketing',
            finance: '#finance',
            legal: '#legal',
            internal: '#internal',
          }}
          limit={5}
          placeholder="Введите тэг"
          selected={selected}
          onChange={setSelected}
        />
      </div>
    );
  },
};
