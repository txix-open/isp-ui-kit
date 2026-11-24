# isp-ui-kit

React UI-кит на базе Ant Design для административных и внутренних интерфейсов. Включает каркас приложения и навигацию, поля и формы, таблицы, просмотр и редактирование JSON.

Для обновления с 2.x используйте [руководство по переходу на 3.0.0](docs/migration.md). Изменения по версиям перечислены в [CHANGELOG.md](CHANGELOG.md).

## Установка и подключение

```bash
npm install isp-ui-kit
```

```tsx
import { FormCodeEditor, ReactJsonView, SearchInput } from 'isp-ui-kit';
```

Поддерживаемые версии зависимостей приложения:

| Зависимость            | Версия    |
| ---------------------- | --------- |
| React и React DOM      | `>=18`    |
| Ant Design             | `>=6`     |
| React Hook Form        | `^7.67.0` |
| `@monaco-editor/react` | `^4.7.0`  |
| `monaco-editor`        | `^0.55.1` |

Именованные ESM-импорты позволяют сборщику исключать неиспользуемый код. `FormCodeEditor` загружает Monaco отдельно. Чтобы выбрать языки и воркеры в приложении, используйте `FormCodeEditorWithLoader`. [Настройка Monaco](docs/code-editor.md)

## Команды

- `npm install` — установка зависимостей
- `npm run build` — сборка пакета
- `npm run check:package` — проверка npm-архива после сборки
- `npm run storybook` — запуск storybook
- `npm run build-storybook` — сборка storybook

## Обновление версии

Для обновления версии необходимо:

1. Синхронно поднять версию в `package.json` и `package-lock.json`.
2. Прописать изменения в `CHANGELOG.md`.
3. Выполнить проверки и после согласования отправить релизный тег `vX.Y.Z`. Публикацию выполняет `.github/workflows/main.yml` по push тега; обычный push ветки пакет не публикует.

### Автоматическое обновление проектов

В репозитории представлен скрипт `update-isp-ui-kit.sh` для автоматического обновления версии пакета во всех проектах.

#### Использование

```bash
# Обновить до текущей версии
./update-isp-ui-kit.sh

# С обновлением patch версии проекта
./update-isp-ui-kit.sh --project-patch

# С обновлением minor версии проекта
./update-isp-ui-kit.sh --project-minor

# С обновлением major версии проекта
./update-isp-ui-kit.sh --project-major
```

#### Настройка

Перед первым запуском необходимо настроить конфигурацию:

1. Создайте файл `.env` на основе примера:

#### Пример `.env`

```bash
# Directory where projects are located
PROJECTS_DIR=/projects-path

# List of projects to update (comma-separated)
PROJECTS=project1,project2,project3
```

2. Отредактируйте `.env`, указав:
   - `PROJECTS_DIR` — путь к директории с проектами
   - `PROJECTS` — список проектов через запятую

> **Важно:** Убедитесь, что скрипт имеет права на выполнение: `chmod +x update-isp-ui-kit.sh`

## Возможные проблемы

### 1. Не подгружаются стили

Для темы собственных поверхностей кита включите CSS-переменные Ant Design. Рабочая область должна наследовать переменные ConfigProvider; Layout не является обязательным условием:

```tsx
<ConfigProvider theme={{ cssVar: { key: 'application-theme' } }}>
  <div className="application-theme">
    <App />
  </div>
</ConfigProvider>
```

Высоту рабочих колонок задаёт родитель. Подробности и примеры — в [руководстве 3.0.0](docs/migration.md).

### 2. Старый workaround для JSON-просмотрщика

В 3.0.0 ReactJsonView использует новый движок, legacy-реализация и зависимости events/react-lifecycles-compat удалены. Для нового JSON-просмотрщика node-polyfills не требуются. Если vite-plugin-node-polyfills был добавлен только ради прежнего компонента, проверьте сборку приложения без него; другие зависимости приложения могут иметь собственные требования.

## Направление дизайна

Принципы редизайна UI-кита (кроме PcsKit), правила для будущих изменений и принятые решения по компонентам: [docs/design-system.md](docs/design-system.md).

Порядок работы по компонентам и критерии завершения: [docs/redesign-plan.md](docs/redesign-plan.md).

Что изменилось и как перейти без неожиданной смены поведения: [руководство по переходу](docs/migration.md). В меню Storybook статья находится в разделе «Переход на версию 3.0.0».

Готовые примеры подключения Monaco, workers, React Hook Form и сохранения: [FormCodeEditor в приложении](docs/code-editor.md). Примеры также доступны в документации FormCodeEditor в Storybook.

Связь URL с key/route, вложенные пункты и подключение router: [LayoutMenu в приложении](docs/layout-navigation.md).

Встраивание главной и служебных страниц под шапку: [HomePage, ErrorPage и NotFoundPage](docs/layout-pages.md).
