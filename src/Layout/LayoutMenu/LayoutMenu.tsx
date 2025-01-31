import { useEffect, useState } from 'react';
import { Menu } from 'antd';

import {
  ConfigMenuItemType,
  LayoutMenuPropsType,
  MenuItemType,
} from './layout-menu';
import { findRouteWithParents } from '../../utils/layoutMenuUtils';

import './layout-menu.scss';

const LayoutMenu = ({
  menuConfig,
  onHideMenuItem,
  onClickItem: handleItemChange,
  currentPath,
}: LayoutMenuPropsType) => {
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedMenuKeys, setSelectedMenuKeys] = useState<string[]>([]);

  useEffect(() => {
    const menuKey = currentPath.split('/')[1];
    const routeWithParents = findRouteWithParents(menuKey, menuConfig);
    if (routeWithParents) {
      const { route, parentKeys } = routeWithParents;
      setSelectedMenuKeys([route.key]);
      setOpenKeys(parentKeys);
      return;
    }
  }, [currentPath]);

  const getMenuItems = (menuConfigs: ConfigMenuItemType[]): MenuItemType[] => {
    return menuConfigs.map((item: ConfigMenuItemType) => ({
      label: item.label,
      key: item.key,
      className: item.className
        ? item.className + `${onHideMenuItem(item.permissions)}`
        : onHideMenuItem(item.permissions),
      icon: item.icon,
      children:
        item.children && item.children.length > 0
          ? getMenuItems(item.children)
          : undefined,
    }));
  };

  return (
    <Menu
      onOpenChange={(keys) => setOpenKeys(keys)}
      openKeys={openKeys}
      selectedKeys={selectedMenuKeys}
      onClick={handleItemChange}
      theme="light"
      mode="inline"
      items={getMenuItems(menuConfig)}
    />
  );
};

export default LayoutMenu;
