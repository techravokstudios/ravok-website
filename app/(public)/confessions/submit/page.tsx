'use client';

/**
 * Confession Submission Page
 * Anonymous form for submitting confessions
 */

import { useState } from 'react';
import { confessionsApi } from '@/lib/api/v1/confessions';
import { ConfessionCategory } from '@/lib/types/entities';

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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate
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

      // Submit
      const payload = {
        body: formData.body,
        ...(formData.category && { category: formData.category }),
        ...(formData.notify_email && { notify_email: formData.notify_email }),
      };

      await confessionsApi.submitConfession(payload);

      setSubmitted(true);
      setFormData({ body: '', category: '', notify_email: '' });

      // Auto-dismiss success after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to submit confession');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Share Your Confession</h1>
          <p className="text-gray-600">
            Completely anonymous. No names, no email required. Just the truth.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {submitted && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
              <p className="text-green-800 font-medium">
                ✓ Your confession has been submitted for moderation
              </p>
              <p className="text-sm text-green-700 mt-1">
                Thank you for your honesty. Our team will review it shortly.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Confession text (required) */}
            <div>
              <label htmlFor="body" className="block text-sm font-medium text-gray-900 mb-2">
                Your Confession *
              </label>
              <textarea
                id="body"
                name="body"
                value={formData.body}
                onChange={handleChange}
                placeholder="Share what's really on your mind... (20-500 characters)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={6}
                disabled={loading}
              />
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  {formData.body.length}/500 characters
                </p>
                {formData.body.length < 20 && formData.body.length > 0 && (
                  <p className="text-xs text-amber-600">
                    At least 20 characters required
                  </p>
                )}
              </div>
            </div>

            {/* Category (optional) */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-900 mb-2">
                Category (Optional)
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="">Select a category...</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Email notification (optional) */}
            <div>
              <label
                htmlFor="notify_email"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Email (Optional)
              </label>
              <input
                id="notify_email"
                type="email"
                name="notify_email"
                value={formData.notify_email}
                onChange={handleChange}
                placeholder="your@email.com (only for featured confession notifications)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <p className="mt-1 text-xs text-gray-500">
                We'll notify you if your confession is featured. Your identity remains secret.
              </p>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || !formData.body.trim()}
              className="w-full px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Share Your Wisdom'}
            </button>

            {/* Disclaimer */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                By submitting a confession, you agree that it may be published anonymously on our
                platform. RAVOK takes no responsibility for unverified claims made in confessions.
              </p>
            </div>
          </form>
        </div>

        {/* Info box */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-2xl mb-2">🔒</p>
            <h3 className="font-medium text-gray-900 mb-2">Completely Anonymous</h3>
            <p className="text-sm text-gray-600">
              No names, emails, or identifying information required.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-2xl mb-2">👁️</p>
            <h3 className="font-medium text-gray-900 mb-2">Moderated for Safety</h3>
            <p className="text-sm text-gray-600">
              We review all confessions before publishing to keep the community safe.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-2xl mb-2">✨</p>
            <h3 className="font-medium text-gray-900 mb-2">Featured Confessions</h3>
            <p className="text-sm text-gray-600">
              Amanda may respond publicly to confessions that spark important conversations.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
