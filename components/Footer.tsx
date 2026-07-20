import Image from "next/image";
import Link from "next/link";
import { company, phoneHref, whatsappHref } from "@/lib/company";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-bg-elevated">
      <div className="container-wide grid gap-8 py-10 md:grid-cols-12 md:gap-10 md:py-14">
        <div className="md:col-span-5">
          <Image
            src="/brand/logo-wide.png"
            alt={company.shortName}
            width={260}
            height={67}
            className="h-10 w-auto sm:h-12"
          />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-text-muted sm:mt-5">
            {company.about}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 md:col-span-7 md:grid-cols-2 md:gap-10">
        <div>
          <p className="eyebrow">Навигация</p>
          <ul className="mt-4 space-y-2 text-sm text-text-muted">
            <li>
              <Link href="/catalog" className="hover:text-text">
                Каталог
              </Link>
            </li>
            <li>
              <Link href="/assortment" className="hover:text-text">
                Ассортимент
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-text">
                Условия лизинга
              </Link>
            </li>
            <li>
              <Link href="/reviews" className="hover:text-text">
                Отзывы
              </Link>
            </li>
            <li>
              <Link href="/apply" className="hover:text-text">
                Оставить заявку
              </Link>
            </li>
            <li>
              <Link href="/contacts" className="hover:text-text">
                Контакты и реквизиты
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">Контакты</p>
          <ul className="mt-4 space-y-2 text-sm text-text-muted">
            <li>{company.legalName}</li>
            <li>{company.address}</li>
            <li>
              <a href={phoneHref} className="text-text hover:text-accent">
                {company.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={whatsappHref} className="hover:text-text" target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </li>
            <li className="pt-2 text-xs leading-relaxed break-all">
              БИН {company.bin}
              <br />
              ИИК {company.iik}
              <br />
              {company.bank}
            </li>
          </ul>
        </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-wide flex flex-col gap-2 py-5 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {company.legalName}
          </span>
          <span>Директор: {company.director}</span>
        </div>
      </div>
    </footer>
  );
}
