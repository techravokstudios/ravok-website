"use client";

/* About Us – 7 sections, creative layout */
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const sectionNumber = (n: number) => String(n).padStart(2, "0");

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-ravok-gold selection:text-black overflow-x-hidden">
      <Navbar />

      {/* Section 1: Hero - We're Not Here to Play the Game */}
      <section className="min-h-screen flex flex-col justify-center relative px-6 pt-32 pb-24 overflow-hidden">
        {/* Background + grain */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/bg_image.png"
            alt=""
            className="w-full h-full object-cover opacity-40 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black" />
        </div>
        <div className="absolute top-1/4 right-0 w-40 h-px bg-gradient-to-l from-ravok-gold/40 to-transparent z-10" />
        <div className="absolute bottom-1/3 left-0 w-28 h-px bg-gradient-to-r from-ravok-gold/25 to-transparent z-10" />
        <div className="container mx-auto relative z-10 max-w-5xl">
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-heading font-thin leading-[1.05] text-center text-white uppercase tracking-[0.02em] mb-6"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            We&apos;re not here to play the game.
          </motion.h1>
          <motion.h2
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-thin leading-[1.05] text-center text-ravok-gold uppercase tracking-[0.02em] mb-20"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            We&apos;re here to change it.
          </motion.h2>
          <motion.div
            className="max-w-xl ml-auto relative pl-8 border-l-2 border-ravok-gold/50"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-ravok-gold font-heading text-xl lg:text-2xl leading-relaxed">
              RAVOK exists because the people who make the work should own the work. That&apos;s not radical—it&apos;s just fair. But Hollywood&apos;s entire business model depends on it <em className="italic font-semibold">not</em> happening.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 2: What We're Here to Do (Who We Are) */}
      <section className="min-h-screen flex flex-col justify-center py-24 lg:py-32 px-6 border-t border-white/5 relative">
        {/* Large watermark number */}
        <span className="absolute top-1/2 -translate-y-1/2 left-0 text-[20vw] font-heading font-bold text-white/[0.03] leading-none select-none pointer-events-none">
          {sectionNumber(2)}
        </span>
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <motion.div
              className="lg:col-span-3 flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-white/60 w-6 h-6 border border-white/40 rounded-sm shrink-0" />
              <span className="text-white font-sans text-base tracking-widest uppercase">
                {sectionNumber(2)}. Who we are
              </span>
            </motion.div>
            <div className="lg:col-span-9">
              <motion.h2
                className="text-5xl sm:text-6xl lg:text-7xl font-heading font-thin text-ravok-gold leading-tight mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                What we&apos;re here
                <br />
                to do
              </motion.h2>
              <motion.div
                className="space-y-8 text-white/90 font-sans text-lg lg:text-xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                <p>
                  RAVOK&apos;s mission is simple: <strong className="text-white font-semibold">give filmmakers the same ownership and infrastructure that tech founders get.</strong>
                </p>
                <p>
                  We provide seed capital, structure projects as independent ventures with creator equity, and build the support systems that should exist but don&apos;t. No more gatekeeping or Hollywood shady accounting.
                </p>
                <p>
                  Just fair deals, transparent governance, and real ownership for the people who make the work.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Where We're Going - split with diagonal feel */}
      <section className="min-h-screen flex flex-col justify-center py-24 lg:py-32 px-6 border-t border-white/5 relative overflow-hidden">
        <div className="container mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            className="relative order-2 lg:order-1 min-h-[400px] lg:min-h-[500px] rounded-2xl overflow-hidden border border-white/10"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute inset-0 z-0">
              <img
                src="/images/1.png"
                alt=""
                className="w-full h-full object-cover object-top grayscale opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent lg:from-black/80" />
            </div>
            <div className="absolute top-6 left-6 flex gap-2 z-10">
              <span className="w-3 h-3 rounded-full border border-white/60" />
              <span className="w-3 h-3 rounded-full bg-white/60" />
            </div>
          </motion.div>
          <div className="order-1 lg:order-2 relative z-10 pl-0 lg:pl-8">
            <motion.span
              className="inline-block text-ravok-gold/60 font-sans text-sm tracking-[0.3em] uppercase mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              The vision
            </motion.span>
            <motion.h2
              className="text-5xl sm:text-6xl lg:text-7xl font-heading font-thin text-ravok-gold leading-tight mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              Where we&apos;re
              <br />
              going
            </motion.h2>
            <motion.p
              className="text-white/90 font-heading text-xl lg:text-2xl leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              In ten years, we want people to look back and ask: &ldquo;Remember when filmmakers didn&apos;t own their work?&rdquo; The same way we now ask: &ldquo;Remember when musicians didn&apos;t own their masters?&rdquo;
            </motion.p>
          </div>
        </div>
      </section>

      {/* Section 4: Our Vision - card-style items with gold accent */}
      <section className="min-h-screen flex flex-col justify-center py-24 lg:py-32 px-6 border-t border-white/5 relative overflow-hidden">
        <div className="container mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative z-10">
            <motion.h2
              className="text-4xl sm:text-5xl lg:text-6xl font-heading font-thin text-white leading-tight mb-14"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              Our vision is a film industry where:
            </motion.h2>
            <div className="space-y-6">
              {[
                {
                  title: "Creators are founders.",
                  body: "They get equity, board seats, and real governance rights—not as a special deal, but as standard practice.",
                },
                {
                  title: "Original voices get funded",
                  body: "Mid-budget storytelling thrives because the economics actually work when you're not supporting bloated studio overhead.",
                },
                {
                  title: "Ownership is the default.",
                  body: "New institutions emerge that prove creator-first models outperform the old extractive system.",
                },
                {
                  title: "Sustainable careers exist.",
                  body: "Filmmakers build IP engines and ongoing revenue, not just one-off paychecks.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="group pl-6 border-l-2 border-ravok-gold/30 hover:border-ravok-gold/70 transition-colors duration-300 py-2"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                >
                  <h3 className="text-2xl lg:text-3xl font-heading text-ravok-gold mb-2 group-hover:text-ravok-beige/90 transition-colors">{item.title}</h3>
                  <p className="text-white/85 font-sans text-lg lg:text-xl leading-relaxed">{item.body}</p>
                </motion.div>
              ))}
            </div>
            <motion.p
              className="mt-14 pl-6 text-white/90 font-sans text-lg lg:text-xl leading-relaxed max-w-xl italic"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              RAVOK won&apos;t be the only venture studio doing this. That&apos;s the point. We&apos;re proving the model so others follow. Systemic change starts with a spark.
            </motion.p>
          </div>
          <div className="relative hidden lg:block min-h-[500px] rounded-2xl overflow-hidden border border-white/10">
            <img
              src="/images/2.png"
              alt=""
              className="w-full h-full object-cover object-center grayscale opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black to-transparent" />
          </div>
        </div>
      </section>

      {/* Section 5: Why This Works Right Now - offset grid + hover lift */}
      <section className="min-h-screen flex flex-col justify-center py-24 lg:py-32 px-6 border-t border-white/5">
        <div className="container mx-auto max-w-5xl">
          <motion.h2
            className="text-5xl sm:text-6xl lg:text-7xl font-heading font-thin text-ravok-gold text-center uppercase leading-tight mb-24"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            Why this works right now
          </motion.h2>
          <div className="grid sm:grid-cols-2 gap-8 lg:gap-10">
            {[
              {
                title: "The creator economy is mature",
                body: "Musicians own masters. Writers own IP. YouTubers own their channels. Podcasters own their shows. Film is literally the last creative industry still running on the old extractive model. That anomaly won't last.",
              },
              {
                title: "Audiences want original stories",
                body: "People are exhausted by sequels, prequels, and franchise garbage. Mid-budget originals consistently outperform tentpoles on ROI—but studios won't fund them because their incentive structures are broken. We will. Because our economics actually work.",
              },
              {
                title: "Distribution is democratized",
                body: "You don't need theatrical deals or network slots anymore. Boutique streamers, festival-to-platform paths, direct-to-audience through platforms like ours (Phema). The gatekeepers aren't gone, but there are more doors.",
              },
              {
                title: "Capital is looking for alternatives",
                body: "Smart money sees the traditional model dying and wants exposure to whatever's next. Venture capital understands equity and founder ownership—they just haven't looked at film this way yet. We're the bridge.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="group p-8 lg:p-10 rounded-xl border border-white/10 bg-white/[0.02] hover:border-ravok-gold/40 hover:bg-white/[0.04] hover:shadow-[0_0_60px_-12px_rgba(169,129,71,0.15)] transition-all duration-300 hover:-translate-y-1"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <span className="text-ravok-gold/50 font-sans text-xs tracking-[0.2em] uppercase block mb-4">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-2xl font-heading text-ravok-gold uppercase tracking-wide mb-5 group-hover:text-ravok-beige/90 transition-colors">{item.title}</h3>
                <p className="text-white/85 font-sans text-base lg:text-lg leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Meet Our Team - arc connector feel via spacing */}
      <section className="min-h-screen flex flex-col justify-center py-24 lg:py-32 px-6 border-t border-white/5 relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute bottom-[30%] left-1/2 -translate-x-1/2 w-[80%] max-w-2xl h-px bg-gradient-to-r from-transparent via-ravok-gold/20 to-transparent" />
        </div>
        <div className="container mx-auto max-w-5xl relative z-10">
          <motion.h2
            className="text-5xl sm:text-6xl lg:text-7xl font-heading font-thin text-ravok-gold text-center leading-tight mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            Meet our team
          </motion.h2>
          <div className="grid sm:grid-cols-3 gap-12 lg:gap-16 mb-16">
            {[
              { name: "Amanda Aoki Rak", role: "CEO & Founder", image: "/images/team/amanda.jpg" },
              { name: "Thibault Dominici", role: "CFO", image: "/images/team/lois.png" },
              { name: "Lois Ungar", role: "Strategic Advisor", image: "/images/team/thibault.jpg" },
            ].map((member, i) => (
              <motion.div
                key={i}
                className="text-center group"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="mx-auto mb-4 w-fit rounded-full p-1 ring-2 ring-ravok-gold ring-offset-4 ring-offset-black shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_32px_rgba(0,0,0,0.4),0_0_48px_rgba(169,129,71,0.12)] transition-all duration-300 group-hover:ring-ravok-beige group-hover:shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_12px_40px_rgba(0,0,0,0.5),0_0_64px_rgba(169,129,71,0.2)]">
                  <div className="w-40 h-40 rounded-full overflow-hidden bg-white/10 flex items-center justify-center relative">
                    <span className="w-full h-full flex items-center justify-center text-ravok-gold/60 font-heading text-4xl">
                      {member.name.charAt(0)}
                    </span>
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover absolute inset-0 transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                </div>
                <h3 className="text-white font-heading text-xl uppercase tracking-wide">{member.name}</h3>
                <p className="text-ravok-slate font-sans text-base uppercase tracking-widest mt-2">{member.role}</p>
              </motion.div>
            ))}
          </div>
          <motion.p
            className="text-center text-white/80 font-sans text-lg lg:text-xl max-w-2xl mx-auto mb-14 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            In ten years, we want people to look back and ask: &ldquo;Remember when filmmakers didn't own their work?&rdquo; The same way we now ask: &ldquo;Remember when musicians didn't own their masters?&rdquo;
          </motion.p>
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 bg-ravok-gold text-black px-10 py-5 rounded-full font-sans text-base font-semibold uppercase tracking-widest hover:bg-ravok-beige transition-colors"
            >
              Join us
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Section 7: Ready to Build the Future? (CTA) - glow CTA */}
      <section className="min-h-screen flex flex-col justify-center relative px-6 py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/philosophy.png"
            alt=""
            className="w-full h-full object-cover opacity-30 grayscale"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,transparent_0%,black_70%)]" />
        </div>
        <div className="container mx-auto text-center relative z-10">
          <motion.h2
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-heading font-thin text-white uppercase tracking-wide drop-shadow-lg"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            Ready to build the future?
          </motion.h2>
          <motion.div
            className="mt-14 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 border-2 border-ravok-gold text-ravok-gold px-10 py-5 rounded-full font-sans text-base font-semibold uppercase tracking-widest hover:bg-ravok-gold hover:text-black transition-all duration-300 hover:shadow-[0_0_50px_rgba(169,129,71,0.35)]"
            >
              Get in touch
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
