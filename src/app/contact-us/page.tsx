"use client";

/* Contact Us */
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import Link from "next/link";


const email = "contact@ravokstudios.com";
const inquiryTypes = [
  { label: "General Inquiries", email },
  { label: "Partnership Inquiries", email },
  { label: "Investor Relations", email },
];

export default function ContactUs() {
  return (
    <main className="min-h-screen bg-[var(--ds-bg)] text-[var(--ds-ink)] selection:bg-ravok-gold selection:text-black">
      <Navbar />

      <section className="min-h-screen flex flex-col justify-center pt-32 pb-24 px-6 lg:px-12">
        <div className="container mx-auto w-full max-w-6xl">
          <motion.h1
            className="text-[clamp(3rem,6.5vw,5.5rem)] font-heading font-normal text-[var(--ds-ink)] leading-[1.1] mb-24 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            Whether you're a
            <br />
            partner, investor, or
            <br />
            creator—we want to
            <br />
            hear from you.
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex flex-wrap gap-3">
              <Link href="/form/writer" className="px-4 py-2 rounded-full border border-[var(--ds-border-strong)] bg-[rgba(28,28,26,0.3)] text-[var(--ds-ink)] hover:text-ravok-gold hover:bg-[rgba(232,228,218,0.08)] transition-colors font-sans tracking-widest text-xs uppercase">
                Writer Form
              </Link>
              <Link href="/form/director" className="px-4 py-2 rounded-full border border-[var(--ds-border-strong)] bg-[rgba(28,28,26,0.3)] text-[var(--ds-ink)] hover:text-ravok-gold hover:bg-[rgba(232,228,218,0.08)] transition-colors font-sans tracking-widest text-xs uppercase">
                Director Form
              </Link>
              <Link href="/form/producer" className="px-4 py-2 rounded-full border border-[var(--ds-border-strong)] bg-[rgba(28,28,26,0.3)] text-[var(--ds-ink)] hover:text-ravok-gold hover:bg-[rgba(232,228,218,0.08)] transition-colors font-sans tracking-widest text-xs uppercase">
                Producer Form
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-xl font-heading font-semibold text-[var(--ds-ink)] mb-8">
              Contact Information
            </h2>
            <div className="space-y-6">
              {inquiryTypes.map((item) => (
                <div key={item.label} className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                  <span className="text-ravok-gold font-sans text-sm sm:w-48 shrink-0">
                    {item.label}
                  </span>
                  <a
                    href={`mailto:${item.email}`}
                    className="text-[var(--ds-ink-dim)] hover:text-ravok-gold underline underline-offset-2 transition-colors"
                  >
                    {item.email}
                  </a>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
