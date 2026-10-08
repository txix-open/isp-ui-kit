import StoryForm from '../shared/StoryForm';
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
        component:
          'Select Ant Design с React Hook Form. Базовое оформление сохранено. Очистка одиночного значения передаёт null; пользовательский onChange работает как прежде. forwardEvents включает дополнительно onBlur.',
      },
    },
  },
  argTypes: {
    formItemProps: {
      control: false,
      description:
        'Свойства Ant Design Form.Item: подпись, help, extra и оформление. Ошибка формы имеет приоритет над help; required здесь не заменяет rules.',
    },
    forwardEvents: {
      description:
        'false по умолчанию; true дополнительно передаёт пользовательский onBlur. Пользовательский onChange вызывается в обоих режимах.',
    },
    control: {
      control: false,
      description:
        'Объект control из useForm(). Значение и ошибки управляются React Hook Form.',
    },
    name: {
      control: false,
      description:
        'Путь в данных формы, например service.name; вложенные имена поддерживаются.',
    },
    label: {
      description: 'Подпись к Select',
    },
    rules: {
      description:
        'Правила React Hook Form; required задаётся как { value: true, message: ... }.',
    },
    controlClassName: {
      description:
        'CSS-класс Form.Item; для самого контрола используйте className.',
    },
    options: {
      description: ' Ожидает массив объектов {value: "id", label: "Заголовок"}',
    },
  },
};

export default meta;

type Story = StoryObj<typeof FormSelect>;

export const Example: Story = {
  name: 'Пример',
  render: (args) => {
    const methods = useForm();
    const { control } = methods;
    return (
      <StoryForm methods={methods}>
        <FormSelect {...args} control={control} />
      </StoryForm>
    );
  },
};
export const Validation: Story = {
  name: 'Валидация',
  parameters: {
    docs: {
      description: {
        story:
          'При открытии ошибка установлена через setError для демонстрации состояния. Кнопка «Проверить и отправить» запускает реальные rules; сброс очищает форму.',
      },
    },
  },
  render: (args) => {
    const methods = useForm();
    const { control } = methods;
    return (
      /* Validation fixture is installed by StoryForm after mount. */
      <StoryForm methods={methods} errorField={args.name}>
        <FormSelect {...args} control={control} />
      </StoryForm>
    );
  },
};

export const Disabled: Story = {
  name: 'Недоступен',
  args: { disabled: true },
  render: Example.render,
};
export const EmptyOptions: Story = {
  name: 'Нет вариантов',
  args: { options: [] },
  render: Example.render,
};

export const Multiple: Story = {
  name: 'Несколько значений',
  args: { mode: 'multiple', allowClear: true, style: { width: '100%' } },
  render: Example.render,
};
