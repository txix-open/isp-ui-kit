import StoryForm from '../shared/StoryForm';
import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { FormRadioGroup } from '../../FormComponents';

const meta: Meta<typeof FormRadioGroup> = {
  component: FormRadioGroup,
  tags: ['autodocs'],
  title: 'FormComponents/FormRadioGroup',
  args: {
    label: 'Название RadioGroup',
    name: 'RadioGroup',
    rules: { required: { value: true, message: 'Поле не может быть пустым' } },
    items: [
      {
        value: '1',
        label: 'Первый элемент',
      },
      {
        value: '2',
        label: 'Второй элемент',
      },
      {
        value: '3',
        label: 'Третий элемент',
      },
    ],
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Radio.Group Ant Design с React Hook Form. Сохраняет radio/button и значения items.value. Группа получает доступное название, при ошибке фокусируется первый доступный вариант; forwardEvents включает события приложения.',
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
      description: 'Подпись к RadioGroup',
    },
    rules: {
      description:
        'Правила React Hook Form; required задаётся как { value: true, message: ... }.',
    },
    controlClassName: {
      description:
        'CSS-класс Form.Item; для самого контрола используйте className.',
    },
    items: {
      description:
        "Массив объектов { label: 'Заголовок', value: 'идентификатор' }; value сохраняется без преобразования в boolean.",
    },
    type: {
      description: 'Вид вариантов: radio (по умолчанию) или button.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof FormRadioGroup>;

export const Example: Story = {
  name: 'Пример',
  render: (args) => {
    const methods = useForm();
    const { control } = methods;
    return (
      <StoryForm methods={methods}>
        <FormRadioGroup {...args} control={control} />
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
        <FormRadioGroup {...args} control={control} />
      </StoryForm>
    );
  },
};

export const Disabled: Story = {
  name: 'Недоступен',
  args: { disabled: true },
  render: Example.render,
};

export const Buttons: Story = {
  args: { type: 'button' },
  render: Example.render,
};
