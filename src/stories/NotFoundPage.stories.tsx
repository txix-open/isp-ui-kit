import type { Meta, StoryObj } from '@storybook/react';
import { HomePage, NotFoundPage } from '../Layout';
import { Button } from 'antd';

const meta: Meta<typeof NotFoundPage> = {
  component: NotFoundPage,
  title: 'Layout/Pages/Not Found Page',
  args: {},
  parameters: {
    layout: 'centered',
    componentSubtitle: 'Приветственная страница',
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
