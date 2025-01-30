import type { Meta, StoryObj } from '@storybook/react';
import SearchInput from '../../SearchInput/SearchInput';

const meta: Meta<typeof SearchInput> = {
  title: 'Components/SearchInput',
  component: SearchInput,
  parameters: {
    layout: 'centered',
    category: 'inputs',
    componentSubtitle:
      'Компонент SearchInput, основан на базовом компоненте Input от Antd',
    docs: {
      description: {
        component: 'Подробнее можно ознакомиться на сайте Antd',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof SearchInput>;

export const Input: Story = {
  args: {},
};
