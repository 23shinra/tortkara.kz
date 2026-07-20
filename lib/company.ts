export const company = {
  legalName: "ТОО «Tortkara Machinery»",
  shortName: "Tortkara Machinery",
  brand: "TORTKARA",
  yearsOnMarket: 5,
  tagline: "Предоставляем наши услуги для вашего бизнеса",
  about:
    "ТОО «Tortkara Machinery» — 5 лет на рынке Казахстана. Предоставляем наши услуги для вашего бизнеса: лизинг спецтехники и буровых установок, подбор машин под задачу объекта и сопровождение сделки от заявки до передачи техники.",
  bin: "260240004775",
  bik: "KCJBKZKX",
  iik: "KZ798562203152545700",
  currency: "KZT",
  bank: "АО «Банк ЦентрКредит», г. Алматы",
  address: "РК, г. Алматы, ул. Есенова, д. 108",
  director: "Махсат Д. М.",
  phoneDisplay: "+7 771 126 12 11",
  phoneTel: "+77711261211",
  phoneRaw: "87711261211",
  email: "sales@tortkara.kz",
} as const;

export const phoneHref = `tel:${company.phoneTel}`;
export const whatsappHref = `https://wa.me/${company.phoneTel.replace("+", "")}`;

export function buildMailtoLead(body: string) {
  const subject = encodeURIComponent("Заявка на лизинг — Tortkara Machinery");
  return `mailto:${company.email}?subject=${subject}&body=${encodeURIComponent(body)}`;
}

export function buildWhatsAppLead(text: string) {
  return `${whatsappHref}?text=${encodeURIComponent(text)}`;
}
