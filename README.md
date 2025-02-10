
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

Для поддержки смены светлой/темной темы используются **CSS переменные**. Чтобы они работали в проекте, необходимо добавить `antd-конфиг`:

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
