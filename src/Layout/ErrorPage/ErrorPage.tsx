import { Layout, Result } from 'antd';
import { FC } from 'react';
import { ErrorPageProps } from './error-page';
import './error-page.scss';
import '../page.scss';

const ErrorPage: FC<ErrorPageProps> = ({
  children = null,
  style,
  className,
}) => (
  <Layout
    className={['kit-page', 'kit-page--status', 'error-page', className]
      .filter(Boolean)
      .join(' ')}
    style={style}
  >
    <Result
      status="error"
      title={<h1>Ошибка 500</h1>}
      subTitle="Не удалось загрузить страницу. Попробуйте ещё раз или вернитесь в приложение."
      extra={children}
    />
  </Layout>
);
export default ErrorPage;
