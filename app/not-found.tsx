import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-wide flex min-h-[60vh] flex-col items-start justify-center py-20">
      <p className="eyebrow">404</p>
      <h1 className="display mt-3 text-5xl md:text-7xl">Страница не найдена</h1>
      <p className="mt-4 max-w-md text-text-muted">
        Проверьте адрес или вернитесь на главную.
      </p>
      <Link href="/" className="btn btn-primary mt-8">
        На главную
      </Link>
    </div>
  );
}
