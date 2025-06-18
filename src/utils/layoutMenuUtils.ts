import { ConfigMenuItemType } from '../Layout/LayoutMenu/layout-menu';

export const findRouteWithParents = (
  key: string,
  routers: ConfigMenuItemType[],
  parentKeys: string[] = [],
): { route: ConfigMenuItemType; parentKeys: string[] } | null => {
  for (const route of routers) {
    const routePaths = Array.isArray(route.route)
      ? route.route
      : route.route
        ? [route.route]
        : [];

    if (route.key === key || routePaths.includes(key)) {
      return { route, parentKeys };
    }

    if (route.children?.length) {
      const childResult = findRouteWithParents(key, route.children, [
        ...parentKeys,
        route.key,
      ]);
      if (childResult) {
        return childResult;
      }
    }
  }

  return null;
};
