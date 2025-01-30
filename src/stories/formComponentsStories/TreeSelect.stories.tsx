import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { FormTreeSelect } from '../../FormComponents';

const meta: Meta<typeof FormTreeSelect> = {
  component: FormTreeSelect,
  title: 'FormComponents/FormTreeSelect',
  args: {
    label: 'Название TreeSelect',
    name: 'TreeSelect',
    treeData: [
      {
        value: 'name',
        title: 'name',
        selectable: false,
        children: [
          {
            value: 'name1.1',
            title: 'name1.1',
            selectable: false,
            children: [],
          },
        ],
      },
      { value: 'name2', title: 'name2', selectable: false, children: [] },
    ],
    rules: { required: { value: true, message: 'Поле не может быть пустым' } },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Компонент TreeSelect, который поддерживает react-hook-form',
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
      description: 'Подпись к TreeSelect',
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

type Story = StoryObj<typeof FormTreeSelect>;
const onSubmit = (data: unknown) => console.log(data);

export const TreeSelect: Story = {
  render: (args) => {
    const methods = useForm();
    const { control, handleSubmit } = methods;
    args.control = control;
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormTreeSelect {...args} />
      </form>
    );
  },
};
export const Validation: Story = {
  render: (args) => {
    const methods = useForm();
    const { control, handleSubmit } = methods;
    args.control = control;
    control.setError('TreeSelect', {
      type: 'required',
      message: args.rules!.required!.message,
    });
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormTreeSelect {...args} />
      </form>
    );
  },
};
