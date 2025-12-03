import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { FormArrayMap } from '../../FormComponents';

const meta: Meta<typeof FormArrayMap> = {
  component: FormArrayMap,
  title: 'FormComponents/FormArrayMap',
  args: {
    name: 'arrayField',
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Компонент FormArrayMap для отрисовки массива примитивов. Отдает строки',
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
      description: 'Подпись к Input',
    },
    controlClassName: {
      description: 'Имя класса для компонента формы',
    },
  },
};

export default meta;

type Story = StoryObj<typeof FormArrayMap>;
const onSubmit = (data: unknown) => console.log(data);

export const Example: Story = {
  render: (args) => {
    const methods = useForm();
    const { control, handleSubmit } = methods;
    args.control = control;
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormArrayMap {...args} />
      </form>
    );
  },
};
