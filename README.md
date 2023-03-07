## Команды
`yarn install` - установка зависимостей

`yarn build` - Собрать пакет

`yarn storybook` -  Запустить storybook


`yarn build-storybook` - Собрать storybook

`yarn pub` - сборка проекта, фиксирование версии, публикация пакета

## Публикация пакета

1. Поднять версию пакета в package.json
2. Описать изменения в changelog
3. Войти в учетную запись приватного репозитория с помощью команды (Использовать свой логин и пароль от gitlab)
`npm login --registry=https://nexus.txix.ru/repository/msp-npm/`
4. Выполнить команду `yarn pub` 

## Установка пакета в другие проекты

для установки проекта необходимо использовать приватный репозиторий 

`yarn add isp-ui-kit --registry=https://nexus.txix.ru/repository/msp-npm/`
