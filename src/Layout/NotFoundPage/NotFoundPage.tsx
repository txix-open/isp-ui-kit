import './not-found-page.scss';
import '../page.scss';
import { FC } from 'react';
import { Layout } from 'antd';
import { NotFoundPageProps } from './not-found-page';

const NotFoundPage: FC<NotFoundPageProps> = ({
  children = null,
  style,
  className,
}) => (
  <Layout
    className={[
      'kit-page',
      'kit-page--status',
      'not-found-page__layout',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    style={style}
  >
    <section className="not-found-page">
      <span className="not-found-page__code">404</span>
      <h1>Такой страницы не существует</h1>
      <p className="not-found-page__description">
        Проверьте адрес или вернитесь в приложение.
      </p>
      {children !== null && children !== undefined && children !== false && (
        <div className="not-found-page__children-wrapper">{children}</div>
      )}
    </section>
  </Layout>
);
export default NotFoundPage;
