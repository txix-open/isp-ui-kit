import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyData } from '../../../Layout';
import ThreeColumnsFrame from './ThreeColumnsFrame';

const meta: Meta<typeof EmptyData> = {
  component: EmptyData,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThreeColumnsFrame>
        <Story />
      </ThreeColumnsFrame>
    ),
  ],
  title: 'Layout/ThreeColumns/EmptyData',
  parameters: {
    layout: 'fullscreen',
    componentSubtitle: 'Состояние рабочей области до выбора элемента.',
    docs: {
      description: {
        component:
          'Родитель показывает EmptyData, пока пользователь не выбрал элемент для просмотра. Данные в списке при этом могут быть. Компонент не отслеживает selectedId. В новом оформлении занимает высоту родителя; content полностью заменяет стандартную иконку и текст.',
      },
    },
  },
  argTypes: {
    appearance: {
      description:
        'Оформление: modern по умолчанию; classic для прежнего вида.',
      control: 'radio',
      options: ['modern', 'classic'],
    },
    content: {
      description: 'ReactNode вместо всей стандартной иконки и текста.',
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof EmptyData>;

export const Example: Story = {
  name: 'Стандартное состояние',
  parameters: {
    docs: {
      description: {
        story:
          'Приглашение выбрать элемент в соседнем списке. Тему и высоту области можно менять в панели Storybook.',
      },
    },
  },
};

export const CustomContent: Story = {
  name: 'С пользовательским содержимым',
  parameters: {
    docs: {
      description: {
        story:
          'Подсказка перед выбором проекта. content заменяет стандартное содержимое состояния целиком.',
      },
    },
  },
  args: {
    content: (
      <>
        <h2>Выберите проект</h2>
        <p>Выберите проект слева, чтобы увидеть его задачи.</p>
      </>
    ),
  },
};
