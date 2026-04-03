import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import IntroSection from "@/components/IntroSection";
import Philosophy from "@/components/Philosophy";
import QuoteSection from "@/components/QuoteSection";
import VentureModel from "@/components/VentureModel";
import Offerings from "@/components/Offerings";
import Partners from "@/components/Partners";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden selection:bg-ravok-gold selection:text-black">
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
