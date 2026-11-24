import authGuide from '../../../docs/auth-hook.md?raw';
import { Meta, type StoryObj } from '@storybook/react';
import useAuth from '../../hooks/useAuth';
import { useState } from 'react';

const BasicAuthExample = ({
  loginPath = '/api/login',
  logoutPath = '/api/logout',
}: {
  loginPath?: string;
  logoutPath?: string;
}) => {
  const { isLogged, isLoading, login, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await login(
        loginPath,
        { email, password },
        {
          'Content-Type': 'application/json',
        },
      );
      setError('');
    } catch {
      setError('Ошибка входа. Проверьте данные.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout(logoutPath);
      setError('');
    } catch {
      setError('Не удалось завершить сессию.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '300px' }}>
      <h3>Базовая аутентификация</h3>
      {isLogged.value ? (
        <div>
          <p>Статус: ВЫ АВТОРИЗОВАНЫ ({isLogged.type})</p>
          <button
            onClick={() => void handleLogout()}
            disabled={isLoading}
            aria-label="Logout button"
          >
            Выйти
          </button>
        </div>
      ) : (
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email input"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-label="Password input"
          />
          <button
            onClick={handleLogin}
            disabled={isLoading}
            aria-label="Login button"
          >
            {isLoading ? 'Загрузка...' : 'Войти'}
          </button>
        </div>
      )}
      {error && <p role="alert">{error}</p>}
    </div>
  );
};

const meta: Meta<typeof BasicAuthExample> = {
  title: 'Hooks/useAuth',
  component: BasicAuthExample,
  tags: ['autodocs'],
  args: { loginPath: '/api/login', logoutPath: '/api/logout' },
  argTypes: {
    loginPath: {
      description:
        'Адрес POST-запроса входа в приложении. Storybook не предоставляет этот API.',
    },
    logoutPath: { description: 'Адрес POST-запроса выхода в приложении.' },
  },
  parameters: {
    docs: {
      description: {
        component: authGuide,
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof BasicAuthExample>;
export const BasicAuth: Story = {
  name: 'Пример аутентификации',
  render: (args) => <BasicAuthExample {...args} />,
};
