import { useRef, useState } from 'react';

export interface UserData {
  email: string;
  password: string;
}

export interface AuthResponse {
  expired: string;
  headerName: string;
  token: string;
}

export interface OAuthRequest {
  authCode?: string;
  clientName: string;
}

export interface OAuthLoginResponse {
  loginUrl: string;
}

export interface OAuthLogoutResponse {
  logoutUrl: string;
}

export interface IsLogged {
  type: 'basic' | 'oAuth';
  value: boolean;
}

interface UseAuth {
  isLogged: IsLogged;
  isLoading: boolean;
  login: (
    path: string,
    data: UserData,
    headers?: Record<string, string>,
  ) => Promise<AuthResponse>;
  logout: (path: string, headers?: Record<string, string>) => Promise<void>;
  oAuthLogin: (
    path: string,
    data: OAuthRequest,
    headers?: Record<string, string>,
  ) => Promise<OAuthLoginResponse>;
  oAuthLogout: (
    path: string,
    data: OAuthRequest,
    headers?: Record<string, string>,
  ) => Promise<OAuthLogoutResponse>;
}

const useAuth = (): UseAuth => {
  const [isLogged, setLoggedIn] = useState<{
    type: 'basic' | 'oAuth';
    value: boolean;
  }>({
    type: 'basic',
    value: false,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const pendingRequests = useRef(0);

  async function request<T>(operation: () => Promise<T>): Promise<T> {
    pendingRequests.current += 1;
    setIsLoading(true);
    try {
      return await operation();
    } finally {
      pendingRequests.current -= 1;
      setIsLoading(pendingRequests.current > 0);
    }
  }

  async function readError(response: Response): Promise<unknown> {
    const text = await response.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  const login = (
    path: string,
    data: UserData,
    headers: Record<string, string> = {},
  ): Promise<AuthResponse> =>
    request(async () => {
      const response = await fetch(path, {
        method: 'POST',
        headers: { ...headers },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw { response: await readError(response), status: response.status };
      }
      const result: AuthResponse = await response.json();
      setLoggedIn({ type: 'basic', value: true });
      return result;
    });

  const logout = (path: string, headers: Record<string, string> = {}) =>
    request(async () => {
      const response = await fetch(path, {
        method: 'POST',
        headers: { ...headers },
      });
      if (!response.ok) {
        throw { response: await readError(response), status: response.status };
      }
      const text = await response.text();
      const result = text ? JSON.parse(text) : {};
      setLoggedIn({ type: 'basic', value: false });
      return result;
    });

  const oAuthLogin = (
    path: string,
    data: OAuthRequest,
    headers: Record<string, string> = {},
  ): Promise<OAuthLoginResponse> =>
    request(async () => {
      const response = await fetch(path, {
        method: 'POST',
        headers: { ...headers },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw await readError(response);
      const result: OAuthLoginResponse = await response.json();
      setLoggedIn({ type: 'oAuth', value: true });
      return result;
    });

  const oAuthLogout = (
    path: string,
    data: OAuthRequest,
    headers: Record<string, string> = {},
  ): Promise<OAuthLogoutResponse> =>
    request(async () => {
      const response = await fetch(path, {
        method: 'POST',
        headers: { ...headers },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw await readError(response);
      const result: OAuthLogoutResponse = await response.json();
      // Keep the legacy basic type after a successful OAuth logout.
      setLoggedIn({ type: 'basic', value: false });
      return result;
    });

  return {
    isLogged,
    isLoading,
    login,
    logout,
    oAuthLogin,
    oAuthLogout,
  };
};

export default useAuth;
