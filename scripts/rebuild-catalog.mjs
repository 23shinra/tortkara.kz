#!/usr/bin/env node
/**
 * Rebuild data/products.json: keep drilling rigs, enrich rig copy, merge equipment catalog.
 * Copy product image folders from legacy slug names to new per-product slugs.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildEquipmentProducts } from "./catalog-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PRODUCTS_PATH = path.join(ROOT, "data", "products.json");
const PUBLIC_PRODUCTS = path.join(ROOT, "public", "products");

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp"]);

/** Legacy public/products folder → new product slug (when names differ). */
export const IMAGE_SOURCE_MAP = {
  "kelly-bars-sany": "kelly-bars",
  "kelly-bars-casagrande": "kelly-bars",
  "kelly-bars-soilmec": "kelly-bars",
  "kelly-bars-mait": "kelly-bars",
  "kelly-bars-tescar": "kelly-bars",
  "boerr-co-1000": "boerr-casing-oscillator",
  "boerr-co-1180": "boerr-casing-oscillator",
  "boerr-co-1500": "boerr-casing-oscillator",
  "boerr-co-2000": "boerr-casing-oscillator",
  "leffer-vrm-1180": "leffer-casing-oscillator",
  "leffer-vrm-1300": "leffer-casing-oscillator",
  "leffer-vrm-1500": "leffer-casing-oscillator",
  "leffer-vrm-2000": "leffer-casing-oscillator",
  "casing-standard": "casing-pipes",
  "casing-reinforced": "casing-pipes",
  "knife-leading-section": "cutting-shoes",
  "casing-driver": "casing-drivers",
  "casing-support-frame": "casing-drivers",
  "auger-sb-k": "drilling-augers",
  "auger-sb-k2": "drilling-augers",
  "auger-sbf-k": "drilling-augers",
  "auger-sbf-k2": "drilling-augers",
  "auger-sbf-p": "drilling-augers",
  "auger-sbf-p2": "drilling-augers",
  "bucket-kbf-k": "drilling-buckets",
  "bucket-kbf-k2": "drilling-buckets",
  "bucket-kbf-p": "drilling-buckets",
  "bucket-kc-2zr": "drilling-buckets",
  "bucket-kb-k": "drilling-buckets",
  "bucket-kb-k2": "drilling-buckets",
  "core-kr-r": "core-barrels",
  "core-ks-r": "core-barrels",
  "core-kr-rm": "core-barrels",
  "core-kr-ws": "core-barrels",
  "pile-base-underreamer": "pile-base-underreamers",
  "cfa-transport-auger": "cfa-equipment",
  "cfa-leading-section": "cfa-equipment",
  "dds-displacement-tool": "cfa-equipment",
  "cardan-washer-flange": "casing-drivers",
};

const SPEC_LABELS = {
  ru: {
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
  },
  kk: {
    year: "Шығарылған жылы",
    condition: "Күйі",
    mast: "Мачта",
    depth: "Бұрғылау тереңдігі",
    diameter: "Бұрғылау диаметрі",
    engine: "Двигатель",
    power: "Қуаты",
    weight: "Массасы",
    transport: "Өлшемдері (тасымал)",
    kelly: "Келли-штанга",
  },
  en: {
    year: "Year",
    condition: "Condition",
    mast: "Mast",
    depth: "Drilling depth",
    diameter: "Drilling diameter",
    engine: "Engine",
    power: "Power",
    weight: "Weight",
    transport: "Transport dimensions",
    kelly: "Kelly bar",
  },
  cn: {
    year: "出厂年份",
    condition: "状态",
    mast: "钻桅",
    depth: "钻孔深度",
    diameter: "钻孔直径",
    engine: "发动机",
    power: "功率",
    weight: "重量",
    transport: "运输尺寸",
    kelly: "方钻杆",
  },
};

const SPEC_ORDER = [
  "year",
  "condition",
  "mast",
  "depth",
  "diameter",
  "engine",
  "power",
  "weight",
  "transport",
  "kelly",
];

function copyDirRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(from, to);
    } else {
      fs.copyFileSync(from, to);
    }
  }
}

function listProductImages(slug) {
  const dir = path.join(PUBLIC_PRODUCTS, slug);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .filter((name) => name !== "catalog-preview.png")
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((name) => `/products/${slug}/${name}`);
}

