"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { register as registerApi, setAuth } from "@/lib/api";
import { toast } from "@/lib/toast";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const data = await registerApi(name, email, password, passwordConfirmation);
      setAuth(data.token, data.user);
      router.push("/pending");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--ds-bg)] text-[var(--ds-ink)] selection:bg-ravok-gold selection:text-black overflow-x-hidden">
      <Navbar />

      <section className="min-h-screen flex flex-col justify-center pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-md">
          <motion.div
            className="rounded-2xl border border-[var(--ds-border)] bg-[rgba(232,228,218,0.04)] p-8 lg:p-10"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <h1 className="text-3xl lg:text-4xl font-heading font-bold text-[var(--ds-ink)] uppercase tracking-wide mb-2">
              Register
            </h1>
            <p className="text-ravok-slate font-sans text-sm mb-8">
              Create your RAVOK account to save submissions and access the portal.
            </p>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="register-name" className="block text-xs font-sans uppercase tracking-widest text-ravok-slate mb-2">
                  Full name
                </label>
                <input
                  id="register-name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-[var(--ds-bg)] border border-[var(--ds-border)] px-4 py-3 text-[var(--ds-ink)] font-sans placeholder:text-[var(--ds-ink-muted)] focus:border-ravok-gold focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label htmlFor="register-email" className="block text-xs font-sans uppercase tracking-widest text-ravok-slate mb-2">
                  Email
                </label>
                <input
                  id="register-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[var(--ds-bg)] border border-[var(--ds-border)] px-4 py-3 text-[var(--ds-ink)] font-sans placeholder:text-[var(--ds-ink-muted)] focus:border-ravok-gold focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label htmlFor="register-password" className="block text-xs font-sans uppercase tracking-widest text-ravok-slate mb-2">
                  Password
                </label>
                <input
                  id="register-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full bg-[var(--ds-bg)] border border-[var(--ds-border)] px-4 py-3 text-[var(--ds-ink)] font-sans placeholder:text-[var(--ds-ink-muted)] focus:border-ravok-gold focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label htmlFor="register-confirm" className="block text-xs font-sans uppercase tracking-widest text-ravok-slate mb-2">
                  Confirm password
                </label>
                <input
                  id="register-confirm"
                  type="password"
                  placeholder="••••••••"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                  minLength={8}
                  className="w-full bg-[var(--ds-bg)] border border-[var(--ds-border)] px-4 py-3 text-[var(--ds-ink)] font-sans placeholder:text-[var(--ds-ink-muted)] focus:border-ravok-gold focus:outline-none transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-ravok-gold text-black py-4 font-sans text-sm font-semibold uppercase tracking-widest hover:bg-ravok-beige transition-colors rounded-full disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account…" : "Create account"}
              </button>
            </form>

            <p className="mt-8 text-center text-ravok-slate font-sans text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-ravok-gold hover:text-ravok-beige underline underline-offset-2 transition-colors">
                Login
              </Link>
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
