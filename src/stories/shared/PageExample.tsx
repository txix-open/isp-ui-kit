import { useState } from 'react';
import { Button, Space } from 'antd';
import { HomePage, ErrorPage, NotFoundPage } from '../../Layout';
import type { HomePageProps } from '../../Layout/HomePage/home-page';

export const pageBackground =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600"><rect width="900" height="600" fill="#edf3fa"/><circle cx="820" cy="80" r="240" fill="#dbe9f8"/><circle cx="70" cy="600" r="240" fill="#e3edf7"/></svg>',
  );

export function PageExample({
  kind,
  short = false,
  narrow = false,
  ...args
}: HomePageProps & {
  kind: 'home' | 'error' | 'not-found';
  short?: boolean;
  narrow?: boolean;
}) {
  const [result, setResult] = useState('');
  const defaultActions = (
    <Space wrap>
      {kind === 'error' && (
        <Button
          type="primary"
          onClick={() => setResult('Загрузка восстановлена')}
        >
          Попробовать снова
        </Button>
      )}
      <Button
        type={kind === 'not-found' ? 'primary' : 'default'}
        onClick={() => setResult('Главная страница')}
      >
        На главную
      </Button>
    </Space>
  );
  const content =
    args.children === undefined ? (
      kind === 'home' ? (
        <section
          style={{
            maxWidth: 520,
            width: '100%',
            padding: 24,
            boxSizing: 'border-box',
            borderRadius: 12,
            background: 'var(--ant-color-bg-container)',
            border: '1px solid var(--ant-color-border-secondary)',
          }}
        >
          <h1 style={{ fontSize: 24, margin: '0 0 12px' }}>Добро пожаловать</h1>
          <p
            style={{
              color: 'var(--ant-color-text-secondary)',
              marginBottom: 24,
            }}
          >
            Начните с модулей или настройте подключение к сервисам.
          </p>
          <Space wrap>
            <Button type="primary" onClick={() => setResult('Раздел «Модули»')}>
              Открыть модули
            </Button>
            <Button onClick={() => setResult('Настройки подключения')}>
              Настройки
            </Button>
          </Space>
        </section>
      ) : (
        defaultActions
      )
    ) : (
      args.children
    );
  const props = {
    style: { height: '100%', ...args.style },
    className: args.className,
    children: content,
  };
  return (
    <div
      style={{
        height: short ? 180 : 460,
        width: narrow ? 320 : '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        border: '1px solid var(--ant-color-border-secondary)',
        borderRadius: 12,
      }}
    >
      {result ? (
        <HomePage style={{ height: '100%' }}>
          <div role="status" style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: 24 }}>{result}</h1>
            <Button onClick={() => setResult('')}>Вернуться к примеру</Button>
          </div>
        </HomePage>
      ) : kind === 'home' ? (
        <HomePage {...props} backgroundImage={args.backgroundImage} />
      ) : kind === 'error' ? (
        <ErrorPage {...props} />
      ) : (
        <NotFoundPage {...props} />
      )}
    </div>
  );
}
