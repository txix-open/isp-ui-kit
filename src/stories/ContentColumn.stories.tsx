import type { Meta, StoryObj } from '@storybook/react';
import { ContentColumn } from '../Layout';

const meta: Meta<typeof ContentColumn> = {
  component: ContentColumn,
  title: 'Layout/ThreeColumns/ContentColumn',
  parameters: {
    layout: 'centered',
    componentSubtitle:
      'Компонент ContentColumn, служит оберткой контента для организации шаблона "Три колонки" ',
    docs: {
      description: {
        component:
          'Компонент правильно выставляет высоту и ширину, а также добавляет SimpleScrollbar',
      },
    },
  },
  argTypes: {
    children: {
      description: 'Любое компонент, который должен быть внутрь ContentColumn',
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof ContentColumn>;

export const Example: Story = {
  args: {
    children: (
      <>
        <span>Компонент span</span>
        <div>Компонент div</div>
      </>
    ),
  },
};
