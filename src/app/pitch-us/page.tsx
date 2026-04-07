"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Pen, Film, Briefcase } from "lucide-react";

const STEPS = [
  { step: "01", title: "Submit", desc: "Fill out the role-specific form with your project details and portfolio." },
  { step: "02", title: "Review", desc: "Our team reviews every submission for creative merit and commercial viability." },
  { step: "03", title: "Interview", desc: "Selected creators meet with our development team for a deeper conversation." },
  { step: "04", title: "SPV Formation", desc: "If aligned, we co-found an SPV — you own equity in your project from day one." },
];

const ROLES = [
  {
    title: "Writer",
    icon: Pen,
    href: "/pitch-us/writer",
    desc: "You have a script or IP ready for development. We provide seed capital, packaging support, and venture structure.",
  },
  {
    title: "Director",
    icon: Film,
    href: "/pitch-us/director",
    desc: "You bring visual vision and execution capability. We match you with projects and build the venture around your talent.",
  },
  {
    title: "Producer",
    icon: Briefcase,
    href: "/pitch-us/producer",
    desc: "You have packaging expertise and industry relationships. We co-produce through transparent equity structures.",
  },
];

const FAQS = [
  { q: "Do I need a finished script?", a: "Not necessarily. We accept projects at various stages — from concept to polished draft. The key is a compelling creative vision with commercial potential." },
  { q: "What does RAVOK provide?", a: "Seed capital for development, legal entity formation (SPV), strategic packaging support, and a path from development to distribution." },
  { q: "Do I keep ownership?", a: "Yes. Every project is structured as a co-founded venture. Creators retain meaningful equity and creative control." },
  { q: "How long does the review process take?", a: "Typically 2-4 weeks from submission to initial response. Selected projects move to an interview within 30 days." },
  { q: "Is there a submission fee?", a: "No. We never charge submission fees. Our model is venture-based — we invest our capital alongside your creative contribution." },
];

export default function PitchUsPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-ravok-gold selection:text-black">
      <Navbar />

      {/* Hero */}
      <header className="border-b border-white/10 px-6 pt-32 pb-16">
        <div className="container mx-auto max-w-5xl">
          <motion.p
            className="font-sans text-xs font-medium uppercase tracking-widest text-ravok-slate mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            For Creators
          </motion.p>
          <motion.h1
            className="font-heading text-5xl lg:text-7xl text-white mb-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Pitch Us
          </motion.h1>
          <motion.p
            className="font-sans text-lg text-ravok-slate/90 max-w-2xl leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            RAVOK invests in early-stage entertainment projects like venture capital invests in startups. If you are building a high-upside film or IP-led project, we want to hear from you.
          </motion.p>
          <motion.p
            className="font-sans text-sm text-ravok-gold/90 max-w-2xl leading-relaxed mt-5 uppercase tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            No submission fees. Founder-style ownership from day one.
          </motion.p>
          <motion.div
            className="mt-6 h-0.5 w-16 bg-ravok-gold"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{ transformOrigin: "left" }}
          />
        </div>
      </header>

      {/* How It Works */}
      <section className="px-6 py-16 lg:py-24 border-b border-white/10">
        <div className="container mx-auto max-w-5xl">
          <motion.h2
            className="font-heading text-3xl lg:text-4xl text-white mb-12"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            How It Works
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="font-heading text-4xl text-ravok-gold/40">{step.step}</span>
                <h3 className="font-heading text-xl text-white mt-2 mb-2">{step.title}</h3>
                <p className="font-sans text-sm text-ravok-slate leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Select Your Role */}
      <section className="px-6 py-16 lg:py-24 border-b border-white/10">
        <div className="container mx-auto max-w-5xl">
          <motion.h2
            className="font-heading text-3xl lg:text-4xl text-white mb-4"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Select Your Role
          </motion.h2>
          <motion.p
            className="font-sans text-ravok-slate mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Each role has a tailored intake form so our team can evaluate fit, package faster, and move qualified projects into diligence.
          </motion.p>
          <div className="grid lg:grid-cols-3 gap-6">
            {ROLES.map((role, i) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={role.href}
                  className="block border border-ravok-gold/20 bg-black/90 p-8 hover:bg-zinc-950 transition-all duration-300 group h-full"
                >
                  <role.icon className="w-8 h-8 text-ravok-gold mb-4" />
                  <h3 className="font-heading text-2xl text-ravok-beige mb-3 group-hover:text-white transition-colors">
                    {role.title}
                  </h3>
                  <p className="font-sans text-sm text-ravok-slate leading-relaxed mb-6">
                    {role.desc}
                  </p>
                  <span className="inline-flex items-center gap-2 font-sans text-xs text-ravok-gold uppercase tracking-widest group-hover:text-ravok-beige transition-colors">
                    Start Form <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16 lg:py-24">
        <div className="container mx-auto max-w-3xl">
          <motion.h2
            className="font-heading text-3xl lg:text-4xl text-white mb-12"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Frequently Asked Questions
          </motion.h2>
          <div className="space-y-8">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                className="border-b border-white/10 pb-8"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <h3 className="font-heading text-lg text-white mb-2">{faq.q}</h3>
                <p className="font-sans text-sm text-ravok-slate leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
