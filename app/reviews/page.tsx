import type { Metadata } from "next";
import { ReviewsSection } from "@/components/ReviewsSection";

export const metadata: Metadata = {
  title: "Отзывы клиентов",
  description:
    "Фото и отзывы клиентов Tortkara Machinery: передача буровых установок и спецтехники в лизинг.",
};

export default function OtzyvyPage() {
  return <ReviewsSection />;
}
