'use client';

import { useState } from 'react';
import { confessionsApi } from '@/lib/api/v1/confessions';
import { ConfessionCategory } from '@/lib/types/confessions';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Lock, Eye, Sparkles } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES: ConfessionCategory[] = [
  'Development Hell',
  'Shady Accounting',
  'Gatekeeping',
  'Equity Theft',
  'The Waiting Game',
  'Festival Politics',
  'Streaming Nightmares',
  'Work For Hire Horror',
  'The Meeting That Changed Nothing',
  'General Confession',
];

export default function SubmitConfessionPage() {
  const [formData, setFormData] = useState({
    body: '',
    category: '' as ConfessionCategory | '',
    notify_email: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.body.trim()) {
        setError('Please enter a confession');
        setLoading(false);
        return;
      }
      if (formData.body.length < 20) {
        setError('Confession must be at least 20 characters');
        setLoading(false);
        return;
      }
      if (formData.body.length > 500) {
        setError('Confession must be 500 characters or less');
        setLoading(false);
        return;
      }

      const payload = {
        body: formData.body,
        ...(formData.category && { category: formData.category }),
        ...(formData.notify_email && { notify_email: formData.notify_email }),
      };

      await confessionsApi.submit(payload);
      setSubmitted(true);
      setFormData({ body: '', category: '', notify_email: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to submit confession');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--ds-bg)] text-[var(--ds-ink)] selection:bg-ravok-gold selection:text-black">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 pt-32 pb-24">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/insights"
            className="font-sans text-sm text-ravok-slate hover:text-ravok-gold transition-colors mb-6 inline-block"
          >
            ← Back to Blog
          </Link>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-[var(--ds-ink)] sm:text-5xl mb-3">
            Share Your Confession
          </h1>
          <p className="font-sans text-base text-ravok-slate/90">
            Completely anonymous. No names, no email required. Just the truth.
          </p>
          <div className="mt-4 h-0.5 w-16 bg-ravok-gold" />
        </motion.div>

        {/* Form Card */}
        <motion.div
          className="bg-gradient-to-b from-[rgba(232,228,218,0.06)] to-transparent rounded-2xl border border-[var(--ds-border)] p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {submitted && (
            <div className="mb-6 p-4 bg-ravok-gold/10 border border-ravok-gold/30 rounded-xl text-center">
              <p className="text-ravok-gold font-sans font-medium">
                Your confession has been submitted for moderation
              </p>
              <p className="text-sm text-ravok-slate mt-1 font-sans">
                Thank you for your honesty. Our team will review it shortly.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-red-400 text-sm font-sans">{error}</p>
              </div>
            )}

            {/* Confession text */}
            <div>
              <label htmlFor="body" className="block font-sans text-sm font-medium text-[var(--ds-ink)] mb-2">
                Your Confession *
              </label>
              <textarea
                id="body"
                name="body"
                value={formData.body}
                onChange={handleChange}
                placeholder="Share what's really on your mind... (20-500 characters)"
                className="w-full px-4 py-3 bg-[rgba(232,228,218,0.04)] border border-[var(--ds-border)] rounded-xl text-[var(--ds-ink)] placeholder:text-ravok-slate/60 font-sans focus:outline-none focus:ring-2 focus:ring-ravok-gold/50 focus:border-ravok-gold/50 resize-none transition-colors"
                rows={6}
                disabled={loading}
              />
              <div className="mt-2 flex items-center justify-between">
                <p className="font-sans text-xs text-ravok-slate">
                  {formData.body.length}/500 characters
                </p>
                {formData.body.length < 20 && formData.body.length > 0 && (
                  <p className="font-sans text-xs text-ravok-gold">
                    At least 20 characters required
                  </p>
                )}
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block font-sans text-sm font-medium text-[var(--ds-ink)] mb-2">
                Category (Optional)
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[rgba(232,228,218,0.04)] border border-[var(--ds-border)] rounded-xl text-[var(--ds-ink)] font-sans focus:outline-none focus:ring-2 focus:ring-ravok-gold/50 focus:border-ravok-gold/50 transition-colors"
                disabled={loading}
              >
                <option value="" className="bg-[var(--ds-bg)]">Select a category...</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-[var(--ds-bg)]">{cat}</option>
                ))}
              </select>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="notify_email" className="block font-sans text-sm font-medium text-[var(--ds-ink)] mb-2">
                Email (Optional)
              </label>
              <input
                id="notify_email"
                type="email"
                name="notify_email"
                value={formData.notify_email}
                onChange={handleChange}
                placeholder="your@email.com (only for featured confession notifications)"
                className="w-full px-4 py-2 bg-[rgba(232,228,218,0.04)] border border-[var(--ds-border)] rounded-xl text-[var(--ds-ink)] placeholder:text-ravok-slate/60 font-sans focus:outline-none focus:ring-2 focus:ring-ravok-gold/50 focus:border-ravok-gold/50 transition-colors"
                disabled={loading}
              />
              <p className="mt-1 font-sans text-xs text-ravok-slate">
                We&apos;ll notify you if your confession is featured. Your identity remains secret.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !formData.body.trim()}
              className="w-full bg-ravok-gold text-black px-8 py-3 rounded-full font-sans font-bold text-sm tracking-widest uppercase hover:bg-ravok-beige transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Share Your Wisdom'}
            </button>

            {/* Disclaimer */}
            <div className="pt-4 border-t border-[var(--ds-border)]">
              <p className="font-sans text-xs text-ravok-slate/60">
                By submitting a confession, you agree that it may be published anonymously on our
                platform. RAVOK takes no responsibility for unverified claims made in confessions.
              </p>
            </div>
          </form>
        </motion.div>

        {/* Info cards */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            { icon: Lock, title: 'Completely Anonymous', desc: 'No names, emails, or identifying information required.' },
            { icon: Eye, title: 'Moderated for Safety', desc: 'We review all confessions before publishing to keep the community safe.' },
            { icon: Sparkles, title: 'Featured Confessions', desc: 'Amanda may respond publicly to confessions that spark important conversations.' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              className="bg-gradient-to-b from-[rgba(232,228,218,0.04)] to-transparent rounded-2xl border border-[var(--ds-border)] p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
            >
              <item.icon className="h-6 w-6 text-ravok-gold mb-3" />
              <h3 className="font-heading text-lg text-[var(--ds-ink)] mb-2">{item.title}</h3>
              <p className="font-sans text-sm text-ravok-slate leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
