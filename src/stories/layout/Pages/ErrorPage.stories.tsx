import type { Meta, StoryObj } from '@storybook/react';
import { ErrorPage } from '../../../Layout';
import { PageExample } from '../../shared/PageExample';

const meta = {
  component: ErrorPage,
  tags: ['autodocs'],
  title: 'Layout/Pages/ErrorPage',
  render: (args) => <PageExample kind="error" {...args} />,
  parameters: {
    layout: 'padded',
    componentSubtitle: 'Ошибка загрузки страницы и действия восстановления',
    docs: {
      description: {
        component:
          'Страница ошибки 500 с небольшим стандартным значком Ant Design, заголовком и понятным сообщением. children по-прежнему передаётся в Result.extra: кнопки и их обработчики задаёт приложение. Компонент не повторяет запрос и не выполняет переход автоматически. Для совместимости высота по умолчанию 100vh; под шапкой или в панели передайте style={{ height: "100%" }} при заданной высоте родителя. Тема наследуется от ConfigProvider. Кнопки примера моделируют восстановление и переход локально, без API-запросов.\n\n[Встраивание под шапку и изменения страниц](?path=/docs/layout-pages-обзор--docs).',
      },
    },
  },
  argTypes: {
    children: {
      control: false,
      description:
        'Содержимое Result.extra: действия приложения, пояснение или null.',
    },
    style: {
      description:
        'Стили внешней области; height: 100% для контейнера заданной высоты.',
    },
    className: { description: 'Дополнительный класс внешней области.' },
  },
} satisfies Meta<typeof ErrorPage>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Example: Story = { name: 'Восстановление и переход' };
export const WithoutActions: Story = {
  name: 'Без дополнительных действий',
  args: { children: null },
};
export const Narrow: Story = {
  name: 'Узкая область',
  render: (args) => <PageExample kind="error" {...args} narrow />,
};
export const Short: Story = {
  name: 'Низкая область и прокрутка',
  render: (args) => <PageExample kind="error" {...args} short />,
};
export const LongContent: Story = {
  name: 'Длинное пользовательское содержимое',
  args: {
    children: (
      <div>
        <p>
          Не удалось подключиться к сервису конфигурации. Проверьте доступность
          сервиса и повторите запрос после восстановления соединения.
        </p>
        <p>
          Идентификатор для обращения в поддержку:
          request-configuration-production-2026-10-09-000000000000000000000000042.
        </p>
      </div>
    ),
  },
};
