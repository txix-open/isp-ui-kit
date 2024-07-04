## Команды

`npm install --legacy-peer-deps` - установка зависимостей

`npm build` - Собрать пакет

`npm storybook` - Запустить storybook

`npm build-storybook` - Собрать storybook

`npm pub` - сборка проекта, фиксирование версии, публикация пакета

## Обновление версии

Обязательно перед пушем новой версии. собрать команду через `npm build`

## Установка пакета в другие проекты

Для установки пакета необходимо установить его через ссылку github

### Возможные проблемы

#### Не подгружаются стили

Для поддержки смены светлой/темной темы используются `css переменные`

Для включения их в проекте, необходимо добавить `antd-конфиг`

```js
 <ConfigProvider theme={{cssVar: true}} locale={ruRu}>
    <App/>
</ConfigProvider>
```

#### Ошибка импорта vite

```
TypeError: Super expression must either be null or a function
```

Добавить плагин для vite

```
vite-plugin-node-polyfills
```

