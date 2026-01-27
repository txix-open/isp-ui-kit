import { ReactNode } from 'react';
import type { MenuProps } from 'antd';

export interface ConfigMenuItemType {
  route?: string | string[];
  label: string;
  key: string;
  className?: string;
  permissions: string | string[];
  icon?: ReactNode;
  children?: ConfigMenuItemType[];
}

export type MenuItemType = Required<MenuProps>['items'][number];

export interface LayoutMenuPropsType {
  onHideMenuItem: (value: string | string[]) => boolean;
  menuConfig: ConfigMenuItemType[];
  onClickItem: ({ key }: { key: string }) => void;
  currentPath: string;
}
