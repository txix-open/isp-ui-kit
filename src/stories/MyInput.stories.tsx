import type { Meta, StoryObj } from '@storybook/react';

import MyInput from '../MyInput/MyInput';

const meta: Meta<typeof MyInput> = {
  component: MyInput,
};

export default meta;

type Story = StoryObj<typeof MyInput>;

export const SmallInput: Story = {
  args: {
    big: false,
    placeholder: 'TEXT',
    label: 'label',
  },
};

export const BigInput: Story = {
  args: {
    big: true,
    placeholder: 'TEXT',
    label: 'label',
  },
};
