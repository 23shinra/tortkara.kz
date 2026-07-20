export type ProductSpecs = {
  year?: string;
  condition?: string;
  mast?: string;
  depth?: string;
  diameter?: string;
  engine?: string;
  power?: string;
  weight?: string;
  transport?: string;
  kelly?: string;
};

export type Product = {
  slug: string;
  title: string;
  brand: "XCMG" | "BAUER" | "SANY";
  model: string;
  images: string[];
  specs: ProductSpecs;
  category: "burovye-ustanovki";
};

export const products: Product[] = [
  {
    slug: "xcmg-xr160",
    title: "XCMG XR160",
    brand: "XCMG",
    model: "XR160",
    category: "burovye-ustanovki",
    images: [
      "/products/xcmg-xr160/01.jpg",
      "/products/xcmg-xr160/02.jpg",
      "/products/xcmg-xr160/03.jpg",
      "/products/xcmg-xr160/04.jpg",
      "/products/xcmg-xr160/05.jpg",
      "/products/xcmg-xr160/06.jpg",
      "/products/xcmg-xr160/07.jpg",
    ],
    specs: {
      year: "2020",
      condition: "Б/У, восстановленный",
      mast: "тросовой",
      depth: "44/56м",
      diameter: "1500мм",
      engine: "Cummins QSB7",
      power: "150 кВт",
      weight: "53т",
      transport: "13993х2960х3464мм",
      kelly: "377-4х12.5",
    },
  },
  {
    slug: "xcmg-xr200",
    title: "XCMG XR200",
    brand: "XCMG",
    model: "XR200",
    category: "burovye-ustanovki",
    images: [
      "/products/xcmg-xr200/01.jpg",
      "/products/xcmg-xr200/02.jpg",
      "/products/xcmg-xr200/03.jpg",
      "/products/xcmg-xr200/04.jpg",
      "/products/xcmg-xr200/05.jpg",
      "/products/xcmg-xr200/06.jpg",
      "/products/xcmg-xr200/07.jpg",
      "/products/xcmg-xr200/08.jpg",
      "/products/xcmg-xr200/09.jpg",
      "/products/xcmg-xr200/10.jpg",
      "/products/xcmg-xr200/11.jpg",
      "/products/xcmg-xr200/12.jpg",
    ],
    specs: {
      year: "2020",
      condition: "Б/У, не восстановленный",
      mast: "тросовой",
      depth: "65/52м",
      diameter: "1800мм",
      engine: "Isuzu 6HK1X",
      power: "212 кВт",
      weight: "70т",
      transport: "16576x3000x3731мм",
      kelly: "406-4х14.5",
    },
  },
  {
    slug: "xcmg-xr220",
    title: "XCMG XR220",
    brand: "XCMG",
    model: "XR220",
    category: "burovye-ustanovki",
    images: [
      "/products/xcmg-xr220/01.jpg",
      "/products/xcmg-xr220/02.jpg",
      "/products/xcmg-xr220/03.jpg",
      "/products/xcmg-xr220/04.jpg",
    ],
    specs: {
      year: "2019/2020",
      condition: "Б/У, восстановленный",
      mast: "тросовой",
      depth: "52/67м",
      diameter: "2000мм",
      engine: "Cummins QSL325",
      power: "242 кВт",
      weight: "70т",
      transport: "16360x3250x3535мм",
      kelly: "406-4х14.8",
    },
  },
  {
    slug: "xcmg-xr240",
    title: "XCMG XR240",
    brand: "XCMG",
    model: "XR240",
    category: "burovye-ustanovki",
    images: [
      "/products/xcmg-xr240/01.jpg",
      "/products/xcmg-xr240/02.jpg",
      "/products/xcmg-xr240/03.jpg",
      "/products/xcmg-xr240/04.jpg",
      "/products/xcmg-xr240/05.jpg",
      "/products/xcmg-xr240/06.jpg",
    ],
    specs: {
      year: "2021/2022",
      condition: "Б/У, восстановленный",
      mast: "тросовой",
      depth: "56/80м",
      diameter: "2000/2200мм",
      engine: "ISUZU 6UZ1X",
      power: "270 кВт",
      weight: "84т",
      transport: "17530x3250x3692мм",
      kelly: "440-4х15.5",
    },
  },
  {
    slug: "xcmg-xr280",
    title: "XCMG XR280",
    brand: "XCMG",
    model: "XR280",
    category: "burovye-ustanovki",
    images: [
      "/products/xcmg-xr280/01.jpg",
      "/products/xcmg-xr280/02.jpg",
      "/products/xcmg-xr280/03.jpg",
      "/products/xcmg-xr280/04.jpg",
      "/products/xcmg-xr280/05.jpg",
      "/products/xcmg-xr280/06.jpg",
    ],
    specs: {
      year: "2019/2020/2022",
      condition: "Б/У, восстановленный",
      mast: "тросовой",
      depth: "88м",
      diameter: "2200мм",
      engine: "CUMMINS QSM11",
      power: "298 кВт",
      weight: "96т",
      transport: "17410x3500x3815мм",
      kelly: "508-4х16",
    },
  },
  {
    slug: "xcmg-xr360",
    title: "XCMG XR360",
    brand: "XCMG",
    model: "XR360",
    category: "burovye-ustanovki",
    images: [
      "/products/xcmg-xr360/01.jpg",
      "/products/xcmg-xr360/02.jpg",
      "/products/xcmg-xr360/03.jpg",
      "/products/xcmg-xr360/04.jpg",
      "/products/xcmg-xr360/05.jpg",
      "/products/xcmg-xr360/06.jpg",
      "/products/xcmg-xr360/07.jpg",
    ],
    specs: {
      year: "2020/2021",
      condition: "Б/У, не восстановленный",
      mast: "тросовой",
      depth: "69/103м",
      diameter: "2600мм",
      engine: "CUMMINS QSM11",
      power: "298 кВт",
      weight: "96т",
      transport: "17410x3500x3815мм",
      kelly: "508-4х16",
    },
  },
  {
    slug: "xcmg-xr400",
    title: "XCMG XR400",
    brand: "XCMG",
    model: "XR400",
    category: "burovye-ustanovki",
    images: [
      "/products/xcmg-xr400/01.jpg",
      "/products/xcmg-xr400/02.jpg",
      "/products/xcmg-xr400/03.jpg",
      "/products/xcmg-xr400/04.jpg",
      "/products/xcmg-xr400/05.jpg",
      "/products/xcmg-xr400/06.jpg",
      "/products/xcmg-xr400/07.jpg",
      "/products/xcmg-xr400/08.jpg",
      "/products/xcmg-xr400/09.jpg",
      "/products/xcmg-xr400/10.jpg",
      "/products/xcmg-xr400/11.jpg",
      "/products/xcmg-xr400/12.jpg",
    ],
    specs: {
      year: "2020/2019",
      condition: "Б/У, восстановленный",
      mast: "тросовой",
      depth: "65/103м",
      diameter: "2500/2800мм",
      engine: "CUMMINS QSX15",
      power: "373 кВт",
      weight: "118т",
      transport: "20775x3500x3910мм",
      kelly: "530-4х17",
    },
  },
  {
    slug: "xcmg-xr1050",
    title: "XCMG XR1050",
    brand: "XCMG",
    model: "XR1050",
    category: "burovye-ustanovki",
    images: [],
    specs: {
      year: "2018",
      condition: "Б/У, восстановленный",
      mast: "тросовой",
      depth: "69/105м",
      diameter: "2500мм",
      engine: "CUMMINS QSM11",
      power: "298 кВт",
      weight: "120т",
      transport: "17615x3500x3535мм",
      kelly: "575-4х19",
    },
  },
  {
    slug: "bauer-bg26",
    title: "BAUER BG26",
    brand: "BAUER",
    model: "BG26",
    category: "burovye-ustanovki",
    images: [
      "/products/bauer-bg26/01.jpg",
      "/products/bauer-bg26/02.jpg",
      "/products/bauer-bg26/03.jpg",
      "/products/bauer-bg26/04.jpg",
      "/products/bauer-bg26/05.jpg",
      "/products/bauer-bg26/06.jpg",
      "/products/bauer-bg26/07.jpg",
      "/products/bauer-bg26/08.jpg",
      "/products/bauer-bg26/09.jpg",
      "/products/bauer-bg26/10.jpg",
      "/products/bauer-bg26/11.jpg",
    ],
    specs: {
      year: "2018",
      condition: "Б/У, не восстановленный",
      mast: "тросовой",
    },
  },
  {
    slug: "bauer-bg30",
    title: "BAUER BG30",
    brand: "BAUER",
    model: "BG30",
    category: "burovye-ustanovki",
    images: [
      "/products/bauer-bg30/01.jpg",
      "/products/bauer-bg30/02.jpg",
      "/products/bauer-bg30/03.jpg",
      "/products/bauer-bg30/04.jpg",
      "/products/bauer-bg30/05.jpg",
      "/products/bauer-bg30/06.jpg",
      "/products/bauer-bg30/07.jpg",
      "/products/bauer-bg30/08.jpg",
      "/products/bauer-bg30/09.jpg",
      "/products/bauer-bg30/10.jpg",
    ],
    specs: {
      year: "2017",
      condition: "Б/У, не восстановленный",
      mast: "тросовой",
    },
  },
  {
    slug: "bauer-bg36",
    title: "BAUER BG36",
    brand: "BAUER",
    model: "BG36",
    category: "burovye-ustanovki",
    images: [
      "/products/bauer-bg36/01.jpg",
    ],
    specs: {
      year: "2016",
      condition: "Б/У, восстановленный",
      mast: "тросовой",
    },
  },
  {
    slug: "bauer-bg25",
    title: "BAUER BG25",
    brand: "BAUER",
    model: "BG25",
    category: "burovye-ustanovki",
    images: [],
    specs: {
    },
  },
  {
    slug: "sany-sr285",
    title: "SANY SR285",
    brand: "SANY",
    model: "SR285",
    category: "burovye-ustanovki",
    images: [
      "/products/sany-sr285/01.jpg",
      "/products/sany-sr285/02.jpg",
      "/products/sany-sr285/03.jpg",
      "/products/sany-sr285/04.jpg",
      "/products/sany-sr285/05.jpg",
      "/products/sany-sr285/06.jpg",
    ],
    specs: {
      year: "2018/2020",
      condition: "Б/У, не восстановленный",
      mast: "тросовой",
      depth: "94/61м",
      diameter: "2200 мм",
      engine: "Isuzu",
      power: "300 кВт",
      weight: "105т",
      transport: "18695х3475х3625мм",
      kelly: "508-4х17",
    },
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function productsWithPhotos() {
  return products.filter((p) => p.images.length > 0);
}

export const specLabels: Record<keyof ProductSpecs, string> = {
  year: "Год выпуска",
  condition: "Состояние",
  mast: "Мачта",
  depth: "Глубина бурения",
  diameter: "Диаметр бурения",
  engine: "Двигатель",
  power: "Мощность",
  weight: "Масса",
  transport: "Габариты (транспорт)",
  kelly: "Келли-штанга",
};
