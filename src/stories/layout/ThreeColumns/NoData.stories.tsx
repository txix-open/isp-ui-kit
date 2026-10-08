import type { Meta, StoryObj } from '@storybook/react-vite';
import { NoData } from '../../../Layout';
import ThreeColumnsFrame from './ThreeColumnsFrame';

const meta: Meta<typeof NoData> = {
  component: NoData,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThreeColumnsFrame>
        <Story />
      </ThreeColumnsFrame>
    ),
  ],
  title: 'Layout/ThreeColumns/NoData',
  parameters: {
    layout: 'fullscreen',
    componentSubtitle: 'Состояние рабочей области, в которой нет данных.',
    docs: {
      description: {
        component:
          'Родитель показывает NoData, когда данных нет. Компонент не проверяет список и не управляет загрузкой. В новом оформлении занимает высоту родителя; content полностью заменяет стандартную иконку и текст.',
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

type Story = StoryObj<typeof NoData>;

export const Example: Story = {
  name: 'Стандартное состояние',
  parameters: {
    docs: {
      description: {
        story:
          'Сообщение об отсутствии данных. Тему и высоту области можно менять в панели Storybook.',
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
          'Собственный текст для проекта без задач. content заменяет стандартное содержимое состояния целиком.',
      },
    },
  },
  args: {
    content: (
      <>
        <h2>Список пока пуст</h2>
        <p>В этом проекте пока нет задач.</p>
      </>
    ),
  },
};
