import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import useAuth from '../src/hooks/useAuth';

type Auth = ReturnType<typeof useAuth>;
let auth: Auth;
function Probe() {
  auth = useAuth();
  return createElement(
    'p',
    null,
    JSON.stringify({ logged: auth.isLogged, loading: auth.isLoading }),
  );
}
const results: string[] = [];
const assert = (condition: unknown, message: string) => {
  if (!condition) throw new Error(message);
};
const data = { email: 'test@example.test', password: 'test' };
const basicResponse = () =>
  Response.json({
    token: 'test',
    headerName: 'Authorization',
    expired: 'tomorrow',
  });
const oauthResponse = () => Response.json({ loginUrl: '/login' });
const root = createRoot(document.getElementById('root')!);
const originalFetch = window.fetch;
(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;
async function mount() {
  await act(async () =>
    root.render(createElement(Probe, { key: results.length })),
  );
}
async function scenario(name: string, check: () => Promise<void>) {
  await mount();
  await check();
  results.push(name);
}
async function reject(operation: () => Promise<unknown>) {
  let error: unknown;
  await act(async () => {
    try {
      await operation();
    } catch (caught) {
      error = caught;
    }
  });
  assert(error !== undefined, 'request must reject');
  assert(!auth.isLoading, 'loading must end on failure');
  return error;
}

try {
  await scenario(
    'HTTP login failure does not authorize; basic error shape is preserved',
    async () => {
      window.fetch = async () =>
        Response.json({ message: 'denied' }, { status: 401 });
      const error = (await reject(() => auth.login('/login', data))) as {
        status: number;
        response: { message: string };
      };
      assert(
        !auth.isLogged.value &&
          error.status === 401 &&
          error.response.message === 'denied',
        'failed basic login',
      );
    },
  );
  await scenario(
    'OAuth HTTP failure does not authorize; body remains the rejection value',
    async () => {
      window.fetch = async () =>
        Response.json({ message: 'denied' }, { status: 403 });
      const error = (await reject(() =>
        auth.oAuthLogin('/oauth', { clientName: 'web' }),
      )) as { message: string };
      assert(
        !auth.isLogged.value && error.message === 'denied',
        'failed OAuth login',
      );
    },
  );
  await scenario(
    'invalid JSON, rejected fetch and synchronous throws restore loading',
    async () => {
      window.fetch = async () => new Response('invalid');
      await reject(() => auth.login('/login', data));
      assert(!auth.isLogged.value, 'invalid JSON must not authorize');
      window.fetch = async () => {
        throw new Error('offline');
      };
      await reject(() => auth.login('/login', data));
      window.fetch = () => {
        throw new Error('synchronous failure');
      };
      await reject(() => auth.login('/login', data));
      assert(!auth.isLogged.value, 'network failure must not authorize');
    },
  );
  await scenario(
    'basic success, failed logout, empty logout and request payload',
    async () => {
      window.fetch = async (_path, options) => {
        assert(
          options?.method === 'POST' && options.body === JSON.stringify(data),
          'request payload changed',
        );
        assert(
          (options?.headers as Record<string, string>)['X-Test'] === 'yes',
          'headers changed',
        );
        return basicResponse();
      };
      await act(async () => {
        await auth.login('/login', data, { 'X-Test': 'yes' });
      });
      assert(
        auth.isLogged.value && auth.isLogged.type === 'basic',
        'basic success',
      );
      window.fetch = async () => new Response('unavailable', { status: 503 });
      const error = (await reject(() => auth.logout('/logout'))) as {
        status: number;
        response: string;
      };
      assert(
        auth.isLogged.value &&
          error.status === 503 &&
          error.response === 'unavailable',
        'failed logout changed state',
      );
      window.fetch = async () => new Response(null, { status: 204 });
      await act(async () => {
        await auth.logout('/logout');
      });
      assert(!auth.isLogged.value && !auth.isLoading, 'empty logout success');
    },
  );
  await scenario(
    'OAuth success, failed logout and successful logout',
    async () => {
      window.fetch = async () => oauthResponse();
      await act(async () => {
        await auth.oAuthLogin('/oauth', { clientName: 'web' });
      });
      assert(
        auth.isLogged.value && auth.isLogged.type === 'oAuth',
        'OAuth success',
      );
      window.fetch = async () =>
        Response.json({ error: 'denied' }, { status: 500 });
      await reject(() =>
        auth.oAuthLogout('/oauth/logout', { clientName: 'web' }),
      );
      assert(
        auth.isLogged.value && auth.isLogged.type === 'oAuth',
        'failed OAuth logout changed state',
      );
      window.fetch = async () => Response.json({ logoutUrl: '/logged-out' });
      await act(async () => {
        await auth.oAuthLogout('/oauth/logout', { clientName: 'web' });
      });
      assert(
        !auth.isLogged.value && auth.isLogged.type === 'basic',
        'legacy logout type',
      );
    },
  );
  await scenario(
    'loading remains true until all concurrent requests finish',
    async () => {
      const finish: ((response: Response) => void)[] = [];
      window.fetch = () =>
        new Promise<Response>((resolve) => finish.push(resolve));
      let first!: Promise<unknown>, second!: Promise<unknown>;
      await act(async () => {
        first = auth.login('/one', data);
        second = auth.login('/two', data);
      });
      assert(auth.isLoading, 'loading while pending');
      await act(async () => {
        finish[0](basicResponse());
        await first;
      });
      assert(auth.isLoading, 'loading ended before second request');
      await act(async () => {
        finish[1](basicResponse());
        await second;
      });
      assert(!auth.isLoading, 'loading did not end');
    },
  );
  document.body.dataset.result = 'passed';
} catch (error) {
  document.body.dataset.result = 'failed';
  results.push(String(error));
} finally {
  window.fetch = originalFetch;
  await act(async () => root.unmount());
  const output = document.createElement('pre');
  output.textContent = results.join('\n');
  document.body.append(output);
}
