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
      const response = await login(loginPath, { email, password });
      console.log('Auth successful:', response);
      setError('');
    } catch (err) {
      setError('Ошибка входа. Проверьте данные.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '300px' }}>
      <h3>Базовая аутентификация</h3>
      {isLogged.value ? (
        <div>
          <p>Статус: ВЫ АВТОРИЗОВАНЫ ({isLogged.type})</p>
          <button
            onClick={() => logout(logoutPath)}
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
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}
    </div>
  );
};

const meta: Meta<typeof useAuth> = {
  title: 'Hooks/useAuth',
  component: BasicAuthExample,
  parameters: {
    docs: {
      description: {
        component: `
Компонент для демонстрации базовой аутентификации с использованием хука \`useAuth\`.

## Возвращаемые значения из хука \`useAuth\`
### 1. **isLogged**
- **Тип:** \`{ type: 'basic' | 'sudir'; value: boolean }\`
- **Описание:** Объект, содержащий информацию о текущем состоянии аутентификации.
  - **\`type\`**: Тип аутентификации (например, \`basic\` для обычной аутентификации с email/паролем или \`sudir\` для аутентификации через код Sudir).
  - **\`value\`**: Логическое значение, показывающее, авторизован ли пользователь (\`true\` — авторизован, \`false\` — не авторизован).

### 2. **isLoading**
- **Тип:** \`boolean\`
- **Описание:** Логическое значение, которое указывает, находится ли система в состоянии загрузки (например, при отправке запроса на сервер для логина или логаута).

### 3. **login**
- **Тип:** \`(path: string, data: UserData, headers?: Record<string, string>) => Promise<AuthResponse>\`
- **Описание:** Функция для выполнения логина с использованием email и пароля.
  - **Параметры:**
    - \`path\`: Путь для API запроса.
    - \`data\`: Данные пользователя (email и пароль).
    - \`headers\`: Необязательные заголовки для запроса.
  - **Возвращаемое значение:** Промис, который возвращает объект \`AuthResponse\` с данными аутентификации (например, токен и время истечения).

### 4. **logout**
- **Тип:** \`(path: string, headers?: Record<string, string>) => Promise<void>\`
- **Описание:** Функция для выполнения выхода.
  - **Параметры:**
    - \`path\`: Путь для API запроса на выход.
    - \`headers\`: Необязательные заголовки для запроса.
  - **Возвращаемое значение:** Промис, который завершает запрос на выход (не возвращает данные).

### 5. **sudirLogin**
- **Тип:** \`(path: string, data: SudirRequest, headers?: Record<string, string>) => Promise<void>\`
- **Описание:** Функция для выполнения аутентификации через Sudir с использованием кода авторизации.
  - **Параметры:**
    - \`path\`: Путь для API запроса.
    - \`data\`: Данные для аутентификации (например, код авторизации).
    - \`headers\`: Необязательные заголовки для запроса.
  - **Возвращаемое значение:** Промис, который завершает запрос на аутентификацию (не возвращает данные).

## Пример компонента

\`\`\`tsx
import { useState } from 'react';
import { useAuth } from 'isp-ui-kit'

const AuthExample = () => {
  const { isLogged, isLoading, login, logout, sudirLogin } = useAuth();
}
        `,
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof useAuth>;
export const BasicAuth: Story = {
  name: 'Пример аутентификации',
  render: (args) => <BasicAuthExample />,
};
