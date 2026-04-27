"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, FileText } from "lucide-react";

const TOTAL_SECTIONS = 14;

function SectionRow({
  num,
  children,
}: {
  num: number;
  children: React.ReactNode;
}) {
  return (
    <div className="grid lg:grid-cols-[140px_1fr] gap-8 lg:gap-10 min-h-screen">
      {/* Left: full-page number – position changes with each section */}
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

export default function TermsPage() {
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
              <FileText className="w-6 h-6 text-ravok-gold" />
            </span>
            <div>
              <h1 className="text-4xl lg:text-5xl font-heading font-normal text-[var(--ds-ink)] uppercase tracking-wide mb-2">
                Terms & Conditions
              </h1>
              <p className="text-ravok-slate font-sans text-sm">Last updated: January 2026</p>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl lg:max-w-5xl px-6 pb-24">
        <div className="space-y-0">
          <SectionRow num={1}>
            <Section id="section-1" num={1} title="Introduction" delay={0.1}>
              <p>
                Welcome to RAVOK Studios (the &ldquo;Website&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). These Terms & Conditions (&ldquo;Terms&rdquo;) govern your access to and use of{" "}
                <a href="https://ravokstudios.com" target="_blank" rel="noopener noreferrer" className="text-ravok-gold hover:text-ravok-beige underline underline-offset-2 transition-colors">https://ravokstudios.com</a>{" "}
                (the &ldquo;Site&rdquo;) and any services offered via the Site (collectively, the &ldquo;Services&rdquo;). By accessing or using the Site, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you must discontinue use of the Site immediately.
              </p>
              <p>We may modify these Terms at any time by posting revised versions on the Site — your continued use after such posting means you accept the modifications.</p>
            </Section>
          </SectionRow>

          <SectionRow num={2}>
            <Section id="section-2" num={2} title="Eligibility" delay={0.12}>
              <p>You represent and warrant that you are at least 18 years old (or the legal age of majority in your jurisdiction) and that you have the legal capacity to enter into a binding agreement. If you are accessing the Site on behalf of a company or other legal entity, you further represent and warrant that you have authority to bind such entity and &ldquo;you&rdquo; and &ldquo;your&rdquo; refer to that entity.</p>
            </Section>
          </SectionRow>

          <SectionRow num={3}>
            <Section id="section-3" num={3} title="Services & Content" delay={0.14}>
              <p>a. The Site may provide information about our venture-studio model, film/tech ventures, partnership opportunities, contact links, and other related content.</p>
              <p>b. All content on the Site (text, graphics, logos, images, audio, video, software) is owned by or licensed to RAVOK Studios, unless otherwise indicated, and is protected by copyright, trademark, and other laws.</p>
              <p>c. You are authorised to view, download or print single copies of material on the Site for your personal, non-commercial use only — provided you retain all copyright and other proprietary notices. Any other use, including reproduction, modification, distribution, transmission, republication, display or performance, is strictly prohibited unless authorised in writing by RAVOK Studios.</p>
              <p>d. We reserve the right (but are not obligated) to monitor or remove any content or account that we determine violates these Terms or is otherwise harmful to the Site or our users.</p>
            </Section>
          </SectionRow>

          <SectionRow num={4}>
            <Section id="section-4" num={4} title="User Conduct" delay={0.16}>
              <p>By using the Site, you agree not to:</p>
              <ul className="list-none space-y-3 pl-0">
                {[
                  "Use the Site for any unlawful purpose or in violation of applicable laws.",
                  "Upload, post or transmit any content that is defamatory, infringing, obscene, hateful, threatening or otherwise objectionable.",
                  "Impersonate any person or entity or misrepresent your affiliation with a person or entity.",
                  "Interfere with or disrupt the Site, servers or networks connected to the Site, or violate any requirements, procedures, policies or regulations of networks connected to the Site.",
                  "Use any automated system (e.g., bots, scrapers) to access the Site for any purpose without our express written permission.",
                  "Attempt to gain unauthorised access to any portion of the Site or its related systems or networks.",
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-ravok-gold shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-ravok-gold" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </Section>
          </SectionRow>

          <SectionRow num={5}>
            <Section id="section-5" num={5} title="Intellectual Property Rights" delay={0.18}>
              <p>All intellectual property rights (including but not limited to copyrights, trademarks, trade names, designs, patents, moral rights) in the Site and the content contained therein are owned by or licensed to RAVOK Studios. You agree that you will not use our trademarks, service marks or logos without our prior written consent.</p>
              <p>If you provide any feedback, suggestions or ideas (&ldquo;Feedback&rdquo;) to us, you hereby assign all rights in such Feedback to RAVOK Studios and agree we may freely use and exploit it without compensation to you.</p>
            </Section>
          </SectionRow>

          <SectionRow num={6}>
            <Section id="section-6" num={6} title="Third-Party Links & Services" delay={0.2}>
              <p>The Site may contain links to third-party websites or services that are not owned or controlled by RAVOK Studios. We do not endorse, guarantee or assume any responsibility for the accuracy, completeness or reliability of any content or services offered by such third parties. Your use of third-party websites is at your own risk and subject to the third-party&apos;s terms.</p>
              <p>We may also use third-party services (e.g., analytics, social media, email) that collect data in accordance with their own privacy policies.</p>
            </Section>
          </SectionRow>

          <SectionRow num={7}>
            <Section id="section-7" num={7} title="Disclaimers" delay={0.22}>
              <p>a. The Site and Services are provided &ldquo;as-is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, whether express or implied. To the fullest extent permitted by law, RAVOK Studios expressly disclaims all warranties, including but not limited to merchantability, fitness for a particular purpose, non-infringement, accuracy, completeness or reliability of information.</p>
              <p>b. We make no guarantee that the Site will be uninterrupted, timely, secure or error-free, or that defects will be corrected, or that the Site or the servers are free of viruses or other harmful components.</p>
              <p>c. Any content provided on or through the Site is for general informational purposes only and does not constitute advice (legal, financial, business, or otherwise). You should consult professional advisers for specific advice tailored to your circumstances.</p>
            </Section>
          </SectionRow>

          <SectionRow num={8}>
            <Section id="section-8" num={8} title="Limitation of Liability" delay={0.24}>
              <p>To the maximum extent permitted by applicable law, in no event will RAVOK Studios, its affiliates, directors, officers, employees or agents be liable for any indirect, incidental, special, consequential, punitive or exemplary damages (including loss of profits, revenue, business, data or goodwill) arising out of or in connection with your access to or use of (or inability to use) the Site or Services, even if advised of the possibility of such damages.</p>
              <p>Our total aggregate liability for all claims arising out of or relating to your use of the Site or Services shall not exceed the amount, if any, you paid us for access to the Services during the 6 months immediately preceding the claim (or, if you paid nothing, a nominal amount of USD 1).</p>
              <p>Some jurisdictions do not allow exclusion or limitation of certain warranties or damages; accordingly some of the above exclusions may not apply to you.</p>
            </Section>
          </SectionRow>

          <SectionRow num={9}>
            <Section id="section-9" num={9} title="Indemnification" delay={0.26}>
              <p>You agree to indemnify, defend and hold harmless RAVOK Studios and its affiliates, officers, directors, employees and agents from and against any and all claims, demands, liabilities, losses, damages, costs and expenses (including reasonable attorneys&apos; fees) arising out of or in connection with:</p>
              <ul className="list-none space-y-2 pl-0 mt-4">
                {["your violation of these Terms;", "your use of the Site or Services;", "any content you upload, post or transmit; or", "any alleged infringement of third-party rights by you."].map((text, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-ravok-gold shrink-0">•</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </Section>
          </SectionRow>

          <SectionRow num={10}>
            <Section id="section-10" num={10} title="Privacy" delay={0.28}>
              <p>Use of the Site is also governed by our Privacy Policy (accessible via the Site). Please review the Privacy Policy carefully. By using the Site, you consent to our collection, use and disclosure of your personal information as set out therein.</p>
              <p>
                <Link href="/privacy-policy" className="inline-flex items-center gap-2 mt-4 text-ravok-gold hover:text-ravok-beige underline underline-offset-2 transition-colors font-sans text-sm">
                  View Privacy Policy →
                </Link>
              </p>
            </Section>
          </SectionRow>

          <SectionRow num={11}>
            <Section id="section-11" num={11} title="Termination" delay={0.3}>
              <p>We reserve the right to suspend or terminate your access to the Site (or any part thereof) at our discretion, for any reason or no reason, without notice. Upon termination, the rights and licenses granted to you under these Terms will immediately cease and you must stop using the Site.</p>
              <p>Sections 3 (Services & Content), 5 (Intellectual Property), 7 (Disclaimers), 8 (Limitation of Liability), 9 (Indemnification), 12 (Governing Law) and 13 (Other) shall survive termination.</p>
            </Section>
          </SectionRow>

          <SectionRow num={12}>
            <Section id="section-12" num={12} title="Governing Law & Dispute Resolution" delay={0.32}>
              <p>These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which RAVOK Studios is established (without regard to its conflict-of-law provisions). Any dispute arising out of or in connection with these Terms or your use of the Site shall be resolved exclusively by the courts located in that jurisdiction, and you hereby consent to the personal jurisdiction of such courts.</p>
            </Section>
          </SectionRow>

          <SectionRow num={13}>
            <Section id="section-13" num={13} title="Other Provisions" delay={0.34}>
              <p>a. <strong className="text-[var(--ds-ink)]">Entire Agreement.</strong> These Terms (and any documents expressly incorporated by reference) constitute the entire agreement between you and RAVOK Studios concerning the Site and supersede all prior or contemporaneous communications and proposals, whether oral, written or electronic, between you and us.</p>
              <p>b. <strong className="text-[var(--ds-ink)]">Severability.</strong> If any provision of these Terms is held to be invalid or unenforceable in whole or in part, the remaining provisions shall continue in full force and effect.</p>
              <p>c. <strong className="text-[var(--ds-ink)]">Waiver.</strong> No waiver of any term or condition of these Terms shall be deemed a further or continuing waiver of such term or condition or any other term or condition.</p>
              <p>d. <strong className="text-[var(--ds-ink)]">Assignment.</strong> You may not assign or transfer any of your rights or obligations under these Terms without our prior written consent. We may assign or transfer our rights and obligations at any time without restriction.</p>
              <p>e. <strong className="text-[var(--ds-ink)]">Notices.</strong> Any notices required or permitted under these Terms shall be in writing and delivered by email to{" "}
                <a href="mailto:contact@ravokstudios.com" className="text-ravok-gold hover:text-ravok-beige underline underline-offset-2 transition-colors">contact@ravokstudios.com</a>{" "}
                (or such other email address as we may provide) or by posting on the Site.</p>
              <p>f. <strong className="text-[var(--ds-ink)]">Changes to the Site / Services.</strong> We reserve the right to modify, suspend or discontinue the Site or Services (or any part thereof) at any time, with or without notice.</p>
            </Section>
          </SectionRow>

          {/* Contact - highlighted card */}
          <SectionRow num={14}>
            <motion.div
              id="section-14"
              className="scroll-mt-32 rounded-xl border-2 border-ravok-gold/50 bg-ravok-gold/5 p-8 lg:p-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.36 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="w-10 h-10 rounded-full border-2 border-ravok-gold flex items-center justify-center font-heading text-ravok-gold text-sm font-bold shrink-0">
                  14
                </span>
                <h2 className="text-xl font-heading text-ravok-gold">Contact Information</h2>
              </div>
              <p className="font-sans text-[var(--ds-ink-dim)] leading-relaxed mb-6">If you have any questions about these Terms, please contact us at:</p>
              <p className="text-white font-heading text-lg mb-2">RAVOK Studios</p>
              <p className="mb-2">
                Email:{" "}
                <a href="mailto:contact@ravokstudios.com" className="text-ravok-gold hover:text-ravok-beige underline underline-offset-2 transition-colors">contact@ravokstudios.com</a>
              </p>
              <p>
                Website:{" "}
                <a href="https://ravokstudios.com" target="_blank" rel="noopener noreferrer" className="text-ravok-gold hover:text-ravok-beige underline underline-offset-2 transition-colors">https://ravokstudios.com</a>
              </p>
            </motion.div>
          </SectionRow>
        </div>
      </div>

      <Footer />
    </main>
  );
}
