"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, Shield } from "lucide-react";

const TOTAL_SECTIONS = 9;

function SectionRow({
  num,
  children,
}: {
  num: number;
  children: React.ReactNode;
}) {
  return (
    <div className="grid lg:grid-cols-[140px_1fr] gap-8 lg:gap-10 min-h-screen">
      <div className="hidden lg:flex min-h-screen flex-col items-center justify-center">
        <motion.span
          className="font-heading text-[clamp(4rem,12vw,8rem)] font-bold text-ravok-gold/90 leading-none tabular-nums"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          {String(num).padStart(2, "0")}
        </motion.span>
        <span className="font-sans text-xs uppercase tracking-widest text-ravok-slate mt-3">
          / {String(TOTAL_SECTIONS).padStart(2, "0")}
        </span>
      </div>
      <div className="flex flex-col justify-center py-12 lg:py-16">
        {children}
      </div>
    </div>
  );
}

function Section({
  id,
  num,
  title,
  children,
  delay = 0,
}: {
  id: string;
  num: number;
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      id={id}
      className="scroll-mt-32 pl-6 lg:pl-8 border-l-2 border-ravok-gold/30 hover:border-ravok-gold/50 transition-colors duration-300 py-2"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex items-center gap-4 mb-4">
        <span className="w-10 h-10 rounded-full border-2 border-ravok-gold flex items-center justify-center font-heading text-ravok-gold text-sm font-bold shrink-0">
          {num}
        </span>
        <h2 className="text-xl font-heading text-ravok-gold">{title}</h2>
      </div>
      <div className="font-sans text-[var(--ds-ink-dim)] leading-relaxed space-y-4">{children}</div>
    </motion.div>
  );
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[var(--ds-bg)] text-[var(--ds-ink)] selection:bg-ravok-gold selection:text-black overflow-x-hidden">
      <Navbar />

      {/* Hero header */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-ravok-gold/5 via-transparent to-transparent" />
          <div className="absolute top-1/4 left-0 w-40 h-px bg-gradient-to-r from-ravok-gold/40 to-transparent" />
          <div className="absolute bottom-0 right-0 w-32 h-px bg-gradient-to-l from-ravok-gold/30 to-transparent" />
        </div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-ravok-slate font-sans text-sm uppercase tracking-widest hover:text-ravok-gold transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to home
            </Link>
          </motion.div>
          <motion.div
            className="flex items-start gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="w-12 h-12 rounded-lg bg-ravok-gold/10 border border-ravok-gold/30 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-ravok-gold" />
            </span>
            <div>
              <h1 className="text-4xl lg:text-5xl font-heading font-normal text-[var(--ds-ink)] uppercase tracking-wide mb-2">
                Privacy Policy
              </h1>
              <p className="text-ravok-slate font-sans text-sm mb-6">Last Updated: June 24, 2026</p>
              <p className="font-sans text-[var(--ds-ink-dim)] leading-relaxed max-w-3xl">
                This Privacy Notice describes how RAVOK STUDIOS, INC. (&ldquo;Ravok Studios,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) collects, uses, and protects personal information from users (&ldquo;you&rdquo;) who access our website at ravokstudios.com (the &ldquo;Site&rdquo;) and request password-protected access to our confidential materials.
              </p>
              <p className="font-sans text-[var(--ds-ink-dim)] leading-relaxed max-w-3xl mt-3">
                By accessing or using the Site, you agree to the terms of this Privacy Notice.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl lg:max-w-5xl px-6 pb-24">
        <div className="space-y-0">
          <SectionRow num={1}>
            <Section id="section-1" num={1} title="What Information We Collect" delay={0.1}>
              <p>
                We collect personal information that you voluntarily provide when you submit your full name and email address through our access request form. We do not collect sensitive personal data (e.g., race, sexual orientation, health data), nor do we knowingly collect data from minors under 18.
              </p>
              <p>
                We may also automatically collect limited technical data (e.g., IP address, browser type, and device information) using cookies for security and analytics purposes.
              </p>
            </Section>
          </SectionRow>

          <SectionRow num={2}>
            <Section id="section-2" num={2} title="How We Use Your Information" delay={0.12}>
              <p>We use your information to:</p>
              <ul className="list-none space-y-3 pl-0">
                {[
                  "Provide password-protected access to our film slate and business materials",
                  "Communicate with you regarding your access or related updates",
                  "Maintain security and improve the Site",
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-ravok-gold shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-ravok-gold" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
              <p>We process your data only as necessary to deliver our services or comply with legal obligations.</p>
            </Section>
          </SectionRow>

          <SectionRow num={3}>
            <Section id="section-3" num={3} title="How We Share Your Information" delay={0.14}>
              <p>We do not sell or rent your information. We may share your personal data only with:</p>
              <ul className="list-none space-y-3 pl-0">
                {[
                  "Hosting providers and cloud platforms (to operate the Site)",
                  "Email service providers (to send you your access credentials)",
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-ravok-gold shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-ravok-gold" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
              <p>These third parties are contractually required to protect your information and may not use it for any unrelated purpose.</p>
            </Section>
          </SectionRow>

          <SectionRow num={4}>
            <Section id="section-4" num={4} title="Cookies and Tracking Technologies" delay={0.16}>
              <p>
                We use cookies and similar tools to enhance functionality and analyze usage. These may include session cookies and analytics cookies. You can manage cookies via your browser settings.
              </p>
              <p>
                We do not currently respond to &ldquo;Do Not Track&rdquo; (DNT) browser signals.
              </p>
            </Section>
          </SectionRow>

          <SectionRow num={5}>
            <Section id="section-5" num={5} title="Children&apos;s Privacy" delay={0.18}>
              <p>
                We do not knowingly collect or solicit personal information from anyone under the age of 18. If we learn that a child under 18 has submitted personal data, we will delete it promptly. Parents or guardians may contact us to request removal.
              </p>
            </Section>
          </SectionRow>

          <SectionRow num={6}>
            <Section id="section-6" num={6} title="Data Security and Retention" delay={0.2}>
              <p>
                We implement commercially reasonable safeguards to protect your data. We retain your information only for as long as needed to fulfill the purposes described above, or as required by law.
              </p>
            </Section>
          </SectionRow>

          <SectionRow num={7}>
            <Section id="section-7" num={7} title="Your Rights (Including California Residents)" delay={0.22}>
              <p>If you are a California resident, you have the right to:</p>
              <ul className="list-none space-y-3 pl-0">
                {[
                  "Request access to the personal information we hold about you",
                  "Request deletion of your personal information",
                  "Request information about how we collect and use your data",
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-ravok-gold shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-ravok-gold" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
              <p>
                To exercise these rights, please contact us at{" "}
                <a href="mailto:contact@ravokstudios.com" className="text-ravok-gold hover:text-ravok-beige underline underline-offset-2 transition-colors">contact@ravokstudios.com</a>.
              </p>
            </Section>
          </SectionRow>

          <SectionRow num={8}>
            <Section id="section-8" num={8} title="Updates to This Privacy Notice" delay={0.24}>
              <p>
                We may revise this Privacy Notice from time to time. The updated version will be posted on this page with the &ldquo;Last Updated&rdquo; date. Please review it regularly.
              </p>
            </Section>
          </SectionRow>

          <SectionRow num={9}>
            <motion.div
              id="section-9"
              className="scroll-mt-32 rounded-xl border-2 border-ravok-gold/50 bg-ravok-gold/5 p-8 lg:p-10 pl-6 lg:pl-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.26 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="w-10 h-10 rounded-full border-2 border-ravok-gold flex items-center justify-center font-heading text-ravok-gold text-sm font-bold shrink-0">
                  9
                </span>
                <h2 className="text-xl font-heading text-ravok-gold">Contact Information</h2>
              </div>
              <p className="font-sans text-[var(--ds-ink-dim)] leading-relaxed mb-6">If you have questions or requests, contact us at:</p>
              <p className="text-white font-heading text-lg mb-2">RAVOK STUDIOS, INC.</p>
              <p className="font-sans text-[var(--ds-ink-dim)] mb-2">1401 21st ST STE R</p>
              <p className="font-sans text-[var(--ds-ink-dim)] mb-4">Sacramento, CA 95811</p>
              <p>
                Email:{" "}
                <a href="mailto:contact@ravokstudios.com" className="text-ravok-gold hover:text-ravok-beige underline underline-offset-2 transition-colors">contact@ravokstudios.com</a>
              </p>
            </motion.div>
          </SectionRow>
        </div>
      </div>

      <Footer />
    </main>
  );
}
