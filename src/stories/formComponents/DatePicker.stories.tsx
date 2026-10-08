import StoryForm from '../shared/StoryForm';
import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { FormDatePicker } from '../../FormComponents';

const meta: Meta<typeof FormDatePicker> = {
  component: FormDatePicker,
  tags: ['autodocs'],
  title: 'FormComponents/FormDatePicker',
  args: {
    label: 'Название DatePicker',
    name: 'datePicker',
    rules: { required: { value: true, message: 'Поле не может быть пустым' } },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Дата с React Hook Form. Показ DD.MM.YYYY, хранение YYYY-MM-DDTHH:mm:ssZ в Europe/Moscow сохранены. Очистка даёт undefined. Переданный onChange по умолчанию заменяет сохранение; forwardEvents объединяет их.',
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
        'false по умолчанию: переданный onChange заменяет внутреннее сохранение даты. true сначала сохраняет значение в форму, затем вызывает onChange; также передаёт onBlur.',
    },
    format: { description: 'Формат отображения; по умолчанию DD.MM.YYYY.' },
    saveDateFormat: {
      description:
        'Формат строки в данных формы; по умолчанию YYYY-MM-DDTHH:mm:ssZ. Часовой пояс Europe/Moscow.',
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
      description: 'Подпись к DatePicker',
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

type Story = StoryObj<typeof FormDatePicker>;

export const Example: Story = {
  name: 'Пример',
  render: (args) => {
    const methods = useForm();
    const { control } = methods;
    return (
      <StoryForm methods={methods}>
        <FormDatePicker {...args} control={control} />
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
        <FormDatePicker {...args} control={control} />
      </StoryForm>
    );
  },
};

export const Disabled: Story = {
  name: 'Недоступен',
  args: { disabled: true },
  render: Example.render,
};

export const CustomFormat: Story = {
  args: {
    format: 'DD.MM.YYYY HH:mm',
    saveDateFormat: 'YYYY-MM-DD HH:mm',
    showTime: true,
  },
  render: Example.render,
};
