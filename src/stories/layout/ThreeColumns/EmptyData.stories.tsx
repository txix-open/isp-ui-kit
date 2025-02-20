import type { Meta, StoryObj } from '@storybook/react';
import { EmptyData } from '../../../Layout';

const meta: Meta<typeof EmptyData> = {
  component: EmptyData,
  title: 'Layout/ThreeColumns/EmptyData',
  parameters: {
    layout: 'centered',
    componentSubtitle:
      'Вспомогательный компонент для Column для отображения надписи "Выберите Элемент", если элемент из списка еще не выбран',
    docs: {
      description: {
        component:
          'Может использоваться для отрисовки соответствующего сообщения',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof EmptyData>;

export const Example: Story = {};
