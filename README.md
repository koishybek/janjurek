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

- `src/app/page.tsx` — главная: поиск, древо, мемориалы, разделы «О проекте», «Как это работает», «Стоимость», «Контакты»
- `src/app/memory/[slug]` — страница памяти человека
- `src/app/create` — форма заявки (уходит в WhatsApp)
- `src/app/admin` — панель подготовки записи (генерирует JSON, публикацию не выполняет)
- `data/people.ts` — типы, люди и рёбра родства (`relations`)
- `src/lib/family-tree-model.ts` — родство: индекс связей, поиск предка, построение древа
- `src/components` — компоненты интерфейса

Родство задаётся **только** рёбрами `relations` по `id`. Текстовые поля «Отец», «Жена/Муж», «Дети»
в анкете — подписи для отображения: семьи пишут имена в разном порядке, и по строкам связывать нельзя.

## Тесты

```bash
npm test         # vitest: модель родства и построение древа
```

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
