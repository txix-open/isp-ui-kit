import { Layout, Result } from 'antd';
import { FC } from 'react';
import { ErrorPageProps } from './error-page';

const ErrorPage: FC<ErrorPageProps> = ({ children = null }) => (
  <Layout className="error-page">
    <Result
      status="500"
      title="500"
      subTitle="Извините, что-то пошло не так."
      extra={children}
    />
  </Layout>
);

export default ErrorPage;
