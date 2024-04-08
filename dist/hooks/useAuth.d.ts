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
declare const useAuth: () => UseAuth;
export default useAuth;
