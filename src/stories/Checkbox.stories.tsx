import type { Meta, StoryObj } from '@storybook/react';

import FormCheckbox from '../FormCheckbox/FormCheckbox';
import { useForm } from 'react-hook-form';

const meta: Meta<typeof FormCheckbox> = {
  component: FormCheckbox,
  title: 'Checkbox',
  args: {
    label: 'Название checkbox',
    name: 'checkbox',
    rules: { required: { value: true, message: 'Поле не может быть пустым' } },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Компонент Checkbox, который поддерживает react-hook-form',
      },
    },
  },
  argTypes: {
    control: {
      control: false,
      description: 'параметр, получаемый из react-hook-form',
    },
    name: {
      control: false,
      description: 'Путь до поля в структуре',
    },
    label: {
      description: 'Подпись к checkbox',
    },
    rules: {
      description: 'Правила валидации поля',
    },
    controlClassName: {
      description: 'Имя класса для компонента формы',
    },
  },
};

export default meta;

type Story = StoryObj<typeof FormCheckbox>;
const onSubmit = (data: unknown) => console.log(data);

export const Checkbox: Story = {
  render: (args) => {
    const methods = useForm();
    const { control, handleSubmit } = methods;
    args.control = control;
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormCheckbox {...args} />
      </form>
    );
  },
};
export const Validation: Story = {
  render: (args) => {
    const methods = useForm();
    const { control, handleSubmit } = methods;
    args.control = control;
    control.setError('checkbox', {
      type: 'required',
      message: args.rules!.required!.message,
    });
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormCheckbox {...args} />
      </form>
    );
  },
};
