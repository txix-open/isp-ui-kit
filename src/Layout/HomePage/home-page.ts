import type { CSSProperties, PropsWithChildren } from 'react';

export interface HomePageProps extends PropsWithChildren {
  backgroundImage?: string;
  style?: CSSProperties;
  className?: string;
}
