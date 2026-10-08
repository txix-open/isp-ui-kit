import { useState } from 'react';
import { Button } from 'antd';
import { LayoutMenu } from '../../Layout';
import type { ConfigMenuItemType } from '../../Layout/LayoutMenu/layout-menu';
import { useDesignPreview } from './DesignPreviewContext';

export function MenuRoutingExample({ nested = false }: { nested?: boolean }) {
  const { theme } = useDesignPreview();
  const [pathname, setPathname] = useState(
    nested ? '/admin/users/42' : '/module-details/42',
  );
  const [history, setHistory] = useState<string[]>([]);
  const navigate = (next: string) => {
    setHistory((previous) => [...previous, pathname]);
    setPathname(next);
  };
  const config: ConfigMenuItemType[] = nested
    ? [
        { key: 'modules', label: 'Модули', permissions: [] },
        {
          key: 'access',
          label: 'Доступ',
          permissions: [],
          children: [
            { key: 'users', label: 'Пользователи', permissions: [] },
            { key: 'roles', label: 'Роли', permissions: [] },
          ],
        },
      ]
    : [
        {
          key: 'moduleSection',
          label: 'Модули',
          route: ['modules', 'module-details'],
          permissions: [],
        },
        {
          key: 'peopleSection',
          label: 'Пользователи',
          route: 'users',
          permissions: [],
        },
      ];
  const destinations: Record<string, string> = nested
    ? { modules: '/modules', users: '/admin/users', roles: '/admin/roles' }
    : { moduleSection: '/modules', peopleSection: '/users' };
  const selectedKey = Object.keys(destinations).find(
    (key) =>
      pathname === destinations[key] ||
      pathname.startsWith(`${destinations[key]}/`),
  );
  const menuPath = nested
    ? selectedKey
      ? `/${selectedKey}`
      : '/__no_menu_match__'
    : pathname;
  const resetKey = nested ? menuPath : pathname.split('/')[1];
  const paths = nested
    ? ['/modules/17', '/admin/users/42', '/admin/roles', '/help']
    : ['/modules', '/module-details/42', '/users/42'];
  return (
    <div>
      <div
        style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}
      >
        {paths.map((path) => (
          <Button key={path} size="small" onClick={() => navigate(path)}>
            {path}
          </Button>
        ))}
        <Button
          size="small"
          disabled={!history.length}
          onClick={() => {
            setPathname(history[history.length - 1]);
            setHistory((previous) => previous.slice(0, -1));
          }}
        >
          Назад
        </Button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ width: 250, maxWidth: '100%' }}>
          <LayoutMenu
            key={resetKey}
            menuConfig={config}
            currentPath={menuPath}
            theme={theme === 'dark' ? 'dark' : 'light'}
            onHideMenuItem={() => false}
            onClickItem={({ key }) => {
              const destination = destinations[key];
              if (destination) navigate(destination);
            }}
          />
        </div>
        <div
          style={{ minWidth: 0, overflowWrap: 'anywhere' }}
          aria-live="polite"
        >
          <p>
            URL приложения: <strong>{pathname}</strong>
          </p>
          <p>
            currentPath меню: <strong>{menuPath}</strong>
          </p>
          <p>Выбранный key определяется конфигурацией меню.</p>
        </div>
      </div>
      <p style={{ color: 'var(--ant-color-text-secondary)', fontSize: 12 }}>
        В примере переходы и история хранятся в React state. URL Storybook не
        изменяется; для приложения подключите свой router.
      </p>
    </div>
  );
}
