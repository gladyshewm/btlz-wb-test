# Тестовое задание

Cоздать сервис, выполняющий 2 задачи:
- регулярное получение информации о тарифах wb и сохранение их в БД на каждый день;
- регулярное обновление информации об актуальных тарифах в google-таблицах.

## Структура проекта

```
.
├── app.ts
├── Dockerfile
├── docker-compose.yaml
├── google_credentials.json*  
├── .env.example
├── README.md
└── src
    ├── config
    │   ├── env
    │   │   └── env.ts
    │   └── knex
    │       ├── knexfile.ts
    │       ├── migration.stub.js
    │       └── seed.stub.js
    ├── cron
    │   ├── constants.ts
    │   └── scheduler.ts
    ├── jobs
    │   ├── fetch-tariffs.job.ts
    │   ├── job.interface.ts
    │   └── sync-sheets.job.ts
    ├── postgres
    │   ├── knex.ts
    │   ├── migrations
    │   │   └── 20250623120507_create_spreadsheets_and_tariffs.js
    │   └── seeds
    │       └── spreadsheets.js
    ├── repositories
    │   ├── spreadsheet.repository.ts
    │   └── tariff.repository.ts
    ├── services
    │   ├── api.service.ts
    │   ├── google-auth.service.ts
    │   └── sheets-sync.service.ts
    ├── types
    │   ├── raw-warehouse-tariff.type.ts
    │   └── tariff.type.ts
    └── utils
        ├── error.ts
        ├── knex.ts
        └── parse-numeric.ts
```
\* `google_credentials.json` — ваш файл с ключами доступа к Google Sheets API.

## Требования

- Docker & Docker Compose
- Файл `google_credentials.json` в корне проекта (сервисный аккаунт Google, имеющий доступ к Sheets API).
- Файл `.env` с настройками (см. ниже).

## 1. Настройка

1. Скопируйте (или просто переименуйте в `.env`) `example.env` и заполните реальные значения:
```
cp example.env .env
```

2. Откройте `.env` и укажите:
```
NODE_ENV=development
API_KEY=ваш_ключ

POSTGRES_HOST=localhost
POSTGRES_PORT=5433
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

APP_PORT=5000
GOOGLE_APPLICATION_CREDENTIALS=./google_credentials.json (или своё название)
```

3. Обновите сиды Google Sheets

В файле `src/postgres/seeds/spreadsheets.js` указаны примеры `spreadsheet_id`.
Перед запуском замените их на свои ID тестовых Google-таблиц:
```js
await knex("spreadsheets")
  .insert([
    { spreadsheet_id: "ВАШ_SPREADSHEET_ID_1" },
    { spreadsheet_id: "ВАШ_SPREADSHEET_ID_2" },
  ])
  .onConflict(["spreadsheet_id"])
  .ignore();
```

4. Поместите файл `google_credentials.json` с сервисным аккаунтом Google в корень проекта

## 2. Сборка и запуск

В корне проекта выполните:
```
docker compose up --build
```
В контейнере `app` автоматически:
- `knex migrate:latest`
- `knex seed:run`
- Инициализация планировщика для FetchTariffsJob и SyncSheetsJob
