import { ConfigMenuItemType } from '../Layout/LayoutMenu/layout-menu';

export const findRouteWithParents = (
  key: string,
  routers: ConfigMenuItemType[],
  parentKeys: string[] = [],
): { route: ConfigMenuItemType; parentKeys: string[] } | null => {
  for (const route of routers) {
    if (route.key === key) {
      return { route, parentKeys };
    }
    if (route && route.children && route.children.length > 0) {
      const routeWithParents = findRouteWithParents(key, route.children, [
        ...parentKeys,
        route.key,
      ]);
      if (routeWithParents) {
        const { route: childRoute, parentKeys: childParentKeys } =
          routeWithParents;
        if (childRoute) {
          return { route: childRoute, parentKeys: childParentKeys };
        }
      }
    }
  }
  return null;
};
