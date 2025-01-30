import type { Meta, StoryObj } from '@storybook/react';
import { ThreeColumn } from '../../../Layout';

const meta: Meta<typeof ThreeColumn> = {
  component: ThreeColumn,
  title: 'Layout/ThreeColumns/ThreeColumn',
  parameters: {
    layout: 'centered',
    componentSubtitle: 'Компонент ThreeColumn для отображения колонок',
    docs: {
      description: {
        component:
          'Служит оберткой для компонентов Column, СontentColumn для отображения их в качестве колонок и для расчета высоты и ширины',
      },
    },
  },
  argTypes: {
    children: {
      description: 'Любой компонент, который должен быть внутри ThreeColumn',
      control: false,
      table: {
        type: {
          summary: 'ReactNode',
        },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ThreeColumn>;

export const Example: Story = {
  render: () => {
    return (
      <ThreeColumn>
        <div
          style={{
            width: '30%',
            minWidth: '250px',
            border: '1px solid #d9d9d9',
            height: '300px',
          }}
        >
          Первая колонка
        </div>
        <div
          style={{
            width: '100%',
            border: '1px solid #d9d9d9',
            borderWidth: '1px 0',
          }}
        >
          Здесь вторая колонка, например, с контентом
        </div>
      </ThreeColumn>
    );
  },
};
