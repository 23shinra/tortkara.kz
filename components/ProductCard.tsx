import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const cover = product.images[0];
  const { year, condition, depth, diameter } = product.specs;

  return (
    <Link
      href={`/catalog/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden border border-line bg-surface"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-bg-soft">
        {cover ? (
          <Image
            src={cover}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-text-muted">
            Фото по запросу
          </div>
        )}
        <div className="absolute left-3 top-3 bg-bg/90 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-accent">
          {product.brand}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="display text-xl sm:text-2xl">{product.title}</h3>
        <p className="mt-1.5 text-[0.65rem] uppercase tracking-[0.12em] text-text-muted sm:mt-2 sm:text-xs sm:tracking-[0.14em]">
          {[year, condition].filter(Boolean).join(" · ")}
        </p>
        <dl className="mt-3 grid grid-cols-2 gap-2 text-sm sm:mt-4 sm:gap-3">
          {depth ? (
            <div>
              <dt className="text-[0.65rem] uppercase tracking-[0.12em] text-steel">Глубина</dt>
              <dd className="mt-0.5 text-xs text-text sm:text-sm">{depth}</dd>
            </div>
          ) : null}
          {diameter ? (
            <div>
              <dt className="text-[0.65rem] uppercase tracking-[0.12em] text-steel">Диаметр</dt>
              <dd className="mt-0.5 text-xs text-text sm:text-sm">{diameter}</dd>
            </div>
          ) : null}
        </dl>
        <span className="mt-auto pt-4 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-accent sm:pt-5 sm:text-xs sm:tracking-[0.16em]">
          Подробнее →
        </span>
      </div>
    </Link>
  );
}
