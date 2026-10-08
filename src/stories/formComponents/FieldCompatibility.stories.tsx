import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button, Segmented } from 'antd';
import { useForm } from 'react-hook-form';
import {
  FormInput,
  FormInputNumber,
  FormInputPassword,
  FormTextArea,
  FormSecretTextArea,
} from '../../FormComponents';

function CompatibilityForm({ enhanced }: { enhanced: boolean }) {
  const [changes, setChanges] = useState(0);
  const [blurs, setBlurs] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const { control, watch, handleSubmit } = useForm({
    defaultValues: {
      account: {
        name: '',
        attempts: null as number | null,
        password: '',
        description: '',
        secret: '',
      },
    },
  });
  const values = watch('account');
  const events = enhanced ? { forwardEvents: true } : {};
  const textOptions = enhanced
    ? { forwardEvents: true, trimOnBlur: false }
    : {};
  const callbacks = {
    onChange: () => setChanges((n) => n + 1),
    onBlur: () => setBlurs((n) => n + 1),
  };
  return (
    <form
      style={{ maxWidth: 520 }}
      onSubmit={handleSubmit(() => setSubmitted(true))}
    >
      <p>
        Введите демонстрационное значение с пробелами по краям и покиньте поле.
        В старом режиме обработчики приложения не вызываются; в новом — получают
        события после React Hook Form.
      </p>
      <FormInput
        control={control}
        name="account.name"
        id="compat-name"
        label="Длинная подпись: название учётной записи для подключения к внешней системе"
        {...textOptions}
        {...callbacks}
      />
      <FormInputNumber
        control={control}
        name="account.attempts"
        id="compat-number"
        label="Число попыток"
        {...events}
        {...callbacks}
      />
      <FormInputPassword
        control={control}
        name="account.password"
        id="compat-password"
        label="Пароль"
        {...textOptions}
        {...callbacks}
      />
      <FormTextArea
        control={control}
        name="account.description"
        id="compat-description"
        label="Описание"
        rows={2}
        {...textOptions}
        {...callbacks}
      />
      <FormSecretTextArea
        control={control}
        name="account.secret"
        id="compat-secret"
        label="Секретное значение"
        rows={2}
        {...textOptions}
        {...callbacks}
      />
      <Button htmlType="submit">Проверить значения</Button>
      <pre
        data-testid="compat-summary"
        role="status"
        style={{ whiteSpace: 'pre-wrap' }}
      >
        {JSON.stringify(
          {
            nameLength: values.name.length,
            number: values.attempts,
            passwordLength: values.password.length,
            descriptionLength: values.description.length,
            secretLength: values.secret.length,
            changes,
            blurs,
            submitted,
          },
          null,
          2,
        )}
      </pre>
    </form>
  );
}
function CompatibilityPreview() {
  const [mode, setMode] = useState('legacy');
  return (
    <div>
      <Segmented
        options={[
          { label: 'Прежние defaults', value: 'legacy' },
          { label: 'Новые опции', value: 'enhanced' },
        ]}
        value={mode}
        onChange={setMode}
      />
      <CompatibilityForm key={mode} enhanced={mode === 'enhanced'} />
    </div>
  );
}
function ErrorFocusPreview() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      settings: { attempts: null as number | null, secret: '' },
    },
  });
  return (
    <form style={{ maxWidth: 520 }} onSubmit={handleSubmit(() => {})}>
      <p>
        Отправка пустой формы переводит фокус в InputNumber. После его
        заполнения — в SecretTextArea.
      </p>
      <FormInputNumber
        control={control}
        name="settings.attempts"
        id="focus-number"
        label="Число попыток"
        rules={{ required: { value: true, message: 'Укажите число попыток.' } }}
      />
      <FormSecretTextArea
        control={control}
        name="settings.secret"
        id="focus-secret"
        label="Секретное значение"
        rules={{ required: { value: true, message: 'Введите значение.' } }}
      />
      <Button htmlType="submit">Проверить обязательные поля</Button>
    </form>
  );
}
const meta = {
  title: 'Редизайн/Совместимость полей',
  component: CompatibilityPreview,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Существующие вызовы не требуют новых параметров: trimOnBlur=true, forwardEvents=false. Новые опции включаются явно. Используются вложенные имена полей и тестовые данные; пароли и секреты не отображаются, только их длины. Пользовательские события передаются после обработчиков React Hook Form, без дополнительного onChange при обрезке на blur.',
      },
    },
  },
} satisfies Meta<typeof CompatibilityPreview>;
export default meta;
type Story = StoryObj<typeof meta>;
export const DefaultsAndOptions: Story = {
  name: 'Прежние defaults и новые опции',
};
export const ErrorFocus: Story = {
  name: 'Фокус на первой ошибке',
  render: () => <ErrorFocusPreview />,
};
