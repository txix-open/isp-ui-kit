import type { Meta, StoryObj } from '@storybook/react';
import { NoData } from '../../../Layout';

const meta: Meta<typeof NoData> = {
  component: NoData,
  tags: ['autodocs'],
  title: 'Layout/ThreeColumns/NoData',
  parameters: {
    layout: 'centered',
    componentSubtitle:
      'Вспомогательный компонент для Column, для отображения надписи "Нет данных"',
    docs: {
      description: {
        component:
          'Может использоваться для отрисовки соответствующего сообщения',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof NoData>;

export const Example: Story = {};
