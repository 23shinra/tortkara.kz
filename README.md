# Tortkara Machinery

Маркетинговый сайт лизинга роторно-буровой техники и сваебойных установок для **ТОО «Tortkara Machinery»** (Алматы).

## Запуск

Нужны Node.js 20+ и npm.

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

## Страницы

| Путь | Содержание |
|------|------------|
| `/` | Главная: hero, категории, процесс, преимущества |
| `/catalog` | Категории техники |
| `/catalog/[slug]` | Страница категории + CTA на заявку |
| `/terms` | Условия лизинга (ориентиры рынка) |
| `/apply` | Форма заявки (mailto / WhatsApp) |
| `/contacts` | Адрес, телефон, реквизиты |

Реквизиты и телефон заданы в [`lib/company.ts`](lib/company.ts).

## Стек

Next.js (App Router), TypeScript, Tailwind CSS v4, Phosphor Icons.

## Логотип

Сейчас в шапке текстовый wordmark **TORTKARA**. Когда будет нормальный файл логотипа — замените wordmark в `components/Header.tsx` и `components/Footer.tsx`.
