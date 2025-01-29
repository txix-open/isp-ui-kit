import { ReactNode } from 'react';

export interface LayoutSiderPropsType {
  collapsed: boolean;
  onCollapse: (value: boolean) => void;
  children: ReactNode;
}