function copyProductImages(slug) {
  const sourceSlug = IMAGE_SOURCE_MAP[slug] ?? slug;
  const src = path.join(PUBLIC_PRODUCTS, sourceSlug);
  const dest = path.join(PUBLIC_PRODUCTS, slug);

  if (sourceSlug === slug && fs.existsSync(dest)) {
    return listProductImages(slug);
  }

  if (!fs.existsSync(src)) {
    console.warn(`  skip images: source folder missing public/products/${sourceSlug}`);
    return listProductImages(slug);
  }

  if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
  }
  copyDirRecursive(src, dest);
  return listProductImages(slug);
}

function specDetails(specs, locale) {
  const labels = SPEC_LABELS[locale];
  return SPEC_ORDER.filter((key) => specs[key])
    .map((key) => ({ title: labels[key], text: specs[key] }));
}

function joinSentences(parts) {
  return parts.filter(Boolean).join(" ");
}

function enrichRigContent(rig) {
  const { title, brand, model, specs = {} } = rig;
  const detailsRu = specDetails(specs, "ru");
  const detailsKk = specDetails(specs, "kk");
  const detailsEn = specDetails(specs, "en");
  const detailsCn = specDetails(specs, "cn");

  const ruParts = [
    `${title} — роторная буровая установка ${brand} для устройства буронабивных свай и инфраструктурных фундаментов.`,
    specs.year && `Год выпуска: ${specs.year}.`,
    specs.condition && `Состояние: ${specs.condition}.`,
    specs.depth && `Рабочая глубина бурения — ${specs.depth}.`,
    specs.diameter && `Диаметр бурения до ${specs.diameter}.`,
    specs.engine && `Силовая установка: ${specs.engine}${specs.power ? `, ${specs.power}` : ""}.`,
    specs.weight && `Эксплуатационная масса ${specs.weight}.`,
    specs.kelly && `Комплектация включает келли-штангу ${specs.kelly}.`,
    "Подберём конфигурацию, буровой инструмент и подготовим коммерческое предложение под задачу объекта.",
  ];

  const kkParts = [
    `${title} — ${brand} роторлы бұрғылау қондырғысы, бұрғыланған қада мен инфрақұрылым иргетастарын орнатуға арналған.`,
    specs.year && `Шығарылған жылы: ${specs.year}.`,
    specs.condition && `Күйі: ${specs.condition}.`,
    specs.depth && `Жұмыс тереңдігі — ${specs.depth}.`,
    specs.diameter && `Бұрғылау диаметрі ${specs.diameter} дейін.`,
    specs.engine && `Қуат агрегаты: ${specs.engine}${specs.power ? `, ${specs.power}` : ""}.`,
    specs.weight && `Пайдалану массасы ${specs.weight}.`,
    specs.kelly && `Комплектацияда ${specs.kelly} келли-штангасы.`,
    "Нысан міндетіне сай конфигурация мен коммерциялық ұсыныс дайындаймыз.",
  ];

  const enParts = [
    `${title} is a ${brand} rotary drilling rig for bored-pile foundations and infrastructure works.`,
    specs.year && `Year of manufacture: ${specs.year}.`,
    specs.condition && `Condition: ${specs.condition}.`,
    specs.depth && `Drilling depth: ${specs.depth}.`,
    specs.diameter && `Maximum drilling diameter ${specs.diameter}.`,
    specs.engine && `Power unit: ${specs.engine}${specs.power ? `, ${specs.power}` : ""}.`,
    specs.weight && `Operating weight ${specs.weight}.`,
    specs.kelly && `Kelly bar configuration: ${specs.kelly}.`,
    "We match the rig configuration and tooling to the site and prepare a commercial proposal.",
  ];

  const cnParts = [
    `${title} 为 ${brand} 旋挖钻机，适用于灌注桩基础与基建工程。`,
    specs.year && `出厂年份：${specs.year}。`,
    specs.condition && `状态：${specs.condition}。`,
    specs.depth && `钻孔深度：${specs.depth}。`,
    specs.diameter && `最大成孔直径 ${specs.diameter}。`,
    specs.engine && `动力配置：${specs.engine}${specs.power ? `，${specs.power}` : ""}。`,
    specs.weight && `整机重量 ${specs.weight}。`,
    specs.kelly && `方钻杆配置：${specs.kelly}。`,
    "我们按工地需求匹配钻机配置与钻具，并提供商务方案。",
  ];

  const benefitsRu = [
    specs.depth && `Глубина бурения до ${specs.depth}`,
    specs.diameter && `Диаметр бурения до ${specs.diameter}`,
    specs.engine && `Двигатель ${specs.engine}`,
    specs.power && `Мощность ${specs.power}`,
    specs.weight && `Масса ${specs.weight}`,
    specs.mast && `Мачта: ${specs.mast}`,
  ].filter(Boolean);

  const benefitsKk = benefitsRu.map((item, i) => {
    const map = [
      specs.depth && `Бұрғылау тереңдігі ${specs.depth} дейін`,
      specs.diameter && `Диаметр ${specs.diameter} дейін`,
      specs.engine && `${specs.engine} двигателі`,
      specs.power && `Қуаты ${specs.power}`,
      specs.weight && `Массасы ${specs.weight}`,
      specs.mast && `Мачта: ${specs.mast}`,
    ].filter(Boolean);
    return map[i] ?? item;
  });

  const benefitsEn = [
    specs.depth && `Drilling depth up to ${specs.depth}`,
    specs.diameter && `Drilling diameter up to ${specs.diameter}`,
    specs.engine && `${specs.engine} engine`,
    specs.power && `${specs.power} rated power`,
    specs.weight && `${specs.weight} operating weight`,
    specs.mast && `${specs.mast} mast`,
  ].filter(Boolean);

  const benefitsCn = [
    specs.depth && `钻孔深度 ${specs.depth}`,
    specs.diameter && `成孔直径 ${specs.diameter}`,
    specs.engine && `${specs.engine} 发动机`,
    specs.power && `功率 ${specs.power}`,
    specs.weight && `重量 ${specs.weight}`,
    specs.mast && `${specs.mast} 钻桅`,
  ].filter(Boolean);

  return {
    ru: {
      title,
      description: joinSentences(ruParts),
      longDescription: joinSentences([
        `${brand} ${model} применяется на объектах с различной геологией — от связных грунтов до скальных включений.`,
        specs.transport && `Транспортные габариты: ${specs.transport}.`,
      ]),
      benefits: benefitsRu.length ? benefitsRu : undefined,
      details: detailsRu.length ? detailsRu : undefined,
    },
    kk: {
      title,
      description: joinSentences(kkParts),
      longDescription: joinSentences([
        `${brand} ${model} әртүрлі геологиядағы нысандарда — тұтқыр топырақтан жартастық қоспаларға дейін қолданылады.`,
        specs.transport && `Тасымалдау өлшемдері: ${specs.transport}.`,
      ]),
      benefits: benefitsKk.length ? benefitsKk : undefined,
      details: detailsKk.length ? detailsKk : undefined,
    },
    en: {
      title,
      description: joinSentences(enParts),
      longDescription: joinSentences([
        `${brand} ${model} is used on sites with varied geology — from cohesive soils to rock inclusions.`,
        specs.transport && `Transport dimensions: ${specs.transport}.`,
      ]),
      benefits: benefitsEn.length ? benefitsEn : undefined,
      details: detailsEn.length ? detailsEn : undefined,
    },
    cn: {
      title,
      description: joinSentences(cnParts),
      longDescription: joinSentences([
        `${brand} ${model} 适用于多种地层，从黏性土到含岩层均可施工。`,
        specs.transport && `运输尺寸：${specs.transport}。`,
      ]),
      benefits: benefitsCn.length ? benefitsCn : undefined,
      details: detailsCn.length ? detailsCn : undefined,
    },
  };
}

