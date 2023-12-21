import { Result } from 'antd';
import { FC } from 'react';
import { ErrorPageProps } from './error-page';

const ErrorPage: FC<ErrorPageProps> = ({ children = null }) => (
  <Result
    status="500"
    title="500"
    subTitle="Извините, что-то пошло не так."
    extra={children}
  />
);

export default ErrorPage;
