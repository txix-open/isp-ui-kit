# Главная и служебные страницы

HomePage, ErrorPage и NotFoundPage используют поверхность, цвета и шрифт активной темы ConfigProvider. Существующие children сохранены. Новые необязательные style и className позволяют встроить страницу в каркас приложения.

## Размеры и прокрутка

HomePage сохраняет высоту 100%; родитель должен задавать высоту. ErrorPage и NotFoundPage сохраняют самостоятельную высоту 100vh. Если они находятся под шапкой или внутри панели, передайте style={{ height: '100%' }}. Размер страницы тогда определяется областью родителя, а не окном браузера. При нехватке места прокрутка происходит внутри страницы; её начало и действия можно достигнуть даже в низком контейнере.

Центрирование NotFoundPage больше не использует absolute относительно окна. Максимальная ширина сообщения 560 px, заголовок 24 px. Длинный адрес переносится, кнопки и их расположение задаёт приложение.

## Встраивание под шапку

Полный пример без router и API. Обработчики передаются приложением. В ErrorPage children попадает в Result.extra; в NotFoundPage остаётся под сообщением. Компоненты сами не выполняют запрос, повторную загрузку или переход.

```tsx
import type { ReactNode } from 'react';
import { Button, Space } from 'antd';
import { ErrorPage, HomePage, NotFoundPage } from 'isp-ui-kit';

export function PageFrame({ status, onRetry, onHome, children }: {
  status: 'ready' | 'error' | 'not-found';
  onRetry: () => void;
  onHome: () => void;
  children: ReactNode;
}) {
  const pageStyle = { height: '100%' };
  return (
    <div style={{ height: 600, display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: 16, flex: 'none' }}>Управление сервисами</header>
      <main style={{ flex: 1, minHeight: 0, minWidth: 0 }}>
        {status === 'error' ? (
          <ErrorPage style={pageStyle}>
            <Space wrap>
              <Button type="primary" onClick={onRetry}>Попробовать снова</Button>
              <Button onClick={onHome}>На главную</Button>
            </Space>
          </ErrorPage>
        ) : status === 'not-found' ? (
          <NotFoundPage style={pageStyle}>
            <Button type="primary" onClick={onHome}>На главную</Button>
          </NotFoundPage>
        ) : (
          <HomePage style={pageStyle}>{children}</HomePage>
        )}
      </main>
    </div>
  );
}
```

Если повторная загрузка асинхронная, состояние loading и блокировку повторного нажатия задайте переданной кнопке. onHome подключите к router приложения; см. [маршруты и ключи меню](layout-navigation.md).

## HomePage и backgroundImage

backgroundImage по-прежнему принимает URL изображения. Фон центрируется, покрывает область (cover) и не повторяется. Доступность текста на конкретном изображении обеспечивает содержимое приложения. При необходимости прежнее повторение или другой масштаб задаётся через style:

```tsx
import { HomePage } from 'isp-ui-kit';

export function Welcome({ imageUrl }: { imageUrl: string }) {
  return (
    <HomePage
      backgroundImage={imageUrl}
      style={{ height: 480, backgroundSize: 'contain', backgroundRepeat: 'repeat' }}
      className="application-welcome"
    >
      <section>
        <h1>Добро пожаловать</h1>
        <p>Выберите раздел в меню.</p>
      </section>
    </HomePage>
  );
}
```

Без backgroundImage используется нейтральная поверхность темы. Шрифт children больше не масштабируется через vw/vh: по умолчанию это текст активной темы. Заголовки, крупный приветственный текст и карточки оформляет приложение. Несколько соседних children сохраняют flex-размещение; для вертикальной композиции используйте собственный контейнер.

## Что изменилось визуально

- HomePage: предсказуемая типографика, нейтральный фон и отступы, внутренний scroll, управляемое оформление фонового изображения.
- ErrorPage: стандартный значок ошибки вместо большой 500-иллюстрации; заголовок «Ошибка 500» и пояснение, действия остаются пользовательскими.
- NotFoundPage: компактный код 404, прежний текст «Такой страницы не существует», пояснение и центрирование в своей области.
- style имеет приоритет над базовыми стилями; className дополняет встроенные классы. Если CSS приложения обращался к старому h2 NotFoundPage, обновите селектор: заголовок страницы теперь h1.

## Где проверить

В Storybook раздел Layout/Pages показывает каждую страницу, длинные данные, узкую и низкую область, отсутствие действий и фон HomePage. Кнопки демонстрируют действия на локальном состоянии.

В «Редизайн/Приложение» страницы находятся под шапкой рядом с LayoutSider. Пример включает меню, таблицу, форму и три колонки. Поиск фильтрует локальные данные, форма показывает отправленные значения, кнопки в шапке открывают 500/404. Это проверка композиции без router и сетевых запросов. Тема и ширина примеров задаются панелью Storybook; адаптивный breakpoint Sider реагирует на ширину окна браузера.

PcsKit и ReactJsonView исключены из этих изменений.
