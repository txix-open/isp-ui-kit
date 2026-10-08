import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { LayoutSider } from '../../Layout';
import type { LayoutSiderPropsType } from '../../Layout/LayoutSider/layout-sider';
import {
  NavigationExample,
  navigationConfig,
} from '../shared/NavigationExample';

const meta = {
  component: LayoutSider,
  title: 'Layout/LayoutSider',
  tags: ['autodocs'],
  render: (args) => <NavigationExample {...args} />,
  parameters: {
    layout: 'padded',
    componentSubtitle: 'Боковая панель с независимой прокруткой',
    docs: {
      description: {
        component:
          'Обёртка над Ant Design Layout.Sider. Ширина по умолчанию — 250 px, тема light, сворачивание включено. Поддерживаются стандартные props Sider: controlled/uncontrolled collapse, breakpoint, collapsedWidth, trigger и style.\n\nДля совместимости сохранена высота calc(100vh - 45px). Внутри ограниченного контейнера задайте style={{ height: "100%" }} при определённой высоте родителя. Содержимое прокручивается отдельно, кнопка сворачивания остаётся внизу самой панели. Собственный trigger и trigger={null} сохраняют приоритет.\n\nТему LayoutMenu задавайте явно вместе с темой Sider. Панель не меняет маршруты и не добавляет собственное содержимое.\n\nПримеры key, route, вложенных URL и подключения router: [LayoutMenu — маршруты и ключи](?path=/docs/layout-layoutmenu--docs).',
      },
    },
  },
  argTypes: {
    collapsed: {
      description: 'Контролируемое состояние; обновляйте его в onCollapse.',
    },
    defaultCollapsed: {
      description: 'Начальное состояние для неконтролируемой панели.',
    },
    onCollapse: {
      description: 'Стандартный callback Ant Design (collapsed, type).',
    },
    width: { description: 'Развёрнутая ширина; по умолчанию 250 px.' },
    collapsedWidth: {
      description:
        'Свёрнутая ширина; по умолчанию Ant Design 80 px. 0 включает выносную кнопку.',
    },
    children: {
      description: 'Содержимое панели, например LayoutMenu.',
      control: false,
    },
    trigger: {
      description: 'Собственный элемент сворачивания; null убирает кнопку.',
      control: false,
    },
    theme: {
      description:
        'Тема панели; в примерах без значения следует за переключателем Storybook.',
      control: 'radio',
      options: ['light', 'dark'],
    },
  },
} satisfies Meta<typeof LayoutSider>;
export default meta;
type Story = StoryObj<typeof meta>;
function ControlledExample(args: LayoutSiderPropsType) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <NavigationExample
      {...args}
      collapsed={collapsed}
      onCollapse={(value, type) => {
        setCollapsed(value);
        args.onCollapse?.(value, type);
      }}
    />
  );
}
export const Example: Story = { name: 'Панель и рабочая область' };
export const NonCollapsible: Story = {
  name: 'Без сворачивания',
  args: { collapsible: false },
};
export const CustomWidth: Story = {
  name: 'Ширина 300 px',
  args: { width: 300 },
};
export const CollapsibleExample: Story = {
  name: 'Первоначально свёрнутая панель',
  args: { defaultCollapsed: true },
};
export const Dark: Story = { name: 'Тёмная панель', args: { theme: 'dark' } };
export const Scrollable: Story = {
  name: 'Длинное меню и изменение высоты',
  render: (args) => (
    <NavigationExample
      {...args}
      config={[
        ...navigationConfig,
        ...Array.from({ length: 25 }, (_, i) => ({
          key: `service-${i}`,
          label: `Служебный раздел ${i + 1}`,
          permissions: [],
        })),
      ]}
    />
  ),
};
export const WithoutTrigger: Story = {
  name: 'Без нижней кнопки',
  args: { trigger: null },
};
export const ZeroWidth: Story = {
  name: 'Сворачивание до нуля',
  args: { collapsedWidth: 0 },
};
export const Controlled: Story = {
  name: 'Контролируемое сворачивание',
  render: (args) => <ControlledExample {...args} />,
};
export const Responsive: Story = {
  name: 'Адаптивная панель',
  args: { breakpoint: 'md', collapsedWidth: 0 },
};
export const CustomTrigger: Story = {
  name: 'Собственная кнопка',
  args: {
    trigger: (
      <button type="button" aria-label="Переключить меню">
        Меню
      </button>
    ),
  },
};
export const ReverseArrow: Story = {
  name: 'Обратное направление стрелки',
  args: { reverseArrow: true },
};
