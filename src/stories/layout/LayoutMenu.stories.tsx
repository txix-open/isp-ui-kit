import type { Meta, StoryObj } from '@storybook/react';
import { LayoutMenu } from '../../Layout';
import navigationGuide from '../../../docs/layout-navigation.md?raw';
import { MenuRoutingExample } from '../shared/MenuRoutingExample';
import {
  MenuExample,
  navigationConfig,
  hideRestricted,
} from '../shared/NavigationExample';

const meta = {
  component: LayoutMenu,
  title: 'Layout/LayoutMenu',
  tags: ['autodocs'],
  args: {
    menuConfig: navigationConfig,
    currentPath: '/modules',
    onClickItem: () => {},
    onHideMenuItem: hideRestricted,
  },
  render: (args) => <MenuExample {...args} />,
  parameters: {
    layout: 'padded',
    componentSubtitle: 'Навигация на основе Ant Design Menu',
    docs: {
      description: {
        component: navigationGuide,
      },
    },
  },
  argTypes: {
    currentPath: {
      description:
        'Текущий путь. Первый сегмент соответствует key или одному из route.',
    },
    menuConfig: {
      description:
        'Дерево пунктов: уникальный key, label, permissions; опционально icon, children, route и className.',
    },
    onClickItem: {
      description:
        'Обработчик выбора пункта. В примерах обновляет показанный маршрут.',
    },
    onHideMenuItem: {
      description:
        'Возвращает true, чтобы скрыть пункт по permissions; поддерживает строку и массив.',
    },
    theme: {
      description:
        'Тема Menu. По умолчанию light; для тёмного Sider передайте dark.',
      control: 'radio',
      options: ['light', 'dark'],
    },
    inlineCollapsed: {
      description:
        'Свёрнутый вид отдельного меню. Внутри Sider состояние наследуется автоматически.',
    },
  },
} satisfies Meta<typeof LayoutMenu>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Example: Story = {
  name: 'Навигация',
  parameters: {
    docs: {
      description: {
        story:
          'Выберите пункт: маршрут под меню обновится, выбранная строка получит акцент.',
      },
    },
  },
};
export const SelectedItem: Story = {
  name: 'Вложенный активный пункт',
  args: { currentPath: '/users' },
};
export const HiddenItems: Story = {
  name: 'Скрытие по разрешениям',
  args: {
    menuConfig: [
      ...navigationConfig,
      {
        key: 'hidden',
        label: 'Недоступный раздел',
        permissions: ['restricted'],
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Раздел с restricted скрыт. Остальные пункты и обработчики доступны.',
      },
    },
  },
};
export const DeepNested: Story = {
  name: 'Три уровня вложенности',
  args: {
    currentPath: '/audit',
    menuConfig: [
      {
        key: 'admin',
        label: 'Администрирование',
        permissions: [],
        children: [
          {
            key: 'security',
            label: 'Безопасность',
            permissions: [],
            children: [
              { key: 'audit', label: 'Журнал аудита', permissions: [] },
            ],
          },
        ],
      },
    ],
  },
};
export const WithClickHandler: Story = {
  name: 'Переходы между пунктами',
  args: { currentPath: '/applications' },
};
export const Collapsed: Story = {
  name: 'Свёрнутое меню с иконками',
  args: { inlineCollapsed: true, currentPath: '/modules' },
};
export const Dark: Story = {
  name: 'Явная тёмная тема',
  args: { theme: 'dark', currentPath: '/users' },
};

export const RouteAliases: Story = {
  name: 'Key, route и несколько URL одного раздела',
  render: () => <MenuRoutingExample />,
  parameters: {
    docs: {
      description: {
        story:
          'moduleSection имеет route=[modules, module-details]. Оба URL выделяют один пункт; клик использует отдельное соответствие key → адрес. Кнопка «Назад» демонстрирует обновление currentPath из истории.',
      },
    },
  },
};
export const NestedRoutes: Story = {
  name: 'Вложенные URL и адаптер маршрутов',
  render: () => <MenuRoutingExample nested />,
  parameters: {
    docs: {
      description: {
        story:
          'Адрес /admin/users/42 передаётся меню как /users. Переходы между разделами пересоздают меню через React key, чтобы применить начальное раскрытие и очистить выбор на /help. Полный пример интеграции с router приведён выше.',
      },
    },
  },
};
