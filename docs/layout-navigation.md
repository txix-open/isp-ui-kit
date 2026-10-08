# LayoutMenu: маршруты, ключи и переходы

LayoutMenu отображает меню и сообщает выбранный `key`. URL меняет приложение. `route` помогает определить активный пункт, но не выполняет переход.

## Как работает сопоставление

Из `currentPath` удаляются начальные `/`, затем берётся **первый сегмент** до `/`. Компонент ищет его в дереве: совпадение с `key` либо с одним из значений `route`. Поиск идёт в порядке конфигурации. Поэтому ключи должны быть уникальными во всём дереве, а одинаковые алиасы не стоит назначать разным пунктам.

- `key: 'modules'`, `currentPath: '/modules'` — выбран modules.
- `key: 'modules'`, `currentPath: '/modules/42/settings'` — также выбран modules.
- `key: 'moduleSection'`, `route: 'modules'`, `currentPath: '/modules/42'` — выбран moduleSection.
- `route: ['modules', 'module-details']` — один пункт для обоих первых сегментов.
- `route: '/modules'` или `route: '/modules/42'` — не совпадёт с первым сегментом `modules`. Значения route здесь задаются **без начального слеша**, как алиасы раздела.
- Группа с `key: 'admin'` и дочерний пункт с `key: 'users'`: путь `/admin/users` сопоставится с admin, а не users. Вложенность меню сама по себе не задаёт вложенность URL.

Передавайте pathname, например `location.pathname`, без query и hash. Строка `/modules?tab=details` даст сегмент `modules?tab=details`, а не modules. '/' даёт пустой сегмент: для главной страницы явно назначьте подходящий menuPath или алиас `route: ['']`.

## 1. Key совпадает с разделом URL

Полный пример с локальным состоянием, без зависимости от router. Клик меняет путь и выбранный пункт. В приложении замените setPath на переход своего router и получайте path из его location.

```tsx
import { useState } from 'react';
import { LayoutMenu } from 'isp-ui-kit';
import type { ConfigMenuItemType } from 'isp-ui-kit';

const menuConfig: ConfigMenuItemType[] = [
  { key: 'modules', label: 'Модули', permissions: [] },
  {
    key: 'access',
    label: 'Доступ',
    permissions: [],
    children: [
      { key: 'users', label: 'Пользователи', permissions: [] },
      { key: 'roles', label: 'Роли', permissions: [] },
    ],
  },
];

export function SimpleMenu() {
  const [path, setPath] = useState('/users');
  return (
    <LayoutMenu
      menuConfig={menuConfig}
      currentPath={path}
      onHideMenuItem={() => false}
      onClickItem={({ key }) => setPath(`/${key}`)}
    />
  );
}
```

При первом отображении /users выберет дочерний пункт и раскроет группу access. Группа — организационный раздел меню, не обязательный префикс URL.

## 2. Key отличается от URL, несколько route-алиасов

Key — постоянный идентификатор пункта; route — имена первых сегментов. Направление перехода задайте отдельно. Не используйте `navigate('/' + key)`, если key не совпадает с адресом страницы.

```tsx
import { LayoutMenu } from 'isp-ui-kit';
import type { ConfigMenuItemType } from 'isp-ui-kit';

const menuConfig: ConfigMenuItemType[] = [
  {
    key: 'moduleSection',
    label: 'Модули',
    route: ['modules', 'module-details'],
    permissions: [],
  },
  {
    key: 'peopleSection',
    label: 'Пользователи',
    route: 'users',
    permissions: [],
  },
];
const destinationByKey: Record<string, string> = {
  moduleSection: '/modules',
  peopleSection: '/users',
};

export function AliasMenu({ pathname, navigate }: {
  pathname: string;
  navigate: (path: string) => void;
}) {
  return (
    <LayoutMenu
      menuConfig={menuConfig}
      currentPath={pathname}
      onHideMenuItem={() => false}
      onClickItem={({ key }) => {
        const destination = destinationByKey[key];
        if (destination) navigate(destination);
      }}
    />
  );
}
```

Для /module-details/42 выбран moduleSection, а клик по нему переводит на /modules. Для /users/42 выбран peopleSection. Обновлённый pathname должен прийти обратно из router: одного вызова onClickItem недостаточно для обновления selectedKeys.

