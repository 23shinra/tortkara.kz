export type Category = {
  slug: string;
  title: string;
  short: string;
  description: string;
  image: string;
  imageAlt: string;
};

export const categories: Category[] = [
  {
    slug: "ekskavatory",
    title: "Экскаваторы",
    short: "Гусеничные и колёсные",
    description:
      "Финансируем гусеничные, колёсные и мини-экскаваторы для строительства, карьеров и коммунальных работ. Подбор техники под задачу объекта — с расчётом лизингового платежа.",
    image:
      "https://images.unsplash.com/photo-1581094794329-cbeca4f9bf0d?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Экскаватор на строительной площадке",
  },
  {
    slug: "frontalnye-pogruzchiki",
    title: "Фронтальные погрузчики",
    short: "Погрузка и перемещение",
    description:
      "Фронтальные погрузчики для складов инертных материалов, карьеров и логистики на объекте. Лизинг с понятным графиком платежей и сопровождением сделки.",
    image:
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Фронтальный погрузчик",
  },
  {
    slug: "ekskavatory-pogruzchiki",
    title: "Экскаваторы-погрузчики",
    short: "Универсальная техника",
    description:
      "Универсальные экскаваторы-погрузчики для подрядчиков, которым нужна одна машина вместо парка. Оформляем лизинг на новую и проверенную технику.",
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Экскаватор-погрузчик",
  },
  {
    slug: "teleskopicheskie-pogruzchiki",
    title: "Телескопические погрузчики",
    short: "Высота и точность",
    description:
      "Телескопические погрузчики для складов, сельхозпредприятий и монтажа. Лизинг с индивидуальным графиком под сезонность бизнеса.",
    image:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Телескопический погрузчик",
  },
  {
    slug: "tyagachi",
    title: "Тягачи",
    short: "Магистральные перевозки",
    description:
      "Седельные тягачи для логистики и строительных перевозок. Финансирование парка с прозрачными условиями и полным пакетом документов.",
    image:
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Седельный тягач",
  },
  {
    slug: "samosvaly",
    title: "Самосвалы",
    short: "Перевозка сыпучих",
    description:
      "Самосвалы для карьеров, дорожного строительства и инертных материалов. Лизинг с авансом от рыночных ориентиров — итоговый расчёт индивидуально.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Самосвал на объекте",
  },
  {
    slug: "burovye-ustanovki",
    title: "Буровые установки",
    short: "Скважины и фундаменты",
    description:
      "Роторно-буровые установки и оборудование ГНБ для фундаментных и инфраструктурных проектов. Сопровождаем сделку от заявки до передачи техники.",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Буровое оборудование на площадке",
  },
  {
    slug: "miksery",
    title: "Миксеры",
    short: "Бетон на объект",
    description:
      "Автобетоносмесители для производителей бетона и подрядчиков. Лизинг под объёмы поставок и график строек.",
    image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Автобетоносмеситель",
  },
  {
    slug: "drobilnoe-oborudovanie",
    title: "Дробильное оборудование",
    short: "Дробление и сортировка",
    description:
      "Дробильные и сортировочные комплексы для карьеров и переработки. Структурируем лизинг под капиталоёмкое оборудование.",
    image:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Промышленное оборудование",
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}
