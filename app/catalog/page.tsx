import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Каталог техники",
  description:
    "Буровые установки XCMG, BAUER и SANY в наличии — лизинг от Tortkara Machinery. Алматы.",
};

const brands = ["XCMG", "BAUER", "SANY"] as const;

export default function KatalogPage() {
  return (
    <div className="pb-20">
      <section className="border-b border-line bg-bg-elevated">
        <div className="container-wide py-16 md:py-24">
          <p className="eyebrow">В наличии</p>
          <h1 className="display mt-4 max-w-3xl text-4xl sm:text-5xl md:text-7xl">Каталог техники</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-muted sm:mt-5 sm:text-base md:text-lg">
            Роторные буровые установки с характеристиками и фото. Оставьте заявку — рассчитаем
            лизинг под выбранную машину.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {brands.map((b) => (
              <span
                key={b}
                className="border border-line-strong px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-text-muted"
              >
                {b} · {products.filter((p) => p.brand === b).length}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="container-wide py-14 md:py-20">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <Reveal key={product.slug} delayMs={(index % 6) * 40} className="h-full">
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
        <p className="mt-10 text-sm text-text-muted">
          Нужна другая категория техники?{" "}
          <Link href="/apply" className="text-accent hover:underline">
            Напишите в заявке
          </Link>{" "}
          — подберём варианты под задачу.
        </p>
      </section>
    </div>
  );
}
