import type { Meta, StoryObj } from '@storybook/react';
import { NotFoundPage } from '../../../Layout';
import { PageExample } from '../../shared/PageExample';

const meta = {
  component: NotFoundPage,
  tags: ['autodocs'],
  title: 'Layout/Pages/NotFoundPage',
  render: (args) => <PageExample kind="not-found" {...args} />,
  parameters: {
    layout: 'padded',
    componentSubtitle: 'Несуществующий маршрут и возвращение в приложение',
    docs: {
      description: {
        component:
          'Страница 404 с прежним сообщением «Такой страницы не существует» и пояснением. children остаётся областью пользовательских действий под сообщением; переход выполняет приложение. Центрирование работает внутри контейнера, без absolute-позиционирования. По умолчанию высота 100vh; для ограниченной области задайте style={{ height: "100%" }} и высоту родителя. При нехватке места появляется внутренняя прокрутка. Светлая и тёмная темы наследуются от ConfigProvider. Кнопка примера меняет локальное содержимое и позволяет вернуться к сценарию.\n\n[Встраивание под шапку и изменения страниц](?path=/docs/layout-pages-обзор--docs).',
      },
    },
  },
  argTypes: {
    children: {
      control: false,
      description:
        'Содержимое под сообщением: например кнопка перехода, ссылка или null.',
    },
    style: {
      description:
        'Стили внешней области; height: 100% для встраивания под шапку.',
    },
    className: { description: 'Дополнительный класс внешней области.' },
  },
} satisfies Meta<typeof NotFoundPage>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Example: Story = { name: 'Возвращение в приложение' };
export const WithoutActions: Story = {
  name: 'Без дополнительных действий',
  args: { children: null },
};
export const Narrow: Story = {
  name: 'Узкая область',
  render: (args) => <PageExample kind="not-found" {...args} narrow />,
};
export const Short: Story = {
  name: 'Низкая область и прокрутка',
  render: (args) => <PageExample kind="not-found" {...args} short />,
};
export const LongContent: Story = {
  name: 'Длинный адрес и пояснение',
  args: {
    children: (
      <p>
        Запрошенный адрес:
        /administration/configuration/external-connections/production/unknown-resource-with-a-very-long-identifier
      </p>
    ),
  },
};