function attachImages(product) {
  const images = copyProductImages(product.slug);
  if (images.length) {
    product.images = images;
    product.catalogPreview = `/products/${product.slug}/catalog-preview.png`;
  } else if (!product.images?.length) {
    product.images = [`/products/${product.slug}/01.png`];
    product.catalogPreview = `/products/${product.slug}/catalog-preview.png`;
  }
  return product;
}

function main() {
  const raw = JSON.parse(fs.readFileSync(PRODUCTS_PATH, "utf8"));
  const rigs = raw.filter((p) => p.section === "drilling-rigs");
  console.log(`Keeping ${rigs.length} drilling rigs`);

  const enrichedRigs = rigs.map((rig) => ({
    ...rig,
    content: enrichRigContent(rig),
    updatedAt: new Date().toISOString(),
  }));

  const equipment = buildEquipmentProducts();
  console.log(`Merging ${equipment.length} equipment products`);

  const merged = [...enrichedRigs, ...equipment.map(attachImages)];

  fs.writeFileSync(PRODUCTS_PATH, `${JSON.stringify(merged, null, 2)}\n`, "utf8");
  console.log(`Wrote ${merged.length} products to data/products.json`);
  console.log("Tip: run `python3 scripts/clean-product-images.py` to strip mc-bund banners and dedupe galleries.");
}

main();
