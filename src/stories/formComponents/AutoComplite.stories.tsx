import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { FormAutoComplete } from '../../FormComponents';

const meta: Meta<typeof FormAutoComplete> = {
  component: FormAutoComplete,
  tags: ['autodocs'],
  title: 'FormComponents/FormAutoComplete',
  args: {
    label: 'Название AutoComplete',
    name: 'AutoComplete',
    rules: { required: { value: true, message: 'Поле не может быть пустым' } },
    options: [{ value: 'http' }, { value: 'https' }],
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Компонент AutoComplete, который поддерживает react-hook-form',
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
      description: 'Подпись к AutoComplete',
    },
    rules: {
      description: 'Правила валидации',
    },
    controlClassName: {
      description: 'Имя класса для компонента формы',
    },
    options: {
      description:
        'Ожидает массив объектов { value: "значение" } для дефлотных параметров',
    },
  },
};

export default meta;

type Story = StoryObj<typeof FormAutoComplete>;

const onSubmit = (data: unknown) => console.log(data);

export const Example: Story = {
  name: 'Пример',
  render: (args) => {
    const methods = useForm();
    const { control, handleSubmit } = methods;
    args.control = control;
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormAutoComplete {...args} />
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

    control.setError('AutoComplete', {
      type: 'required',
      message: args.rules!.required!.message,
    });

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormAutoComplete {...args} />
      </form>
    );
  },
};
