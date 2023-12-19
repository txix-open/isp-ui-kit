import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import FormInputPassword from '../FormInputPassword/FormInputPassword';

const meta: Meta<typeof FormInputPassword> = {
  component: FormInputPassword,
  title: 'InputPassword',
  args: {
    label: 'Название InputPassword',
    name: 'InputPassword',
    rules: { required: { value: true, message: 'Поле не может быть пустым' } },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Компонент InputNumber, который поддерживает react-hook-form',
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
      description: 'Подпись к InputNumber',
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

type Story = StoryObj<typeof FormInputPassword>;
const onSubmit = (data: unknown) => console.log(data);

export const InputPassword: Story = {
  render: (args) => {
    const methods = useForm();
    const { control, handleSubmit } = methods;
    args.control = control;
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInputPassword {...args} />
      </form>
    );
  },
};

export const Validation: Story = {
  render: (args) => {
    const methods = useForm();
    const { control, handleSubmit } = methods;
    args.control = control;
    control.setError('InputPassword', {
      type: 'required',
      message: args.rules!.required!.message,
    });
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInputPassword {...args} />
      </form>
    );
  },
};
