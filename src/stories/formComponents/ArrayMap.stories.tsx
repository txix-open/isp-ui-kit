import type { Meta, StoryObj } from '@storybook/react';
import { FormArrayMap } from '../../FormComponents';
import CollectionMapsExample from '../shared/CollectionMapsExample';
const meta: Meta<typeof FormArrayMap> = {
  component: FormArrayMap,
  title: 'FormComponents/FormArrayMap',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Редактор массива строк с добавлением и удалением. Загруженные числа сохраняют исходный тип до первого редактирования. Ввод сохраняет строки, пустые строки исключаются при редактировании, пробелы обрезаются на blur — прежние преобразования сохранены. reset и setValue обновляют отображение; добавленная пустая строка остаётся черновиком до ввода. rules не включаются автоматически: ошибки можно передать через setError или formItemProps.',
      },
    },
  },
  argTypes: {
    control: { control: false, description: 'Control из React Hook Form.' },
    name: { description: 'Путь поля; вложенные имена поддерживаются.' },
    label: {
      description:
        'Подпись строки с номером. formItemProps.label имеет приоритет.',
    },
    formItemProps: {
      description:
        'Стандартные свойства Ant Design Form.Item для каждой строки.',
    },
    disabled: {
      description:
        'Новое необязательное свойство: блокирует ввод, добавление и удаление; по умолчанию false.',
    },
  },
};
export default meta;
type Story = StoryObj<typeof FormArrayMap>;
export const Example: Story = {
  name: 'Редактирование и сохранение',
  render: () => <CollectionMapsExample kind="array" />,
};
export const Empty: Story = {
  name: 'Пустой массив',
  render: () => <CollectionMapsExample kind="array" empty />,
};
export const Disabled: Story = {
  name: 'Недоступное редактирование',
  render: () => <CollectionMapsExample kind="array" disabled />,
};
export const NumericValues: Story = {
  name: 'Совместимость числовых значений',
  render: () => <CollectionMapsExample kind="array" numeric />,
  parameters: {
    docs: {
      description: {
        story:
          'Загруженные числа показаны как строки, но исходная модель остаётся числовой до редактирования. После редактирования массив передаёт строки, как в прежней реализации.',
      },
    },
  },
};
export const ExternalUpdate: Story = {
  name: 'Загрузка, reset и setValue',
  render: Example.render,
  parameters: {
    docs: {
      description: {
        story:
          'Измените адрес, добавьте пустую строку, затем загрузите другую запись. Строки должны полностью соответствовать новым данным. Сброс восстанавливает последний reset, очистка через setValue удаляет все строки.',
      },
    },
  },
};
