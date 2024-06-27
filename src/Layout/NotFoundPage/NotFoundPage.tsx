import './not-found-page.scss';
import { FC } from 'react';
import { NotFoundPageProps } from './not-found-page';

const NotFoundPage: FC<NotFoundPageProps> = ({ children = null }) => (
  <section className="not-found-page">
    <h2>Такой страницы не существует</h2>
    <div className="not-found-page__children-wrapper">{children}</div>
  </section>
);
export default NotFoundPage;
