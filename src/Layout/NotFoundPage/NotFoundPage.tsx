import './not-found-page.scss';
import { FC } from 'react';
import { NotFoundPageProps } from './not-found-page';

const NotFoundPage: FC<NotFoundPageProps> = ({ children = null }) => (
  <section className="not-found-page">
    <h2>Такой страницы не существует</h2>
    {children}
  </section>
);
export default NotFoundPage;
