### Тестовое задание от компании MEDODS

## Руководство по запуску:

заполнить поля в файле .env

### В терминале:
установить необходимые зависимости:
``commandline
npm i
```
запустить проект командой 
``commandline
npm start
```

## API:
Регистрация пользователя: [/register]

POST-запрос:
```json
{
    "username": "",
    "password":""
}
```

Получение токенов: [/get_token]

POST-запрос:
```json
{
    "user_id": ""
}
```

Обновление access_token: [/refresh]
POST-запрос:
```json
{
    "user_id": "",
    "accessToken": "",
    "refreshToken": ""
}
```


