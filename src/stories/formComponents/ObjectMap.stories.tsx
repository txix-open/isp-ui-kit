import type { Meta, StoryObj } from '@storybook/react';
import { FormObjectMap } from '../../FormComponents';
import CollectionMapsExample from '../shared/CollectionMapsExample';
const meta: Meta<typeof FormObjectMap> = {
  component: FormObjectMap,
  title: 'FormComponents/FormObjectMap',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Редактор словаря: ключ, значение и удаление в одной строке. В узкой области ключ расположен над значением. Пустой ключ исключается из модели, значение может быть пустым; ключи и значения обрезаются на blur. Повторяющийся ключ сохраняет значение последней строки, как прежде. reset и setValue обновляют строки; черновые пустые строки остаются локальными до ввода.',
      },
    },
  },
  argTypes: {
    control: { control: false, description: 'Control из React Hook Form.' },
    name: { description: 'Путь до словаря, включая вложенные имена.' },
    disabled: { description: 'Блокирует оба поля, добавление и удаление.' },
  },
};
export default meta;
type Story = StoryObj<typeof FormObjectMap>;
export const Example: Story = {
  name: 'Редактирование и сохранение',
  render: () => <CollectionMapsExample kind="object" />,
};
export const Empty: Story = {
  name: 'Пустой словарь',
  render: () => <CollectionMapsExample kind="object" empty />,
};
export const Disabled: Story = {
  name: 'Недоступное редактирование',
  render: () => <CollectionMapsExample kind="object" disabled />,
};
export const ExternalUpdate: Story = {
  name: 'Загрузка, reset и setValue',
  render: Example.render,
  parameters: {
    docs: {
      description: {
        story:
          'Измените ключ и добавьте пустую строку, затем загрузите другую запись или очистите через setValue. Старые строки исчезают; новые значения не смешиваются с черновиком.',
      },
    },
  },
};
