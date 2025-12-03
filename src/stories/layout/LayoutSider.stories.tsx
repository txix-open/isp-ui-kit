import type { Meta, StoryObj } from '@storybook/react';
import { LayoutMenu, LayoutSider } from '../../Layout';
import { useState } from 'react';

const menuConfig = [
  {
    label: 'admin',
    key: 'profile',
    permissions: [],
  },
  {
    key: 'applications_group',
    label: 'Приложения',
    permissions: [],
  },
  {
    key: 'appAccess',
    label: 'Доступы приложений',
    permissions: [],
  },
  {
    key: 'modules',
    label: 'Модули',
    permissions: [],
  },
  {
    key: 'sessionManagement',
    label: 'Пользователи и роли',
    children: [
      {
        key: 'users',
        label: 'Пользователи',
        permissions: [],
      },
      {
        key: 'sessions',
        label: 'Пользовательские сессии',
        permissions: [],
      },
      {
        key: 'securityLog',
        label: 'Просмотр журналов ИБ',
        permissions: [],
      },
      {
        key: 'roles',
        label: 'Роли',
        permissions: [],
      },
    ],
    permissions: [],
  },
];

const meta: Meta<typeof LayoutSider> = {
  component: LayoutSider,
  title: 'Layout/LayoutSider',
  tags: ['autodocs'],
  parameters: {
    layout: 'left',
    componentSubtitle: 'Компонент LayoutSider для оборачивания меню',
    docs: {
      description: {
        component: '',
      },
    },
  },
  argTypes: {
    collapsed: {
      description: 'значение, устанавливающее открытое или закрытое меню',
    },
    onCollapse: {
      description:
        'функция, меняющая значение collapsed, открывает и закрывает меню',
    },
    children: {
      description:
        'Компонент или компоненты внутри LayoutSider (Menu, List, Header или другие)',
    },
  },
};

export default meta;

type Story = StoryObj<typeof LayoutSider>;

export const Example: Story = {
  name: 'Базовый пример',
  render: () => (
    <LayoutSider theme="light">
      <LayoutMenu
        currentPath="/"
        menuConfig={menuConfig}
        onClickItem={() => null}
        onHideMenuItem={() => ''}
      />
    </LayoutSider>
  ),
};

export const NonCollapsible: Story = {
  name: 'Не сворачиваемый',
  render: () => (
    <LayoutSider collapsible={false}>
      <LayoutMenu
        currentPath="/"
        menuConfig={menuConfig}
        onClickItem={() => null}
        onHideMenuItem={() => ''}
      />
    </LayoutSider>
  ),
};

export const CustomWidth: Story = {
  name: 'Пользовательская ширина',
  render: () => (
    <LayoutSider width="450px">
      <LayoutMenu
        currentPath="/"
        menuConfig={menuConfig}
        onClickItem={() => null}
        onHideMenuItem={() => ''}
      />
    </LayoutSider>
  ),
};

export const CollapsibleExample: Story = {
  name: 'Сворачиваемый',
  render: () => {
    const [collapsed, setCollapsed] = useState(false);
    return (
      <LayoutSider collapsed={collapsed} onCollapse={setCollapsed}>
        <LayoutMenu
          currentPath="/"
          menuConfig={menuConfig}
          onClickItem={() => null}
          onHideMenuItem={() => ''}
        />
      </LayoutSider>
    );
  },
};
