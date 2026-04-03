"use client";

import { Instagram, Linkedin, Facebook, ArrowUp } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <footer className="bg-black text-white border-t border-white/10 font-sans rounded-t-3xl shadow-2xl relative">
      {/* Main Split Layout */}
      <div className="flex flex-col lg:flex-row min-h-[400px] relative z-10">
        {/* Background Image - Fixed Size */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/footer.png"
            alt="Partners Background"
            className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>
        {/* Left Side - Logo */}
        <motion.div
          className="w-full lg:w-[35%] border-r border-white/10 flex items-center justify-center p-12 lg:p-0 relative z-10"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Link href="/" className="group">
            <motion.img
              src="/images/logo.png"
              alt="RAVOK"
              className="h-16 lg:h-24 w-auto object-contain opacity-80"
              whileHover={{ opacity: 1, scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </Link>
        </motion.div>

        {/* Right Side - Content */}
        <motion.div
          className="w-full lg:w-[65%] p-12 lg:p-24 relative z-10 flex flex-col justify-between"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8">
            {/* Company */}
            <motion.div className="space-y-6" variants={itemVariants}>
              <h4 className="text-ravok-gold text-xl font-heading tracking-wide">Company</h4>
              <nav className="flex flex-col space-y-4 text-sm text-gray-400 font-light tracking-wide">
                {[
                  { href: "/", label: "Home" },
                  { href: "/about-us", label: "About Us" },
                  { href: "/contact-us", label: "Contact Us" },
                  { href: "/insights", label: "Insights" }
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group relative inline-block w-fit"
                  >
                    <span className="group-hover:text-white transition-colors duration-300">
                      {link.label}
                    </span>
                    <motion.span
                      className="absolute -bottom-1 left-0 w-0 h-px bg-ravok-gold group-hover:w-full transition-all duration-300"
                    />
                  </Link>
                ))}
              </nav>
            </motion.div>

            {/* Policies */}
            <motion.div className="space-y-6" variants={itemVariants}>
              <h4 className="text-ravok-gold text-xl font-heading tracking-wide">Policies</h4>
              <nav className="flex flex-col space-y-4 text-sm text-gray-400 font-light tracking-wide">
                {[
                  { href: "/terms-and-conditions", label: "Terms and Conditions" },
                  { href: "/privacy-policy", label: "Privacy Policy" }
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group relative inline-block w-fit"
                  >
                    <span className="group-hover:text-white transition-colors duration-300">
                      {link.label}
                    </span>
                    <motion.span
                      className="absolute -bottom-1 left-0 w-0 h-px bg-ravok-gold group-hover:w-full transition-all duration-300"
                    />
                  </Link>
                ))}
              </nav>
            </motion.div>

            {/* Follow Us */}
            <motion.div className="space-y-6" variants={itemVariants}>
              <h4 className="text-ravok-gold text-xl font-heading tracking-wide">Follow Us</h4>
              <div className="flex gap-4">
                {[
                  { Icon: Facebook, href: "https://www.facebook.com/people/Ravok-Studios/61578824300063/" },
                  { Icon: Instagram, href: "https://www.instagram.com/ravokstudios?igsh=NTc4MTIwNjQ2YQ==" },
                  { Icon: Linkedin, href: "https://www.linkedin.com/company/ravok-studios/?viewAsMember=true" }
                ].map(({ Icon, href }, i) => (
                  <motion.a
                    key={i}
                    href={href}
                    className="text-gray-400"
                    whileHover={{
                      scale: 1.2,
                      color: "var(--color-ravok-gold)",
                      rotate: 5
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Circular Dot Button */}
          <motion.div
            className="absolute bottom-12 right-12 lg:right-24 z-10"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <motion.button
              onClick={scrollToTop}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group bg-black/20 backdrop-blur-sm"
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.9 }}
              aria-label="Scroll to top"
            >
              <div className="w-1.5 h-1.5 bg-white rounded-full group-hover:bg-ravok-gold transition-colors" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Copyright Bar */}
      <motion.div
        className="border-t border-white/10 py-6 text-center relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-[10px] text-gray-500 font-sans tracking-widest uppercase">
          © 2026 Ravok Studios | All Rights Reserved.
        </p>
      </motion.div>

      {/* Fixed Scroll To Top */}
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <motion.button
          onClick={scrollToTop}
          className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center rounded"
          whileHover={{
            scale: 1.1,
            backgroundColor: "rgba(169, 129, 71, 0.2)",
            borderColor: "var(--color-ravok-gold)"
          }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowUp className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </footer>
  );
}
