import './home-page.scss';
import { FC } from 'react';
import { HomePageProps } from './home-page';

const HomePage: FC<HomePageProps> = ({ backgroundImage, children = null }) => (
  <div
    className="home-page"
    style={{
      backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
    }}
  >
    {children}
  </div>
);

export default HomePage;
