import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/lib/categories";

export function CategoryCard({ category, index = 0 }: { category: Category; index?: number }) {
  const tall = index % 5 === 0 || index % 5 === 3;

  return (
    <Link
      href={`/catalog/${category.slug}`}
      className={`group relative block h-full min-h-[240px] overflow-hidden border border-line bg-surface ${
        tall ? "md:min-h-[420px]" : "md:min-h-[240px]"
      }`}
    >
      <Image
        src={category.image}
        alt={category.imageAlt}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
        <p className="text-[0.65rem] uppercase tracking-[0.18em] text-accent">{category.short}</p>
        <h3 className="display mt-2 text-2xl text-white md:text-3xl">{category.title}</h3>
        <p className="mt-3 text-sm text-white/70 opacity-0 transition duration-300 group-hover:opacity-100">
          В лизинг · Подробнее
        </p>
      </div>
    </Link>
  );
}
