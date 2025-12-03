import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { FormSelect } from '../../FormComponents';

const meta: Meta<typeof FormSelect> = {
  component: FormSelect,
  tags: ['autodocs'],
  title: 'FormComponents/FormSelect',
  args: {
    label: 'Название Select',
    name: 'Select',
    rules: { required: { value: true, message: 'Поле не может быть пустым' } },
    options: [
      { value: 'id-1', label: 'name 1' },
      { value: 'id-2', label: 'name 2' },
    ],
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Компонент Select, который поддерживает react-hook-form',
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
      description: 'Подпись к Select',
    },
    rules: {
      description: 'Правила валидации поля',
    },
    controlClassName: {
      description: 'Имя класса для компонента формы',
    },
    options: {
      description: ' Ожидает массив объектов {value: "id", label: "Заголовок"}',
    },
  },
};

export default meta;

type Story = StoryObj<typeof FormSelect>;
const onSubmit = (data: unknown) => console.log(data);

export const Example: Story = {
  name: 'Пример',
  render: (args) => {
    const methods = useForm();
    const { control, handleSubmit } = methods;
    args.control = control;
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormSelect {...args} />
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
    control.setError('Select', {
      type: 'required',
      message: args.rules!.required!.message,
    });
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormSelect {...args} />
      </form>
    );
  },
};
