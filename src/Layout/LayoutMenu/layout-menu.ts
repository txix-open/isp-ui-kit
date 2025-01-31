import { ReactNode } from 'react';

export interface ConfigMenuItemType {
  route?: string;
  label: string;
  key: string;
  className?: string;
  permissions: string | string[];
  icon?: ReactNode;
  children?: ConfigMenuItemType[];
}

export interface MenuItemType {
  label: string;
  key: string;
  className?: string;
  icon?: ReactNode;
  children?: MenuItemType[];
}

export interface LayoutMenuPropsType {
  onHideMenuItem: (value: string | string[]) => string;
  menuConfig: ConfigMenuItemType[];
  onClickItem: ({ key }: { key: string }) => void;
  currentPath: string;
}
