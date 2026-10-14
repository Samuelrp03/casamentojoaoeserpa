import { Hero } from "@/components/hero";
import { CoupleSection } from "@/components/couple-section";
import { WeddingInfoSection } from "@/components/wedding-info-section";
import { ScrollAnimations } from "@/components/scroll-animations";

export default function Home() {
  return (
    <main className="flex flex-col">
      <ScrollAnimations />
      <Hero />
      <CoupleSection />
      <WeddingInfoSection />
    </main>
  );
}
