import type { Meta, StoryObj } from '@storybook/react';
import { LayoutMenu } from '../../Layout';

const meta: Meta<typeof LayoutMenu> = {
  component: LayoutMenu,
  title: 'Layout/LayoutMenu',
  args: {
    menuConfig: [
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
    ],
  },
  parameters: {
    layout: 'left',
    componentSubtitle: 'Компонент LayoutMenu для отображения меню',
    docs: {
      description: {
        component: '',
      },
    },
  },
  argTypes: {
    currentPath: {
      description: 'роут, по которому происходит переход на страницу по клику',
    },
    menuConfig: {
      description:
        'массив объектов, в которых находится вся важная информация для отрисовки и работы меню',
    },
    onClickItem: {
      description:
        'функция, принимающая строку и выполняющая навигейт по роуту',
    },
    onHideMenuItem: {
      description:
        'функция, принимающая пермишены, которая возвращает строку - className, который рисует или скрывает итем в зависимости от пермишенов',
    },
  },
};

export default meta;

type Story = StoryObj<typeof LayoutMenu>;

export const Example: Story = {
  render: (args) => {
    return (
      <div style={{ width: '250px' }}>
        <LayoutMenu
          currentPath="/"
          menuConfig={args.menuConfig}
          onClickItem={() => null}
          onHideMenuItem={() => false}
        />
      </div>
    );
  },
};
