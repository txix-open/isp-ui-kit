import { useEffect, useMemo, useRef, useState } from 'react';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';

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
  theme = 'light',
  inlineCollapsed,
}: LayoutMenuPropsType) => {
  const menuKey = useMemo(() => {
    const segments = currentPath.replace(/^\/+/, '').split('/');
    return segments[0];
  }, [currentPath]);

  const routeWithParents = useMemo(
    () => findRouteWithParents(menuKey, menuConfig),
    [menuKey, menuConfig],
  );

  const selectedMenuKeys = routeWithParents ? [routeWithParents.route.key] : [];
  const popupClosedBySelection = useRef(false);
  const [openMenuKeys, setOpenMenuKeys] = useState<string[]>(() =>
    inlineCollapsed ? [] : (routeWithParents?.parentKeys ?? []),
  );

  useEffect(() => {
    setOpenMenuKeys(
      inlineCollapsed ? [] : (routeWithParents?.parentKeys ?? []),
    );
  }, [inlineCollapsed, routeWithParents]);

  const onMenuClick: MenuProps['onClick'] = (info) => {
    if (inlineCollapsed) {
      popupClosedBySelection.current = true;
      setOpenMenuKeys([]);
    }
    handleItemChange(info);
  };

  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
    if (inlineCollapsed && popupClosedBySelection.current && keys.length > 0) {
      return;
    }
    setOpenMenuKeys(keys);
  };

  const getMenuItems = (
    menuConfigs: ConfigMenuItemType[],
  ): MenuProps['items'] => {
    return menuConfigs.map((item): MenuItemType => {
      const isHidden = onHideMenuItem(item.permissions);
      const itemClassName = [item.className, isHidden ? 'hide-item' : '']
        .filter(Boolean)
        .join(' ');

      return {
        label: item.label,
        title: item.label,
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
      openKeys={openMenuKeys}
      onOpenChange={onOpenChange}
      onPointerEnter={(event) => {
        // Popup portals are outside the menu DOM; only a new entry into the menu reopens it.
        if (event.currentTarget.contains(event.target as Node)) {
          popupClosedBySelection.current = false;
        }
      }}
      onKeyDownCapture={() => {
        popupClosedBySelection.current = false;
      }}
      selectedKeys={selectedMenuKeys}
      onClick={onMenuClick}
      theme={theme}
      inlineCollapsed={inlineCollapsed}
      mode="inline"
      items={getMenuItems(menuConfig)}
    />
  );
};

export default LayoutMenu;
