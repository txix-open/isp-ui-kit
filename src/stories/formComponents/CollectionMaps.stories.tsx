import type { Meta, StoryObj } from '@storybook/react';
import CollectionMapsExample from '../shared/CollectionMapsExample';
const meta: Meta<typeof CollectionMapsExample> = {
  component: CollectionMapsExample,
  title: 'Редизайн/Массивы и словари',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Совместная форма с вложенными именами и видимым результатом сохранения. Проверяйте черновые строки, добавление/удаление, trim на blur, загрузку другой записи и очистку через setValue. Панель Storybook переключает темы и ширину 360 px. Формат данных сохранён; PcsKit не затронут.',
      },
    },
  },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof CollectionMapsExample>;
export const Example: Story = { name: 'Массив и словарь в одной форме' };
export const Empty: Story = {
  name: 'Добавление в пустую форму',
  args: { empty: true },
};
export const Disabled: Story = {
  name: 'Недоступное редактирование',
  args: { disabled: true },
};
