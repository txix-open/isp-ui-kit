import type { Meta, StoryObj } from '@storybook/react';

import MyButton from '../MyButton/MyButton';

const meta: Meta<typeof MyButton> = {
  component: MyButton,
};

export default meta;

type Story = StoryObj<typeof MyButton>;

export const RedBtn: Story = {
  args: {
    color: 'red',
    children: 'Какой то текст',
  },
};

export const OrangeBtn: Story = {
  args: {
    color: 'orange',
    children: 'Какой то текст',
  },
};

export const BigBtn: Story = {
  args: {
    color: 'orange',
    big: true,
    children: 'Какой то текст',
  },
};
