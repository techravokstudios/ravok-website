"use client";

import { motion } from "framer-motion";
import { Video, DollarSign, Monitor, User, Mail } from "lucide-react";

export default function Partners() {
    const partners = [
        {
            type: "Co-Producers",
            icon: Video,
            desc: "Experienced producers who want equity in creator-driven ventures.",
            bring: "Packaging expertise, talent relationships, production knowledge.",
            get: "Equity positions, producing credits, portfolio diversification."
        },
        {
            type: "Financiers",
            icon: DollarSign,
            desc: "Capital partners who see the creator economy opportunity.",
            bring: "Smart capital, patient approach, industry understanding.",
            get: "Portfolio exposure across multiple ventures, transparent structures, creative + financial upside."
        },
        {
            type: "Distribution Partners",
            icon: Monitor,
            desc: "Streamers, sales agents, distributors seeking original IP.",
            bring: "Distribution pathways, market access, festival relationships.",
            get: "First-look at creator-owned IP, festival-positioned projects, franchise potential."
        },
        {
            type: "Operational Partners",
            icon: User,
            desc: "Operators, attorneys, strategists who want to build institutions.",
            bring: "COO bandwidth, legal expertise, marketing strategy, finance operations.",
            get: "Equity, ground-floor involvement, meaningful impact."
        },
    ];

    return (
        <section id="investors" className="relative py-32 bg-black text-white overflow-hidden rounded-t-3xl shadow-2xl isolate">
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/partners.png"
                    alt="Partners Background"
                    className="w-full h-full object-cover opacity-30 grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl lg:text-6xl font-heading mb-6 tracking-wide leading-tight text-gray-200">
                            The Future of Media <br />
                            <span className="text-white">Won't Be Built by Gatekeepers.</span>
                        </h2>
                        <p className="text-xl text-gray-400 font-sans font-light mb-12 max-w-2xl mx-auto leading-relaxed">
                            It will be built by creators, partners, and investors who believe ownership matters.
                        </p>

                        <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold">
                            To scale this model, we need the right partners.
                        </p>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {partners.map((p, i) => (
                        <motion.div
                            key={i}
                            className="bg-zinc-900/40 backdrop-blur-sm border border-white/10 p-8 rounded-lg hover:bg-zinc-900/60 transition-all duration-300 group"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            whileHover={{ y: -5 }}
                        >
                            <div className="mb-6">
                                <p.icon className="w-8 h-8 text-ravok-gold mb-4" />
                                <h3 className="text-xl font-heading text-ravok-gold mb-2">{p.type}</h3>
                                <p className="text-xs text-gray-300 leading-relaxed font-sans mb-6 min-h-[40px]">
                                    {p.desc}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-[10px] text-white uppercase tracking-wider mb-2 font-bold opacity-80">What you bring:</h4>
                                    <p className="text-[10px] text-gray-400 leading-relaxed border-l border-white/10 pl-3">
                                        {p.bring}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] text-white uppercase tracking-wider mb-2 font-bold opacity-80">What you get:</h4>
                                    <p className="text-[10px] text-gray-400 leading-relaxed border-l border-white/10 pl-3">
                                        {p.get}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Email Contact Section */}
                <motion.div
                    className="mt-24 relative"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 bg-zinc-900/50 backdrop-blur-sm border-y border-white/10 px-6 sm:px-8 py-8 relative overflow-hidden">
                        <Mail className="w-8 h-8 text-ravok-gold flex-shrink-0" />
                        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                            <span className="text-base text-gray-300 whitespace-nowrap">Questions? Email us at:</span>
                            <motion.a
                                href="mailto:contact@ravokstudios.com"
                                className="text-xl lg:text-2xl text-ravok-gold hover:text-white transition-colors font-heading break-all sm:break-normal"
                                whileHover={{ scale: 1.05 }}
                            >
                                contact@ravokstudios.com
                            </motion.a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
