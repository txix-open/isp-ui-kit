import { ReactNode } from 'react';

export interface ConfigMenuItemType {
  route?: string | string[];
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
  onHideMenuItem: (value: string | string[]) => boolean;
  menuConfig: ConfigMenuItemType[];
  onClickItem: ({ key }: { key: string }) => void;
  currentPath: string;
}