## 3. Вложенные URL: адаптер в приложении

Если адреса выглядят как /admin/users/42 и /admin/roles, отделите URL от пути для выбора пункта. Следующий компонент не требует менять LayoutMenu: приложение явно сопоставляет адрес с логическим разделом меню. Проверка границы сегмента не путает /admin/users и /admin/users-archive.

```tsx
import { LayoutMenu } from 'isp-ui-kit';
import type { ConfigMenuItemType } from 'isp-ui-kit';

const menuConfig: ConfigMenuItemType[] = [
  { key: 'modules', label: 'Модули', permissions: [] },
  {
    key: 'access', label: 'Доступ', permissions: [],
    children: [
      { key: 'users', label: 'Пользователи', permissions: [] },
      { key: 'roles', label: 'Роли', permissions: [] },
    ],
  },
];
const destinations: Record<string, string> = {
  modules: '/modules', users: '/admin/users', roles: '/admin/roles',
};
const belongsTo = (pathname: string, prefix: string) =>
  pathname === prefix || pathname.startsWith(`${prefix}/`);

export function AppNavigation({ pathname, navigate }: {
  pathname: string;
  navigate: (path: string) => void;
}) {
  const selectedKey = Object.keys(destinations).find((key) =>
    belongsTo(pathname, destinations[key]),
  );
  const menuPath = selectedKey ? `/${selectedKey}` : '/__no_menu_match__';

  return (
    <LayoutMenu
      key={menuPath}
      menuConfig={menuConfig}
      currentPath={menuPath}
      onHideMenuItem={() => false}
      onClickItem={({ key }) => {
        const destination = destinations[key];
        if (destination) navigate(destination);
      }}
    />
  );
}
```

Здесь React `key={menuPath}` намеренно пересоздаёт меню при смене раздела. Это повторно применяет defaultOpenKeys, раскрывает родительскую группу после внешнего перехода и очищает выбор на неизвестном маршруте. Ручное состояние раскрытия при смене раздела сбрасывается; при переходе между /admin/users/42 и /admin/users/43 menuPath остаётся тем же и сброса нет. React key компонента и key пунктов menuConfig — разные вещи.

Без такого адаптера компонент сохраняет прежнее поведение: открытые группы инициализируются при монтировании, неизвестный маршрут не очищает предыдущий selectedKeys. В текущем этапе эта логика не менялась. Если нужна устойчивая ручная настройка открытых групп между разделами, не используйте remount; согласуйте отдельное расширение API openKeys.

## Подключение к React Router

Router — зависимость приложения, она не добавляется в UI-кит. Для React Router 7 используйте AppNavigation из предыдущего примера внутри уже настроенного BrowserRouter или RouterProvider:

```tsx
import { useLocation, useNavigate } from 'react-router';
import { AppNavigation } from './AppNavigation';

export function RoutedMenu() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return (
    <AppNavigation pathname={pathname} navigate={(path) => { void navigate(path); }} />
  );
}
```

Для приложения на React Router 6 импортируйте эти hooks из установленного react-router-dom. useLocation обеспечивает обновление pathname, в том числе при Back/Forward; useNavigate выполняет переход. Страницы и маршруты приложения должны быть настроены отдельно. См. [useLocation](https://reactrouter.com/api/hooks/useLocation) и [useNavigate](https://reactrouter.com/api/hooks/useNavigate).

## Практические правила

- Конфигурацию объявляйте вне render, если она не зависит от данных. При динамических правах проверьте, что текущий раздел остаётся доступным.
- Каждый пункт, включая группу, получает permissions. onHideMenuItem принимает строку или массив и возвращает true для скрытия; это оформление меню, а проверку доступа к странице выполняет приложение.
- Группы с children открывают подменю; таблица destinationByKey обычно содержит только страницы, на которые можно перейти.
- Не назначайте один первый сегмент route нескольким пунктам: приоритет получит первое совпадение, включая родительскую группу.
- Меняйте currentPath вслед за router, а не только при клике: переходы из страницы и кнопки браузера тоже должны обновлять выделение.
- Для LayoutSider используйте то же меню внутри панели; соответствие key/route не меняется при сворачивании. Тему dark передавайте обоим компонентам.
