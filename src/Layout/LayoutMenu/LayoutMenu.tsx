import { useEffect, useMemo, useState } from 'react';
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
  const [selectedMenuKeys, setSelectedMenuKeys] = useState<string[]>([]);

  const menuKey = useMemo(() => currentPath.split('/')[1], [currentPath]);
  const routeWithParents = useMemo(
    () => findRouteWithParents(menuKey, menuConfig),
    [menuKey, menuConfig],
  );

  useEffect(() => {
    if (routeWithParents?.route) {
      setSelectedMenuKeys([routeWithParents.route.key]);
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
      defaultOpenKeys={routeWithParents?.parentKeys || []}
      selectedKeys={selectedMenuKeys}
      onClick={handleItemChange}
      theme="light"
      mode="inline"
      items={getMenuItems(menuConfig)}
    />
  );
};

export default LayoutMenu;
