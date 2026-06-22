# JANJUREK

Мемориальный сайт для хранения семейных историй и родовых связей. Построен на Next.js с TypeScript и Tailwind CSS.

## Запуск

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production-сборка
npm run lint     # проверка кода
```

## Структура

- `src/app/page.tsx` — главная страница с поиском, древо, разделы «О нас», «Инструкция», «Контакты»
- `src/app/memory/[slug]` — страница памяти человека
- `src/app/memory/example-moon` — демонстрационный мемориал
- `src/app/admin` — панель для добавления записей
- `data/people.ts` — типы и данные людей
- `src/components` — компоненты интерфейса

## Firebase

Для подключения Firebase создайте `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Без Firebase приложение работает на локальных данных.
