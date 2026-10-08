import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from 'antd';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  FormCheckbox,
  FormRadioGroup,
  FormSwitch,
  FormDatePicker,
  FormRangeDatePicker,
} from '../../FormComponents';

function ScheduleExample({
  forwardEvents = false,
  disabled = false,
  legacyDateCallbacks = false,
  saveDateFormat,
}: {
  forwardEvents?: boolean;
  disabled?: boolean;
  legacyDateCallbacks?: boolean;
  saveDateFormat?: string;
}) {
  const { control, watch, reset, handleSubmit } = useForm({
    defaultValues: {
      schedule: {
        accepted: false,
        enabled: false,
        mode: '',
        date: undefined as string | undefined,
        range: undefined as string[] | undefined,
      },
    },
  });
  const [submitted, setSubmitted] = useState(false);
  const [events, setEvents] = useState({
    checkbox: 0,
    radio: 0,
    switch: 0,
    date: 0,
    range: 0,
    blur: 0,
  });
  const bump = (key: keyof typeof events) =>
    setEvents((prev) => ({ ...prev, [key]: prev[key] + 1 }));
  const values = watch('schedule');
  const dateEvents =
    forwardEvents || legacyDateCallbacks
      ? { onChange: () => bump('date') }
      : {};
  const rangeEvents =
    forwardEvents || legacyDateCallbacks
      ? { onChange: () => bump('range') }
      : {};
  const props = { control, disabled, forwardEvents };
  return (
    <form
      style={{ maxWidth: 620 }}
      onSubmit={handleSubmit(
        () => setSubmitted(true),
        () => setSubmitted(false),
      )}
    >
      <p>
        Базовые Ant Design-компоненты с вложенными именами. Формат показа дат —
        DD.MM.YYYY, сохранение по умолчанию — строка с часовым поясом
        Europe/Moscow.
      </p>
      {legacyDateCallbacks && (
        <p>
          Прежний режим: пользовательский onChange дат заменяет внутреннее
          сохранение. Ввод не меняет значение формы, пока приложение не сохранит
          его самостоятельно.
        </p>
      )}
      <FormCheckbox
        {...props}
        name="schedule.accepted"
        id="schedule-accepted"
        label="Подтверждаю настройку автоматического запуска обработки сообщений"
        rules={{ required: { value: true, message: 'Подтвердите настройку.' } }}
        onChange={() => bump('checkbox')}
        onBlur={() => bump('blur')}
        formItemProps={{
          extra:
            'Обязательное подтверждение; подпись остаётся рядом с флажком.',
        }}
      />
      <FormSwitch
        {...props}
        name="schedule.enabled"
        id="schedule-enabled"
        label="Автоматический запуск"
        onChange={() => bump('switch')}
        onBlur={() => bump('blur')}
      />
      <FormRadioGroup
        {...props}
        name="schedule.mode"
        id="schedule-mode"
        label="Режим запуска"
        items={[
          { value: 'manual', label: 'Вручную' },
          { value: 'automatic', label: 'По расписанию' },
        ]}
        rules={{
          required: { value: true, message: 'Выберите режим запуска.' },
        }}
        onChange={() => bump('radio')}
        onBlur={() => bump('blur')}
      />
      <FormDatePicker
        {...props}
        name="schedule.date"
        id="schedule-date"
        label="Дата запуска"
        style={{ width: '100%' }}
        saveDateFormat={saveDateFormat}
        rules={{ required: { value: true, message: 'Укажите дату.' } }}
        {...dateEvents}
        onBlur={() => bump('blur')}
      />
      <FormRangeDatePicker
        {...props}
        name="schedule.range"
        id={{ start: 'schedule-start', end: 'schedule-end' }}
        label="Период действия"
        style={{ width: '100%' }}
        saveDateFormat={saveDateFormat}
        {...rangeEvents}
        onBlur={() => bump('blur')}
        formItemProps={{ extra: 'Можно выбрать период или очистить обе даты.' }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <Button htmlType="submit" type="primary" disabled={disabled}>
          Проверить расписание
        </Button>
        <Button
          onClick={() => {
            reset();
            setSubmitted(false);
            setEvents({
              checkbox: 0,
              radio: 0,
              switch: 0,
              date: 0,
              range: 0,
              blur: 0,
            });
          }}
        >
          Сбросить форму
        </Button>
      </div>
      <pre
        data-testid="schedule-summary"
        role="status"
        style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}
      >
        {JSON.stringify(
          {
            values: {
              ...values,
              date: values.date ?? null,
              range: values.range ?? null,
            },
            events,
            submitted,
          },
          null,
          2,
        )}
      </pre>
    </form>
  );
}
function RadioFocusExample() {
  const { control, handleSubmit } = useForm({ defaultValues: { mode: '' } });
  return (
    <form onSubmit={handleSubmit(() => {})}>
      <FormRadioGroup
        control={control}
        name="mode"
        id="radio-focus"
        label="Обязательный выбор"
        items={[
          { value: 'manual', label: 'Вручную' },
          { value: 'auto', label: 'Автоматически' },
        ]}
        rules={{ required: { value: true, message: 'Выберите вариант.' } }}
      />
      <Button htmlType="submit">Проверить выбор</Button>
    </form>
  );
}
const meta = {
  title: 'Редизайн/Переключатели и даты',
  component: ScheduleExample,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Внешний вид, boolean/строковые значения, локаль, форматы и часовой пояс сохранены. forwardEvents=false сохраняет прежние callbacks. Новые события включаются явно. Для дат с переданным onChange прежний режим заменяет внутреннее сохранение; forwardEvents=true объединяет сохранение и callback. id начала и конца диапазона сохраняются. Ошибки связаны с полями; RadioGroup получает доступное название и фокус первого варианта.',
      },
    },
  },
} satisfies Meta<typeof ScheduleExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Example: Story = { name: 'Настройка расписания' };
export const ForwardedEvents: Story = {
  name: 'Новые события включены',
  args: { forwardEvents: true },
};
export const LegacyDateCallbacks: Story = {
  name: 'Прежний onChange дат',
  args: { legacyDateCallbacks: true },
};
export const CustomDateFormat: Story = {
  name: 'Формат хранения приложения',
  args: { saveDateFormat: 'YYYY-MM-DD' },
};
export const Disabled: Story = {
  name: 'Недоступные поля',
  args: { disabled: true },
};
export const RadioErrorFocus: Story = {
  name: 'Фокус ошибки RadioGroup',
  render: () => <RadioFocusExample />,
};
