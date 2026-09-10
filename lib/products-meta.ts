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

export type ProductSection = "drilling-rigs" | "drilling-equipment";
export type RigConditionGroup = "new" | "used";
export type EquipmentCategory =
  | "kelly-bars"
  | "casing-oscillators"
  | "casing-system"
  | "drilling-tools"
  | "foundation-tools"
  | "cfa-dds";

export type ProductLocale = "ru" | "kk" | "en" | "cn";

export type ProductSpecTable = {
  title: string;
  columns: string[];
  rows: string[][];
  note?: string;
};

export type ProductContent = {
  title?: string;
  description: string;
  longDescription?: string;
  benefits?: string[];
  variants?: string[];
  details?: { title: string; text: string }[];
  specTables?: ProductSpecTable[];
};

export type Product = {
  slug: string;
  title: string;
  brand: string;
  model: string;
  images: string[];
  specs: ProductSpecs;
  category: string;
  section: ProductSection;
  conditionGroup?: RigConditionGroup;
  equipmentCategory?: EquipmentCategory;
  content?: Partial<Record<ProductLocale, ProductContent>>;
  attributes?: Record<string, string>;
  createdAt?: string;
  /** Bumped when photos/preview change — used to bust image caches. */
  updatedAt?: string;
  /** Transparent cutout used only on catalog/home cards; gallery keeps `images`. */
  catalogPreview?: string;
};

export const PRODUCT_SECTIONS: ProductSection[] = ["drilling-rigs", "drilling-equipment"];
export const RIG_CONDITION_GROUPS: RigConditionGroup[] = ["new", "used"];
export const EQUIPMENT_CATEGORIES: EquipmentCategory[] = [
  "kelly-bars",
  "casing-oscillators",
  "casing-system",
  "drilling-tools",
  "foundation-tools",
  "cfa-dds",
];

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

export const SPEC_KEYS = Object.keys(specLabels) as (keyof ProductSpecs)[];
