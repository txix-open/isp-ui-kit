import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button, Form, Input, InputNumber, Segmented } from 'antd';
import { useForm } from 'react-hook-form';
import {
  FormInput,
  FormInputNumber,
  FormInputPassword,
  FormTextArea,
  FormSecretTextArea,
} from '../../FormComponents';

const empty = {
  name: '',
  attempts: null as number | null,
  password: '',
  description: '',
  secret: '',
};
const filled = {
  name: 'Сервис обработки сообщений',
  attempts: 3,
  password: 'demo-password',
  description:
    'Проверка входящих сообщений и передача результата обработки во внешние системы.',
  secret: 'demo-token\nsecond-line',
};

function BaseFieldsExample() {
  const [mode, setMode] = useState('empty');
  const [submitted, setSubmitted] = useState(false);
  const { control, handleSubmit, reset } = useForm({ defaultValues: empty });
  const disabled = mode === 'disabled';
  const readOnly = mode === 'readonly';
  const fieldProps = { control, disabled, readOnly };
  return (
    <div style={{ maxWidth: 900 }}>
      <Segmented
        style={{ marginBottom: 20, maxWidth: '100%' }}
        options={[
          { label: 'Пустые', value: 'empty' },
          { label: 'Заполнены', value: 'filled' },
          { label: 'Disabled', value: 'disabled' },
          { label: 'ReadOnly', value: 'readonly' },
        ]}
        value={mode}
        onChange={(value) => {
          setMode(value);
          reset(value === 'empty' ? empty : filled);
          setSubmitted(false);
        }}
      />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: 32,
        }}
      >
        <form
          onSubmit={handleSubmit(
            () => setSubmitted(true),
            () => setSubmitted(false),
          )}
        >
          <h3 style={{ marginTop: 0 }}>Поля UI-кита</h3>
          <FormInput
            {...fieldProps}
            name="name"
            label="Название"
            placeholder="Введите название"
            rules={{ required: { value: true, message: 'Введите название.' } }}
            formItemProps={{ extra: 'Название будет видно в списке модулей.' }}
          />
          <FormInputNumber
            {...fieldProps}
            name="attempts"
            label="Число попыток"
            min={1}
            max={10}
            rules={{
              required: { value: true, message: 'Укажите число попыток.' },
              min: { value: 1, message: 'Минимум одна попытка.' },
            }}
          />
          <FormInputPassword
            {...fieldProps}
            name="password"
            label="Пароль"
            placeholder="Введите пароль"
            rules={{ required: { value: true, message: 'Введите пароль.' } }}
          />
          <FormTextArea
            {...fieldProps}
            name="description"
            label="Описание"
            rows={3}
            formItemProps={{ extra: 'Необязательное поле.' }}
          />
          <FormSecretTextArea
            {...fieldProps}
            name="secret"
            label="Секретное значение"
            rows={3}
            formItemProps={{
              extra: 'Демонстрационные данные. Кнопка переключает видимость.',
            }}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <Button
              type="primary"
              htmlType="submit"
              disabled={disabled || readOnly}
            >
              Проверить форму
            </Button>
            <Button
              onClick={() => {
                reset(empty);
                setMode('empty');
                setSubmitted(false);
              }}
            >
              Сбросить
            </Button>
          </div>
          {submitted && <p role="status">Форма прошла проверку.</p>}
        </form>
        <div>
          <h3 style={{ marginTop: 0 }}>Обычные Ant Design</h3>
          <p style={{ marginTop: 0, color: 'var(--ant-color-text-secondary)' }}>
            Тот же ConfigProvider. Размеры, радиусы, цвета и фокус сохраняют
            базовый вид.
          </p>
          <Form.Item
            labelCol={{ span: 24 }}
            label="Название"
            required
            extra="Название будет видно в списке модулей."
          >
            <Input
              placeholder="Введите название"
              disabled={disabled}
              readOnly={readOnly}
            />
          </Form.Item>
          <Form.Item labelCol={{ span: 24 }} label="Число попыток" required>
            <InputNumber
              min={1}
              max={10}
              disabled={disabled}
              readOnly={readOnly}
            />
          </Form.Item>
          <Form.Item labelCol={{ span: 24 }} label="Пароль" required>
            <Input.Password
              placeholder="Введите пароль"
              disabled={disabled}
              readOnly={readOnly}
            />
          </Form.Item>
          <Form.Item
            labelCol={{ span: 24 }}
            label="Описание"
            extra="Необязательное поле."
          >
            <Input.TextArea rows={3} disabled={disabled} readOnly={readOnly} />
          </Form.Item>
        </div>
      </div>
    </div>
  );
}

const meta = {
  title: 'Редизайн/Базовые поля',
  component: BaseFieldsExample,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Обёртки React Hook Form сохраняют базовый вид Ant Design, чтобы сочетаться с обычными полями на странице. Улучшены подписи, обязательность и доступность ошибок. Слева рабочая форма с валидацией и сбросом; справа независимые Ant Design-поля для сравнения оформления. Тему и ширину меняйте в панели Storybook. Пароли и секреты в результате отправки не отображаются.',
      },
    },
  },
} satisfies Meta<typeof BaseFieldsExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Comparison: Story = { name: 'Форма и базовые Ant Design' };
