# useAuth

Хук выполняет POST-запросы входа и выхода и хранит локальные `isLogged` и `isLoading`. Каждый вызов useAuth создаёт независимое состояние: оно не разделяется между компонентами, не сохраняется после перезагрузки и не восстанавливается из существующей сессии. Для общего состояния вызывайте хук в провайдере приложения и передавайте результат через Context.

```tsx
import { useAuth } from 'isp-ui-kit';
```

## Возвращаемые значения

- `isLogged`: `{ type: 'basic' | 'oAuth', value: boolean }`, начальное значение `{ type: 'basic', value: false }`.
- `isLoading`: true на время запроса, false после его завершения, включая ошибку. Флаг остаётся true, пока выполняется хотя бы один запрос этого экземпляра хука. Приложению всё равно следует избегать конкурирующих входа и выхода: состояние изменяется в порядке успешного завершения запросов.
- `login(path, { email, password }, headers?)`: POST с JSON-телом; возвращает `Promise<{ expired: string; headerName: string; token: string }>`.
- `logout(path, headers?)`: POST без тела; публичный тип — `Promise<void>`. Реализация читает текст ответа и разбирает непустой текст как JSON, поэтому сервер должен вернуть пустое тело или JSON. Не полагайтесь на возвращаемые данные.
- `oAuthLogin(path, { clientName, authCode? }, headers?)`: POST с JSON-телом; возвращает `Promise<{ loginUrl: string }>`.
- `oAuthLogout(path, { clientName, authCode? }, headers?)`: POST с JSON-телом; возвращает `Promise<{ logoutUrl: string }>`.

Пути и заголовки задаёт приложение. `Content-Type: application/json` не добавляется автоматически; передайте его для JSON-запросов, если это требуется API. Хук не сохраняет token, не обновляет его, не добавляет его в другие запросы и не выполняет OAuth-переход по полученному URL. Структура успешного JSON-ответа не проверяется во время выполнения.

## Обработка входа и выхода

```tsx
import { useState } from 'react';
import { useAuth } from 'isp-ui-kit';

type Session = Awaited<ReturnType<ReturnType<typeof useAuth>['login']>>;

export function LoginForm() {
  const { login, logout, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState('');

  async function signIn() {
    setError('');
    try {
      const result = await login(
        '/api/login',
        { email, password },
        {
          'Content-Type': 'application/json',
        },
      );
      // Здесь приложение передаёт результат своему менеджеру сессии.
      setSession(result);
      setPassword('');
    } catch {
      setError('Не удалось войти. Проверьте данные и попробуйте снова.');
    }
  }

  async function signOut() {
    setError('');
    try {
      await logout('/api/logout');
      setSession(null);
    } catch {
      setError('Не удалось завершить сессию. Попробуйте снова.');
    }
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void signIn();
      }}
    >
      {session ? (
        <button
          type="button"
          disabled={isLoading}
          onClick={() => void signOut()}
        >
          Выйти
        </button>
      ) : (
        <>
          <label>
            Email
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label>
            Пароль
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Вход…' : 'Войти'}
          </button>
        </>
      )}
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
```

Пример хранит результат успешного запроса отдельно; пути `/api/login` и `/api/logout` нужно заменить адресами приложения. Менеджер сессии, проверка доступа и способ хранения токена принадлежат приложению. В примере токен не выводится на экран и не записывается в console.

## OAuth

В обработчике приложения вызовите `oAuthLogin('/api/oauth/login', { clientName: 'web' }, headers)` и используйте возвращённый `loginUrl` для перехода, если API вашего приложения работает через перенаправление. После возврата передайте полученный authCode согласно контракту API. Для выхода аналогично используйте oAuthLogout и logoutUrl. Хук сам не читает query-параметры, не проверяет OAuth state и не меняет location.

## Ошибки и текущее поведение

При неуспешном HTTP-ответе basic login/logout отклоняют Promise объектом `{ response, status }`; OAuth-методы — JSON-телом ответа без добавленного status. Ошибка сети или разбора JSON имеет другой формат. Поэтому catch должен обрабатывать unknown, а не предполагать единую структуру.

Статус меняется только после успешного HTTP-ответа и разбора его тела. Ошибка HTTP, сети или JSON сохраняет прежний isLogged; isLoading сбрасывается после завершения всех текущих запросов. OAuth logout после успешного ответа сохраняет прежний type=basic с value=false.

Исправлено прежнее поведение, при котором ошибка входа выставляла true, а ошибка выхода — false. Сигнатуры методов и форматы JSON-ошибок сохранены. Если тело HTTP-ошибки не является JSON, basic-методы возвращают `{ response: текст, status }`, OAuth-методы отклоняют Promise текстом; для пустого тела используется null. Это позволяет сохранить HTTP-ошибку вместо вторичной ошибки разбора JSON.

isLogged по-прежнему описывает результат операции конкретного хука, а не подтверждённую сервером сессию. Особенно это важно для OAuth: получение loginUrl ещё не завершает вход у провайдера. Проверку доступа и восстановление сессии выполняет приложение.

Живая история использует адреса API, переданные через Controls. Storybook не предоставляет сервер авторизации; без подходящего API запрос завершится ошибкой.
