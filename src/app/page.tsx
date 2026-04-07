import Navbar from "@/components/layout/Navbar";
import { Hero, IntroSection, Philosophy, QuoteSection, VentureModel, Offerings, Partners } from "@/components/sections";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-ravok-charcoal text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <IntroSection />

      {/* Stacking Sections Container */}
      <div className="relative">
        {/* Philosophy Section - First Card */}
        <div className="sticky top-0 z-10">
          <div className="scale-[0.95] origin-top">
            <Philosophy />
          </div>
        </div>

        {/* Quote Section - Second Card */}
        <div className="sticky top-0 z-20">
          <div className="scale-[0.96] origin-top">
            <QuoteSection />
          </div>
        </div>

        {/* Venture Model Section - Third Card */}
        <div className="sticky top-0 z-30">
          <div className="scale-[0.97] origin-top">
            <VentureModel />
          </div>
        </div>

        {/* Offerings Section - Fourth Card */}
        <div className="sticky top-0 z-40">
          <div className="scale-[0.98] origin-top">
            <Offerings />
          </div>
        </div>

        {/* Partners Section - Fifth Card */}
        <div className="sticky top-0 z-50">
          <div className="scale-[0.99] origin-top">
            <Partners />
          </div>
        </div>

        {/* Footer - Final Section (not sticky) */}
        <div className="relative z-[60]">
          <Footer />
        </div>
      </div>
    </main>
  );
}
