export type Review = {
  id: string;
  image: string;
  orientation: "portrait" | "landscape";
  equipment: string;
  quote: string;
  role: string;
  alt: string;
};

export const reviews: Review[] = [
  {
    id: "ycr405e",
    image: "/reviews/ycr405e.png",
    orientation: "portrait",
    equipment: "YCR405E",
    quote:
      "Роторная установка передана на объект без задержек. Команда Tortkara сопровождала сделку от заявки до выгрузки.",
    role: "Подрядчик, Алматы",
    alt: "Клиенты у роторной буровой установки YCR405E",
  },
  {
    id: "sr185-trailer",
    image: "/reviews/sr185-trailer.png",
    orientation: "landscape",
    equipment: "SR185",
    quote:
      "Техника пришла на трале в срок. Всё официально, условия лизинга согласовали быстро.",
    role: "Строительная компания",
    alt: "Клиенты с буровой установкой SR185 на трале",
  },
  {
    id: "delivery-yard",
    image: "/reviews/delivery-yard.png",
    orientation: "portrait",
    equipment: "Буровой комплекс",
    quote:
      "Взяли технику в лизинг — вышли на площадку сразу после оформления. Рекомендуем.",
    role: "Клиент Tortkara",
    alt: "Команда на площадке у спецтехники",
  },
  {
    id: "xr218e",
    image: "/reviews/xr218e.png",
    orientation: "portrait",
    equipment: "XR218E",
    quote:
      "Установка XR218E на объекте. Tortkara помогли с финансированием и доставкой — работаем.",
    role: "Фундаментные работы",
    alt: "Клиенты у буровой установки XR218E",
  },
  {
    id: "sany-sr185",
    image: "/reviews/sany-sr185.png",
    orientation: "landscape",
    equipment: "SANY SR185",
    quote:
      "Получили SANY SR185 — техника как договаривались. Спасибо за оперативность.",
    role: "Клиент, Казахстан",
    alt: "Довольные клиенты с роторной установкой SANY SR185",
  },
  {
    id: "thumbs-up",
    image: "/reviews/thumbs-up.png",
    orientation: "landscape",
    equipment: "Передача техники",
    quote:
      "Сделка прошла спокойно: документы, техника, поддержка. Будем обращаться снова.",
    role: "Партнёр по лизингу",
    alt: "Клиенты после передачи спецтехники",
  },
];
