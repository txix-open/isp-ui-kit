import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { FormInputNumber } from '../../FormComponents';

const meta: Meta<typeof FormInputNumber> = {
  component: FormInputNumber,
  tags: ['autodocs'],
  title: 'FormComponents/FormInputNumber',
  args: {
    label: 'Название InputNumber',
    name: 'InputNumber',
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

type Story = StoryObj<typeof FormInputNumber>;
const onSubmit = (data: unknown) => console.log(data);

export const Example: Story = {
  name: 'Пример',
  render: (args) => {
    const methods = useForm();
    const { control, handleSubmit } = methods;
    args.control = control;
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInputNumber {...args} />
      </form>
    );
  },
};

export const Validation: Story = {
  name: 'Валидация',
  render: (args) => {
    const methods = useForm();
    const { control, handleSubmit } = methods;
    args.control = control;
    control.setError('InputNumber', {
      type: 'required',
      message: args.rules!.required!.message,
    });
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInputNumber {...args} />
      </form>
    );
  },
};
