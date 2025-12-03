import type { Meta, StoryObj } from '@storybook/react';
import { ErrorPage } from '../../../Layout';
import { Button } from 'antd';

const meta: Meta<typeof ErrorPage> = {
  component: ErrorPage,
  tags: ['autodocs'],
  title: 'Layout/Pages/ErrorPage',
  args: {},
  parameters: {
    layout: 'centered',
    componentSubtitle: 'Приветственная страница',
  },
  argTypes: {
    children: {
      control: false,
      description:
        'Любое контент, который должен быть отображен под лого. ```ReactNode```',
    },
  },
};

export default meta;

type Story = StoryObj<typeof ErrorPage>;

export const Example: Story = {
  name: 'Пример',
  args: {
    children: <Button>На главную</Button>,
  },
};
