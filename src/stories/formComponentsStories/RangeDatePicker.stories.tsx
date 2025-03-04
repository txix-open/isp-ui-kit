import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { FormRangeDatePicker } from '../../FormComponents';

const meta: Meta<typeof FormRangeDatePicker> = {
  component: FormRangeDatePicker,
  title: 'FormComponents/FormRangeDatePicker',
  args: {
    label: 'Название FormRangeDatePicker',
    name: 'datePicker',
    rules: { required: { value: true, message: 'Поле не может быть пустым' } },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Компонент RangeDatePicker, который поддерживает react-hook-form',
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
      description: 'Подпись к RangeDatePicker',
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

type Story = StoryObj<typeof FormRangeDatePicker>;
const onSubmit = (data: unknown) => console.log(data);

export const DatePicker: Story = {
  render: (args) => {
    const methods = useForm();
    const { control, handleSubmit } = methods;
    args.control = control;
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormRangeDatePicker {...args} />
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
        <FormRangeDatePicker {...args} />
      </form>
    );
  },
};
