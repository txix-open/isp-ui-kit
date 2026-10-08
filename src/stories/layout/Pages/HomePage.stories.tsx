import type { Meta, StoryObj } from '@storybook/react';
import { HomePage } from '../../../Layout';
import { PageExample, pageBackground } from '../../shared/PageExample';

const meta = {
  component: HomePage,
  tags: ['autodocs'],
  title: 'Layout/Pages/HomePage',
  render: (args) => <PageExample kind="home" {...args} />,
  parameters: {
    layout: 'padded',
    componentSubtitle: 'Нейтральная главная страница с содержимым приложения',
    docs: {
      description: {
        component:
          'Центрирует children в выделенной области. Высота по умолчанию 100%: родитель должен задавать высоту. Содержимое прокручивается при нехватке места. Типографику заголовков и действия определяет приложение; размер текста больше не зависит от viewport. backgroundImage сохраняется, изображение располагается по центру и покрывает фон. style и className позволяют настроить внешнюю область. В примерах кнопки меняют локальное содержимое; router принадлежит приложению.\n\n[Встраивание под шапку и изменения страниц](?path=/docs/layout-pages-обзор--docs).',
      },
    },
  },
  argTypes: {
    children: {
      control: false,
      description:
        'Любой ReactNode: текст, карточка, форма или действия приложения.',
    },
    backgroundImage: {
      control: 'text',
      description:
        'URL фонового изображения. Без значения используется фон активной темы.',
    },
    style: {
      description:
        'Стили области; например height: 100% при заданной высоте родителя.',
    },
    className: {
      description: 'Дополнительный класс; home-page и kit-page сохраняются.',
    },
  },
} satisfies Meta<typeof HomePage>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Example: Story = { name: 'Главная и действия' };
export const BackgroundImage: Story = {
  name: 'Фоновое изображение',
  args: { backgroundImage: pageBackground },
};
export const TextOnly: Story = {
  name: 'Прежний текстовый children',
  args: { children: 'Добро пожаловать' },
};
export const Narrow: Story = {
  name: 'Узкая область',
  render: (args) => <PageExample {...args} kind="home" narrow />,
};
export const Short: Story = {
  name: 'Низкая область и прокрутка',
  render: (args) => <PageExample {...args} kind="home" short />,
};
