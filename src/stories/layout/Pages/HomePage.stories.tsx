import type { Meta, StoryObj } from '@storybook/react';
import { HomePage } from '../../../Layout';

const meta: Meta<typeof HomePage> = {
  component: HomePage,
  tags: ['autodocs'],
  title: 'Layout/Pages/HomePage',
  args: {},
  parameters: {
    layout: 'centered',
    componentSubtitle: 'Приветственная страница',
  },
  argTypes: {
    children: {
      description:
        'Приветственный текст. Может быть быть любой ```ReactNode```',
    },
    backgroundImage: {
      control: 'text',
      description: '```url``` для передачи изображения в качестве заднего фона',
    },
  },
};

export default meta;

type Story = StoryObj<typeof HomePage>;

export const Example: Story = {
  name: 'Пример',
  args: {
    children: 'Добро пожаловать',
    backgroundImage: 'https://picsum.photos/200/300',
  },
};
