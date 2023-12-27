import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { FormRadioGroup } from '../FormComponents';

const meta: Meta<typeof FormRadioGroup> = {
  component: FormRadioGroup,
  title: 'FormComponents/FormRadioGroup',
  args: {
    label: 'Название RadioGroup',
    name: 'RadioGroup',
    rules: { required: { value: true, message: 'Поле не может быть пустым' } },
    items: [
      {
        value: '1',
        label: 'Первый элемент',
      },
      {
        value: '2',
        label: 'Второй элемент',
      },
      {
        value: '3',
        label: 'Третий элемент',
      },
    ],
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Компонент RadioGroup, который поддерживает react-hook-form',
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
      description: 'Подпись к RadioGroup',
    },
    rules: {
      description: 'Правила валидации поля',
    },
    controlClassName: {
      description: 'Имя класса для компонента формы',
    },
    items: {
      description:
        " Ожидает массив объектов { label: 'Заголовок', value: boolean }",
    },
    type: {
      description: 'Radio или Button',
    },
  },
};

export default meta;

type Story = StoryObj<typeof FormRadioGroup>;
const onSubmit = (data: unknown) => console.log(data);

export const RadioGroup: Story = {
  render: (args) => {
    const methods = useForm();
    const { control, handleSubmit } = methods;
    args.control = control;
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormRadioGroup {...args} />
      </form>
    );
  },
};
export const Validation: Story = {
  render: (args) => {
    const methods = useForm();
    const { control, handleSubmit } = methods;
    args.control = control;
    control.setError('RadioGroup', {
      type: 'required',
      message: args.rules!.required!.message,
    });
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormRadioGroup {...args} />
      </form>
    );
  },
};
