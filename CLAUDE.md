# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Описание проекта

Цифровой ППР — веб-приложение на Next.js для управления годовыми и месячными планами планово-предупредительных работ по обслуживанию устройств электроснабжения. Используется начальниками подразделений, инженерами тех. отдела и руководителями для планирования, отслеживания и отчётности по выполнению работ.

## Команды

```bash
# Разработка
npm run dev          # Запуск dev-сервера Next.js

# Сборка
npm run build        # Продакшн сборка
npm run start        # Запуск продакшн сервера

# Линтинг
npm run lint         # Запуск ESLint

# Unit-тесты (Jest)
npm run test:unit              # Все unit-тесты
npm run test:unit:watch        # Watch-режим
npm run test:unit:coverage     # С покрытием
npx jest path/to/file.test.ts  # Запуск одного файла

# E2E-тесты (Playwright)
npm run test:e2e     # Все e2e-тесты
npm run test:e2e:ui  # С UI

# База данных (Drizzle)
npm run db:generate  # Генерация миграций из схемы
npm run db:migrate   # Применение миграций
```

## Архитектура

### Feature-Sliced Design (FSD)

Кодовая база следует методологии FSD с нумерованными префиксами слоёв:

```
src/
├── 1shared/       # Общие утилиты, UI-компоненты, вспомогательные функции
├── 2entities/     # Бизнес-сущности (ppr, user, division, commonWork)
├── 3features/     # Пользовательские фичи (ppr/create, ppr/update и т.д.)
├── 4widgets/      # Составные UI-блоки (pprTable, layouts, reports)
├── 5pages/        # Компоненты страниц
└── app/           # Next.js App Router — страницы и API-роуты
```

### Кросс-импорты между сущностями

Сущности используют конвенцию `@x/` для явного указания зависимостей:
- `@/2entities/user/@x/ppr` — экспорт сущности user для ppr
- `@/2entities/division/@x/user` — экспорт сущности division для user

### Основные сущности

**PPR (Годовой план)** — `src/2entities/ppr/`
- Центральная сущность с годовыми/месячными планами, данными работ, работниками
- Статусы года: `created` → `review` → `approved`
- Статусы месяца: `none` → `draft` → `review` → `approved` → `closed`
- Разделы работ: техническое обслуживание, текущий ремонт, капитальный ремонт, организационные мероприятия и др.

**Схема БД** — Drizzle ORM с MySQL
- Файлы схем: `src/2entities/**/*.schema.ts`
- Основные таблицы: `pprs_info`, `pprs_data` (позиции работ), `ppr_working_mans`, `ppr_months_statuses`

### Алиасы путей

`@/*` соответствует `./src/*`

## Технологии

- Next.js 14 (App Router с Server Actions)
- React 18, TypeScript
- Ant Design (antd) для UI-компонентов
- Drizzle ORM с MySQL
- NextAuth для аутентификации
- Jest + Testing Library (unit), Playwright (e2e)
- Tailwind CSS + SCSS-модули

## Переменные окружения

Конфигурация БД через `.env.local`: `DB_HOST`, `DB_NAME`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`

## Ключевые паттерны

- Server Actions для мутаций данных (`"use server"` в файлах actions)
- Context-провайдеры для состояния ППР (`PprProvider`, `PprTableSettingsProvider`)
- Экспорт в Excel через exceljs (`src/3features/ppr/convertToXlsx/`)
