import type { Meta, StoryObj } from '@storybook/react';
import FormInput from '../FormInput/FormInput';
import { useForm } from 'react-hook-form';
import FormCheckbox from '../FormCheckbox/FormCheckbox';

const meta: Meta<typeof FormInput> = {
  component: FormInput,
  title: 'Input',
  args: {
    label: 'Название Input',
    name: 'input',
    rules: { required: { value: true, message: 'Поле не может быть пустым' } },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Компонент Input, который поддерживает react-hook-form',
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
      description: 'Подпись к Input',
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

type Story = StoryObj<typeof FormInput>;
const onSubmit = (data: unknown) => console.log(data);

export const Input: Story = {
  render: (args) => {
    const methods = useForm();
    const { control, handleSubmit } = methods;
    args.control = control;
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput {...args} />
      </form>
    );
  },
};

export const Validation: Story = {
  render: (args) => {
    const methods = useForm();
    const { control, handleSubmit } = methods;
    args.control = control;
    control.setError('input', {
      type: 'required',
      message: args.rules!.required!.message,
    });
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput {...args} />
      </form>
    );
  },
};
