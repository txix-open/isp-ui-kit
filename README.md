## Команды

- `npm install` — установка зависимостей
- `npm build` — сборка пакета
- `npm storybook` — запуск storybook
- `npm build-storybook` — сборка storybook

## Обновление версии

Для обновления версии необходимо:

1. Поднять версию в `package.json`.
2. Прописать изменения в `CHANGELOG.md`.
3. Пакет автоматически добавится в npm после сборки на сервере.

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

## Установка пакета в другие проекты

Для установки пакета выполните:

```bash
npm install isp-ui-kit
```

Дополнительные библиотеки, необходимые для работы библиотеки, исходя из peerDependencies:

```bash
npm install @monaco-editor/react monaco-editor antd react react-dom react-hook-form
```

```
   "@monaco-editor/react": "^4.6.0",
    "antd": ">=5.12",
    "monaco-editor": "^0.52.0",
    "react": ">=18",
    "react-dom": ">=18",
    "react-hook-form": "^7.54.0"
```

## Возможные проблемы

### 1. Не подгружаются стили

Для поддержки смены светлой/темной темы используются **CSS переменные**. Чтобы они работали в проекте, необходимо
добавить `antd-конфиг` и ОБЯЗАТЕЛЬНО обернуть в Layout от antd:

```js
<ConfigProvider theme={{ cssVar: true }} locale={ruRu}>
  <App />
</ConfigProvider>
```

### 2. Ошибка импорта Vite

Ошибка:

```
TypeError: Super expression must either be null or a function
```

Чтобы исправить, добавьте плагин для Vite:

```bash
npm install vite-plugin-node-polyfills
```
