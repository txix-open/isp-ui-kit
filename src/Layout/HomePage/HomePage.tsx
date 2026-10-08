import './home-page.scss';
import '../page.scss';
import { FC } from 'react';
import { HomePageProps } from './home-page';

const HomePage: FC<HomePageProps> = ({
  backgroundImage,
  children = null,
  style,
  className,
}) => (
  <div
    className={['kit-page', 'home-page', className].filter(Boolean).join(' ')}
    style={{
      backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
      ...style,
    }}
  >
    {children}
  </div>
);
export default HomePage;
