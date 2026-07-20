import type { Metadata } from "next";
import { AssortmentSection } from "@/components/AssortmentSection";

export const metadata: Metadata = {
  title: "Ассортимент",
  description:
    "Фото парка буровых установок XCMG и SANY, оснастки и площадки Tortkara Machinery.",
};

export default function AssortimentPage() {
  return (
    <div className="border-t border-line bg-bg-elevated">
      <AssortmentSection />
    </div>
  );
}
