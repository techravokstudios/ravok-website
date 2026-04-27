"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { Clock } from "lucide-react";
import { useEffect } from "react";
import { getStoredUser, logout, me, setAuth, getToken } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function PendingPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role === "admin" || user.status === "approved") {
      router.replace(user.role === "admin" ? "/admin" : "/investor");
      return;
    }
    // Refresh from server in case admin approved after this user logged in
    const token = getToken();
    if (!token) return;
    me()
      .then((fresh) => {
        // Update local cache
        setAuth(token, fresh);
        if (fresh.role === "admin" || fresh.status === "approved") {
          router.replace(fresh.role === "admin" ? "/admin" : "/investor");
        }
      })
      .catch(() => {
        // ignore - stay on pending
      });
  }, [router]);

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <main className="min-h-screen bg-[var(--ds-bg)] text-[var(--ds-ink)] selection:bg-ravok-gold selection:text-black overflow-x-hidden">
      <Navbar />

      <section className="min-h-screen flex flex-col justify-center pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-md">
          <motion.div
            className="rounded-2xl border border-[var(--ds-border)] bg-[rgba(232,228,218,0.04)] p-8 lg:p-10 text-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <div className="mx-auto w-16 h-16 rounded-full border-2 border-ravok-gold/50 flex items-center justify-center mb-6">
              <Clock className="w-8 h-8 text-ravok-gold" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-heading font-normal text-[var(--ds-ink)] uppercase tracking-wide mb-3">
              Account pending approval
            </h1>
            <p className="text-ravok-slate font-sans text-sm leading-relaxed mb-8">
              Your investor account has been created and is awaiting approval by an administrator. You will be able to access the investor dashboard once your account is approved.
            </p>
            <p className="text-[var(--ds-ink-dim)] font-sans text-xs mb-8">
              If you have questions, please contact us at{" "}
              <a href="mailto:contact@ravokstudios.com" className="text-ravok-gold hover:text-ravok-beige underline">
                contact@ravokstudios.com
              </a>
            </p>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full border border-[var(--ds-border-strong)] text-[var(--ds-ink)] py-3 font-sans text-[0.68rem] font-semibold uppercase tracking-[0.2em] hover:border-ravok-gold hover:text-ravok-gold hover:-translate-y-px transition-all duration-[250ms] ease-[cubic-bezier(0.2,0.6,0.2,1)] rounded-full"
            >
              Sign out
            </button>
            <p className="mt-6 text-center text-ravok-slate font-sans text-sm">
              <Link href="/" className="text-ravok-gold hover:text-ravok-beige underline underline-offset-2">
                Back to home
              </Link>
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
