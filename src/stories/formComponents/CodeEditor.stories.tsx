import connectionGuide from '../../../docs/code-editor.md?raw';
import { configureStorybookMonacoWorkers } from '../../../.storybook/monacoWorkers';
import type { Meta, StoryObj } from '@storybook/react';
import { useCallback, useRef, useState } from 'react';
import { Button, Space } from 'antd';
import { useForm, type FieldValues } from 'react-hook-form';
import { FormCodeEditor } from '../../FormComponents';
import { useDesignPreview } from '../shared/DesignPreviewContext';

configureStorybookMonacoWorkers();

const meta: Meta<typeof FormCodeEditor> = {
  component: FormCodeEditor,
  title: 'FormComponents/FormCodeEditor',
  tags: ['autodocs'],
  args: {
    name: 'code',
    label: 'Конфигурация подключения',
    language: 'json',
    height: '320px',
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: connectionGuide,
      },
    },
  },
  argTypes: {
    control: { control: false },
    loadMonaco: { control: false },
    onMount: { control: false },
    onChange: { control: false },
  },
};
export default meta;
type Story = StoryObj<typeof FormCodeEditor>;
function ExampleEditor({
  args,
  failure = false,
  delay = 0,
  toggle = false,
}: {
  args: React.ComponentProps<typeof FormCodeEditor>;
  failure?: boolean;
  delay?: number;
  toggle?: boolean;
}) {
  const methods = useForm<FieldValues>({
    defaultValues: {
      code:
        args.language === 'javascript'
          ? 'const settings = { enabled: true };'
          : '{"enabled":true,"hosts":["https://api.example.test"]}',
    },
  });
  const [saved, setSaved] = useState<string>();
  const [visible, setVisible] = useState(true);
  const attempts = useRef(0);
  const { theme } = useDesignPreview();
  const source = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, delay));
    if (failure && attempts.current++ === 0)
      throw new Error('Storybook: first attempt fails');
    return import('monaco-editor');
  }, [delay, failure]);
  return (
    <form
      style={{ maxWidth: 900, minWidth: 0 }}
      onSubmit={methods.handleSubmit((values) => setSaved(values.code))}
    >
      <Space wrap style={{ marginBottom: 16 }}>
        <Button
          onClick={() =>
            methods.reset({ code: '{"environment":"production"}' })
          }
        >
          Загрузить другую запись
        </Button>
        <Button
          onClick={() =>
            methods.setError(
              'code',
              { type: 'server', message: 'Проверьте конфигурацию.' },
              { shouldFocus: true },
            )
          }
        >
          Показать ошибку
        </Button>
        {toggle && (
          <Button onClick={() => setVisible(!visible)}>
            {visible ? 'Скрыть' : 'Показать'} редактор
          </Button>
        )}
      </Space>
      {visible && (
        <FormCodeEditor
          {...args}
          control={methods.control}
          name="code"
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          loadMonaco={failure || delay ? source : args.loadMonaco}
        />
      )}
      <Button htmlType="submit" type="primary">
        Сохранить
      </Button>
      {saved !== undefined && (
        <pre role="status" style={{ whiteSpace: 'pre-wrap' }}>
          {saved}
        </pre>
      )}
    </form>
  );
}
export const Example: Story = {
  name: 'Загрузка, редактирование и сохранение',
  render: (args) => <ExampleEditor args={args} />,
};
export const Loading: Story = {
  name: 'Медленная загрузка',
  render: (args) => <ExampleEditor args={args} delay={2500} />,
};
export const Timeout: Story = {
  name: 'Истечение времени ожидания',
  args: { loadTimeoutMs: 100 },
  render: (args) => <ExampleEditor args={args} delay={2500} />,
  parameters: {
    docs: {
      description: {
        story:
          'Источник ждёт 2,5 секунды, предел ожидания — 100 мс. Поздний результат не заменяет ошибку. Увеличьте loadTimeoutMs до 3000 в Controls, чтобы редактор загрузился.',
      },
    },
  },
};
export const Retry: Story = {
  name: 'Ошибка и повторная попытка',
  render: (args) => <ExampleEditor args={args} failure />,
};
export const ReadOnly: Story = {
  name: 'Только чтение',
  args: { disable: true },
  render: Example.render,
};
export const Remount: Story = {
  name: 'Размонтирование во время загрузки',
  render: (args) => <ExampleEditor args={args} delay={2500} toggle />,
};
export const JavaScript: Story = {
  name: 'JavaScript и workers',
  args: { language: 'javascript' },
  render: Example.render,
};
