import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { FormCodeEditor } from '../FormComponents';

const meta: Meta<typeof FormCodeEditor> = {
  component: FormCodeEditor,
  title: 'FormComponents/FormCodeEditor',
  args: {
    label: 'Название CodeEditor',
    name: 'CodeEditor',
    rules: { required: { value: true, message: 'Поле не может быть пустым' } },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Компонент CodeEditor, который поддерживает react-hook-form',
      },
    },
  },
  argTypes: {
    control: {
      control: true,
      description: 'параметр, получаемый из react-hook-form',
    },
    name: {
      description: 'Путь до поля в структуре',
    },
    label: {
      description: 'Подпись к CodeEditor',
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

type Story = StoryObj<typeof FormCodeEditor>;
const onSubmit = (data: unknown) => console.log(data);

export const CodeEditor: Story = {
  render: (args) => {
    const methods = useForm();
    const { control, handleSubmit } = methods;
    args.control = control;
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormCodeEditor {...args} />
      </form>
    );
  },
};
