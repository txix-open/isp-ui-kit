import type { Meta, StoryObj } from '@storybook/react-vite';
import { NoData, EmptyData } from '../../../Layout';
import ThreeColumnsFrame from './ThreeColumnsFrame';

function StatesPreview() {
  return (
    <ThreeColumnsFrame>
      <NoData />
      <EmptyData />
    </ThreeColumnsFrame>
  );
}

const meta = {
  title: 'Layout/ThreeColumns/Состояния',
  component: StatesPreview,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Два разных состояния зависимой рабочей области: отсутствие данных и ожидание выбора. Решение о показе принимает родитель.',
      },
    },
  },
} satisfies Meta<typeof StatesPreview>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Comparison: Story = {
  name: 'Нет данных и нет выбора',
  parameters: {
    docs: {
      description: {
        story:
          'Слева NoData: отображать нечего. Справа EmptyData: сначала нужно выбрать элемент. Обе области занимают высоту общего контейнера; тему и высоту меняйте в панели Storybook.',
      },
    },
  },
};
