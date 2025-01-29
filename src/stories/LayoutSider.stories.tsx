import type { Meta, StoryObj } from '@storybook/react';
import { LayoutMenu, LayoutSider } from '../Layout';
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
  render: () => {
    const [collapsed, setCollapsed] = useState(true);
    const onCollapse = (value: boolean) => {
      setCollapsed(value);
    };

    return (
      <LayoutSider collapsed={collapsed} onCollapse={onCollapse}>
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
