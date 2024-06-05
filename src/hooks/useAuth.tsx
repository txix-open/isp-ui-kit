import { useState } from 'react';

export interface UserData {
  email: string;
  password: string;
}

export interface AuthResponse {
  expired: string;
  headerName: string;
  token: string;
}

export interface SudirRequest {
  authCode: string;
}

export interface IsLogged {
  type: 'basic' | 'sudir';
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
  sudirLogin: (
    path: string,
    data: SudirRequest,
    headers?: Record<string, string>,
  ) => Promise<void>;
}

const useAuth = (): UseAuth => {
  const [isLogged, setLoggedIn] = useState<{
    type: 'basic' | 'sudir';
    value: boolean;
  }>({
    type: 'basic',
    value: false,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async (
    path: string,
    data: UserData,
    headers: Record<string, string> = {},
  ): Promise<AuthResponse> => {
    setIsLoading(true);
    return fetch(path, {
      method: 'POST',
      headers: {
        ...headers,
      },
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        if (!response.ok) {
          setLoggedIn({ type: 'basic', value: true });
          const errorData = {
            response: await response.json(),
            status: response.status,
          };
          return Promise.reject(errorData);
        }
        setLoggedIn({ type: 'basic', value: true });
        return response.json();
      })
      .then((responseData) => responseData)
      .finally(() => setIsLoading(false));
  };
  const logout = async (path: string, headers: Record<string, string> = {}) => {
    setIsLoading(true);
    return fetch(path, {
      method: 'POST',
      headers: {
        ...headers,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          setLoggedIn({ type: 'basic', value: false });
          const errorData = {
            response: await response.json(),
            status: response.status,
          };
          return Promise.reject(errorData);
        }
        setLoggedIn({ type: 'basic', value: false });
        return response.text();
      })
      .then((responseData) => (responseData ? JSON.parse(responseData) : {}))
      .finally(() => setIsLoading(false));
  };

  const sudirLogin = async (
    path: string,
    data: SudirRequest,
    headers: Record<string, string> = {},
  ) => {
    setIsLoading(true);
    return fetch(path, {
      method: 'POST',
      headers: { ...headers },
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        if (!response.ok) {
          setLoggedIn({ type: 'sudir', value: true });

          const errorData = await response.json();
          return Promise.reject(errorData);
        }
        setLoggedIn({ type: 'sudir', value: true });
        return response.json();
      })
      .then((responseData) => responseData)
      .finally(() => setIsLoading(false));
  };

  return {
    isLogged,
    isLoading,
    login,
    logout,
    sudirLogin,
  };
};

export default useAuth;
