import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function FormIndexPage() {
  const items = [
    { href: "/form/writer", label: "WRITER" },
    { href: "/form/director", label: "DIRECTOR" },
    { href: "/form/producer", label: "PRODUCER" },
  ];
  return (
    <main className="min-h-screen bg-black text-white selection:bg-ravok-gold selection:text-black">
      <Navbar />
      <section className="pt-32 pb-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-10">
            <h1 className="text-5xl sm:text-6xl font-heading font-thin text-ravok-gold leading-tight">
              Submit Your Work
            </h1>
            <p className="mt-3 text-white/80 font-sans">
              Choose a form below to get started.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {items.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className="rounded-xl border border-white/10 bg-black/40 shadow-lg hover:border-ravok-gold/40 transition-colors p-6 text-center"
              >
                <span className="block text-2xl font-heading tracking-widest">{it.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
