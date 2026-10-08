import StoryForm from '../shared/StoryForm';
import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { FormSecretTextArea } from '../../FormComponents';

const meta: Meta<typeof FormSecretTextArea> = {
  component: FormSecretTextArea,
  tags: ['autodocs'],
  title: 'FormComponents/FormSecretTextArea',
  args: {
    label: 'Секретное значение',
    name: 'TextArea',
    rules: { required: { value: true, message: 'Поле не может быть пустым' } },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Многострочное поле с маскированием и React Hook Form. Базовое оформление Ant Design сохранено. Кнопка видимости имеет доступное название и не перекрывает текст; при disabled недоступна. Маскирование скрывает текст визуально и не изменяет значение.',
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
      description: 'Подпись к TextArea',
    },
    rules: {
      description:
        'Правила React Hook Form; required задаётся как { value: true, message: ... }.',
    },
    controlClassName: {
      description:
        'CSS-класс Form.Item; для самого контрола используйте className.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof FormSecretTextArea>;

export const Example: Story = {
  name: 'Пример',
  render: (args) => {
    const methods = useForm();
    const { control } = methods;
    return (
      <StoryForm methods={methods}>
        <FormSecretTextArea {...args} control={control} />
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
        <FormSecretTextArea {...args} control={control} />
      </StoryForm>
    );
  },
};
