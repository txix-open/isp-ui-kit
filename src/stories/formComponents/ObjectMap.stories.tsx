import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { FormObjectMap } from '../../FormComponents';

const meta: Meta<typeof FormObjectMap> = {
  component: FormObjectMap,
  tags: ['autodocs'],
  title: 'FormComponents/FormObjectMap',
  args: {
    name: 'objectField',
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Компонент FormObjectMap для отрисовки объектов',
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
  },
};

export default meta;

type Story = StoryObj<typeof FormObjectMap>;
const onSubmit = (data: unknown) => console.log(data);

export const Example: Story = {
  name: 'Пример',
  render: (args) => {
    const methods = useForm();
    const { control, handleSubmit } = methods;
    args.control = control;
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormObjectMap {...args} />
      </form>
    );
  },
};
