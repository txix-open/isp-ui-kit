import type { Meta, StoryObj } from '@storybook/react';
import { HomePage, NotFoundPage } from '../../../Layout';
import { Button } from 'antd';

const meta: Meta<typeof NotFoundPage> = {
  component: NotFoundPage,
  title: 'Layout/Pages/NotFoundPage',
  args: {},
  parameters: {
    layout: 'centered',
    componentSubtitle: 'Компонент для отображения страницы "Страница не найдена". Применяется для обработки запросов к несуществующим маршрутам.',
  },
  argTypes: {
    children: {
      description:
        'Любое контент, который должен быть отображен под текстом ошибки ```ReactNode```',
    },
  },
};

export default meta;

type Story = StoryObj<typeof HomePage>;

export const Example: Story = {
  args: {
    children: <Button>Домой</Button>,
  },
};
