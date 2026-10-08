import StoryForm from '../shared/StoryForm';
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
          'AutoComplete Ant Design с React Hook Form. Ввод и выбор подсказки обновляют форму; встроенная фильтрация по value и обрезка пробелов на blur сохранены. forwardEvents включает пользовательские события; trimOnBlur=false сохраняет ввод дословно.',
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
        'false по умолчанию сохраняет прежние callbacks. true вызывает пользовательские onChange/onBlur после обработчиков формы.',
    },
    trimOnBlur: {
      description:
        'true по умолчанию обрезает крайние пробелы на blur; false сохраняет ввод дословно.',
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
      description: 'Подпись к AutoComplete',
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
      description:
        'Подсказки { value: "значение", label?: "Подпись" }. По умолчанию фильтруются по value; свободный ввод разрешён.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof FormAutoComplete>;

export const Example: Story = {
  name: 'Пример',
  render: (args) => {
    const methods = useForm();
    const { control } = methods;
    return (
      <StoryForm methods={methods}>
        <FormAutoComplete {...args} control={control} />
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
        <FormAutoComplete {...args} control={control} />
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
