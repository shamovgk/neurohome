# NeuroHome

IoT система автоматизации ухода за растениями на базе ESP32, Node.js Backend и React Native мобильного приложения.

## 🚀 Быстрый старт

### Требования
- Docker Desktop
- Node.js 20+
- npm 9+
- Git

### Установка

1. Клонируйте репозиторий:
```
    git clone https://github.com/ваш-username/neurohome.git
    cd neurohome
```
2. Установите зависимости:
```
    npm install
```
3. Создайте .env файлы:
```
    cp .env.example .env
    cp packages/backend/.env.example packages/backend/.env
    cp packages/mobile/.env.example packages/mobile/.env
```
4. Запустите все сервисы:
```
    npm run dev
```
5. В другом терминале запустите React Native:
```
    npm run mobile
```
## 📁 Структура проекта

```
neurohome/
├── packages/
│ ├── mobile/ # React Native приложение
│ ├── backend/ # Node.js Backend API
│ └── esp32-firmware/ # Прошивка ESP32
├── docker/ # Docker конфигурация
├── shared/ # Общие типы TypeScript
└── docs/ # Документация
```

## 🛠️ Команды разработки
```
npm run dev # Запустить Backend + БД через Docker
npm run stop # Остановить сервисы
npm run logs # Просмотр логов
npm run clean # Очистить volumes
npm run mobile # Запустить React Native
```

## 📚 Документация

- [Архитектура](docs/ARCHITECTURE.md)
- [API документация](docs/API.md)
- [Разработка](docs/DEVELOPMENT.md)

