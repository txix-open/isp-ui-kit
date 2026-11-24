import { useState } from 'react';
import { Button, Layout } from 'antd';
import { LayoutMenu, LayoutSider } from '../../Layout';
import type {
  ConfigMenuItemType,
  LayoutMenuPropsType,
} from '../../Layout/LayoutMenu/layout-menu';
import type { LayoutSiderPropsType } from '../../Layout/LayoutSider/layout-sider';
import { useDesignPreview } from './DesignPreviewContext';

const Icon = ({
  kind,
  className,
}: {
  kind: 'grid' | 'users' | 'settings';
  className?: string;
}) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    aria-hidden="true"
  >
    {kind === 'grid' ? (
      <path d="M3 3h5v5H3zM12 3h5v5h-5zM3 12h5v5H3zM12 12h5v5h-5z" />
    ) : kind === 'users' ? (
      <>
        <circle cx="10" cy="6" r="3" />
        <path d="M4 17v-2a6 6 0 0 1 12 0v2" />
      </>
    ) : (
      <>
        <path d="M3 5h14M3 10h14M3 15h14" />
        <circle cx="7" cy="5" r="2" />
        <circle cx="13" cy="10" r="2" />
        <circle cx="7" cy="15" r="2" />
      </>
    )}
  </svg>
);

export const navigationConfig: ConfigMenuItemType[] = [
  {
    key: 'applications',
    label: 'Приложения',
    permissions: [],
    icon: <Icon kind="grid" />,
  },
  {
    key: 'modules',
    label: 'Модули',
    permissions: [],
    icon: <Icon kind="settings" />,
  },
  {
    key: 'access',
    label: 'Пользователи и доступ',
    permissions: [],
    icon: <Icon kind="users" />,
    children: [
      { key: 'users', label: 'Пользователи', permissions: [] },
      { key: 'roles', label: 'Роли и разрешения', permissions: [] },
      {
        key: 'sessions',
        label: 'Пользовательские сессии и история входов',
        permissions: [],
      },
    ],
  },
  {
    key: 'settings',
    label: 'Настройки интеграций и подключения к внешним системам',
    permissions: [],
    icon: <Icon kind="settings" />,
  },
];

export const hideRestricted = (permissions: string | string[]) =>
  (Array.isArray(permissions) ? permissions : [permissions]).includes(
    'restricted',
  );

export function MenuExample(args: LayoutMenuPropsType) {
  const { theme } = useDesignPreview();
  const [path, setPath] = useState<string>();
  return (
    <div style={{ width: args.inlineCollapsed ? 80 : 250, maxWidth: '100%' }}>
      <LayoutMenu
        {...args}
        currentPath={path ?? args.currentPath}
        theme={args.theme ?? (theme === 'dark' ? 'dark' : 'light')}
        onClickItem={(info) => {
          setPath(`/${info.key}`);
          args.onClickItem(info);
        }}
      />
      <p
        style={{
          fontSize: 12,
          overflowWrap: 'anywhere',
          color: 'var(--ant-color-text-secondary)',
        }}
      >
        Маршрут: {path ?? args.currentPath}
      </p>
    </div>
  );
}

export function NavigationExample({
  config = navigationConfig,
  initialPath = '/users',
  ...args
}: LayoutSiderPropsType & {
  config?: ConfigMenuItemType[];
  initialPath?: string;
}) {
  const preview = useDesignPreview();
  const scheme = args.theme ?? (preview.theme === 'dark' ? 'dark' : 'light');
  const [path, setPath] = useState(initialPath);
  const [height, setHeight] = useState(400);
  return (
    <div>
      <div
        style={{ marginBottom: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}
      >
        <Button
          size="small"
          onClick={() => setHeight(height === 400 ? 280 : 400)}
        >
          Изменить высоту области
        </Button>
        <span
          style={{ color: 'var(--ant-color-text-secondary)', fontSize: 12 }}
        >
          Высота: {height} px
        </span>
      </div>
      <Layout
        style={{
          height,
          borderRadius: 12,
          overflow: 'hidden',
          border: '1px solid var(--ant-color-border-secondary)',
          maxWidth: '100%',
        }}
      >
        <LayoutSider
          {...args}
          theme={scheme}
          style={{ height: '100%', ...args.style }}
        >
          <LayoutMenu
            menuConfig={config}
            currentPath={path}
            theme={scheme}
            onClickItem={({ key }) => setPath(`/${key}`)}
            onHideMenuItem={hideRestricted}
          />
        </LayoutSider>
        <Layout.Content
          style={{
            minWidth: 0,
            padding: 16,
            overflow: 'auto',
            background: 'var(--ant-color-bg-container)',
          }}
        >
          <strong>Рабочая область</strong>
          <p style={{ overflowWrap: 'anywhere' }} aria-live="polite">
            Маршрут: {path}
          </p>
          <p style={{ color: 'var(--ant-color-text-secondary)', fontSize: 13 }}>
            Меню и сворачивание работают независимо от содержимого страницы.
          </p>
        </Layout.Content>
      </Layout>
    </div>
  );
}
