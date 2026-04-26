import Navbar from "@/components/layout/Navbar";
import { Hero, IntroSection, Philosophy, QuoteSection, VentureModel, Offerings, Partners } from "@/components/sections";
import Footer from "@/components/layout/Footer";

/**
 * Homepage — composed of design-system primitives.
 *
 * Each section is mapped to a pattern from WEBSITE-TECHNICAL-RULES.md §12:
 *   Hero          → 2a Hero (entry only)
 *   IntroSection  → 2c C-Reveal (manifesto, non-sticky)
 *   Philosophy    → 2c C-Reveal (multi-step thesis — upgrade to 2b later)
 *   QuoteSection  → 2c C-Reveal (quote callout)
 *   VentureModel  → 2c C-Reveal (comparison)
 *   Offerings     → 2c C-Reveal (portfolio w/ stone cards)
 *   Partners      → 2c C-Reveal (team / partner grid w/ stone cards)
 *
 * C-ladder z-indexes are owned by each CRevealSection via the `zIndex` prop.
 * Sticky positioning is also handled inside the primitive — page.tsx just orders them.
 */

export default function Home() {
  return (
    <main className="min-h-screen text-white overflow-x-hidden selection:bg-ravok-gold selection:text-black">
      <Navbar />
      <Hero />
      <IntroSection />
      <Philosophy />
      <QuoteSection />
      <VentureModel />
      <Offerings />
      <Partners />
      <div className="relative z-[60]">
        <Footer />
      </div>
    </main>
  );
}
