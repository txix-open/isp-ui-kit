import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { FormSecretTextArea } from '../../FormComponents';

const meta: Meta<typeof FormSecretTextArea> = {
  component: FormSecretTextArea,
  title: 'FormComponents/FormSecretTextArea',
  args: {
    label: 'Название SecretTextArea',
    name: 'TextArea',
    rules: { required: { value: true, message: 'Поле не может быть пустым' } },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Компонент SecretTextArea, который поддерживает react-hook-form',
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
      description: 'Подпись к TextArea',
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

type Story = StoryObj<typeof FormSecretTextArea>;
const onSubmit = (data: unknown) => console.log(data);

export const TextArea: Story = {
  render: (args) => {
    const methods = useForm();
    const { control, handleSubmit } = methods;
    args.control = control;
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormSecretTextArea {...args} />
      </form>
    );
  },
};
export const Validation: Story = {
  render: (args) => {
    const methods = useForm();
    const { control, handleSubmit } = methods;
    args.control = control;
    control.setError('SecretTextArea', {
      type: 'required',
      message: args.rules!.required!.message,
    });
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormSecretTextArea {...args} />
      </form>
    );
  },
};
