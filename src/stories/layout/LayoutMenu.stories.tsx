import type { Meta, StoryObj } from '@storybook/react';
import { LayoutMenu } from '../../Layout';
import { useState } from 'react';

const baseMenuConfig = [
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

const meta: Meta<typeof LayoutMenu> = {
  component: LayoutMenu,
  title: 'Layout/LayoutMenu',
  tags: ['autodocs'],
  args: {
    menuConfig: baseMenuConfig,
  },
  parameters: {
    layout: 'left',
    componentSubtitle: 'Компонент LayoutMenu для отображения меню',
  },
  argTypes: {
    currentPath: {
      description: `роут, по которому происходит переход на страницу по клику. **ВАЖНО**: значение должно совпадать с *key:'test' = '/test'* `,
    },
    menuConfig: {
      description: 'конфигурация меню',
    },
    onClickItem: {
      description: 'обработчик клика по элементу',
    },
    onHideMenuItem: {
      description: 'функция, скрывающая пункты меню',
    },
  },
};

export default meta;

type Story = StoryObj<typeof LayoutMenu>;

export const Example: Story = {
  name: 'Базовый пример',
  render: (args) => (
    <div style={{ width: 250 }}>
      <LayoutMenu
        currentPath="/"
        menuConfig={args.menuConfig}
        onClickItem={() => null}
        onHideMenuItem={() => false}
      />
    </div>
  ),
};

export const SelectedItem: Story = {
  name: 'Выбранный элемент',
  render: (args) => (
    <div style={{ width: 250 }}>
      <LayoutMenu
        currentPath="/sessionManagement/users"
        menuConfig={args.menuConfig}
        onClickItem={() => null}
        onHideMenuItem={() => false}
      />
    </div>
  ),
};

export const HiddenItems: Story = {
  name: 'Скрытые элементы',
  render: (args) => {
    const onHide = (permissions: string[]) => {
      return permissions.includes('hide');
    };

    const config = [
      ...args.menuConfig,
      {
        key: 'hiddenItem',
        label: 'Скрытый элемент',
        permissions: ['hide'],
      },
    ];

    return (
      <div style={{ width: 250 }}>
        <LayoutMenu
          currentPath="/"
          menuConfig={config}
          onClickItem={() => null}
          onHideMenuItem={onHide}
        />
      </div>
    );
  },
};

export const DeepNested: Story = {
  name: 'Вложенные элементы',
  render: () => {
    const config = [
      {
        key: 'root',
        label: 'Root',
        permissions: [],
        children: [
          {
            key: 'level1',
            label: '1 уровень',
            children: [
              {
                key: 'level2',
                label: '2 уровень',
                children: [
                  {
                    key: 'level3',
                    label: '3 уровень',
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    return (
      <div style={{ width: 250 }}>
        <LayoutMenu
          currentPath="/root/level1/level2"
          menuConfig={config}
          onClickItem={() => null}
          onHideMenuItem={() => false}
        />
      </div>
    );
  },
};

export const WithClickHandler: Story = {
  name: 'С обработчиком Клика',
  render: (args) => {
    const [clickedKey, setClickedKey] = useState<string | null>(null);

    const handleClick = (info: any) => {
      setClickedKey(info.key);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ width: 250 }}>
          <LayoutMenu
            currentPath="/"
            menuConfig={args.menuConfig}
            onClickItem={handleClick}
            onHideMenuItem={() => false}
          />
        </div>

        <div
          style={{
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: 6,
            background: '#fafafa',
            fontFamily: 'monospace',
          }}
        >
          {clickedKey ? (
            <>
              Clicked key: <strong>{clickedKey}</strong>
            </>
          ) : (
            <>Click menu item…</>
          )}
        </div>
      </div>
    );
  },
};
