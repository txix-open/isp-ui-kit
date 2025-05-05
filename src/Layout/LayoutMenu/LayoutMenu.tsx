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

  const menuKey = useMemo(() => {
    const segments = currentPath.replace(/^\/+/, '').split('/');
    return segments[0];
  }, [currentPath]);

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
    return menuConfigs.map((item) => {
      const isHidden = onHideMenuItem(item.permissions);
      const itemClassName = [item.className, isHidden ? 'hide-item' : '']
        .filter(Boolean)
        .join(' ');

      return {
        label: item.label,
        key: item.key,
        icon: item.icon,
        className: itemClassName,
        children: item.children?.length
          ? getMenuItems(item.children)
          : undefined,
      };
    });
  };

  return (
    <Menu
      className="layout-menu"
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
