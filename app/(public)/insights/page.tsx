/**
 * Insights Page
 * Displays Hollywood Confessions wall + Blog/Articles feed
 */

import { ConfessionWall } from '@/modules/confessions/components/ConfessionWall';
import Link from 'next/link';

export const metadata = {
  title: 'Insights | RAVOK Studios',
  description: 'Industry insights, stories, and anonymous confessions from Hollywood creators',
};

export default function InsightsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gray-50 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Insights, Stories & Confessions
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Industry trends, personal stories, and unfiltered truths from Hollywood creators.
            </p>
          </div>
        </div>
      </section>

      {/* Filter/Nav Bar */}
      <section className="border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex gap-4">
              <button className="text-sm font-medium text-gray-900 pb-2 border-b-2 border-gray-900">
                All
              </button>
              <button className="text-sm font-medium text-gray-500 hover:text-gray-900 pb-2 border-b-2 border-transparent hover:border-gray-300">
                Blog
              </button>
              <button className="text-sm font-medium text-gray-500 hover:text-gray-900 pb-2 border-b-2 border-transparent hover:border-gray-300">
                Confessions
              </button>
            </div>

            <div className="w-full sm:w-auto flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
              <span className="text-gray-600">🔍</span>
              <input
                type="search"
                placeholder="Search..."
                className="bg-transparent outline-none text-sm flex-1 sm:w-40"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Confession Wall Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Hollywood Confessions</h2>
            <Link
              href="/confessions/submit"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Submit Your Confession →
            </Link>
          </div>

          <ConfessionWall initialLimit={12} />
        </div>
      </section>

      {/* Blog/Articles Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-200">
        <h2 className="text-2xl font-bold mb-8">Articles & Insights</h2>
        <div className="text-center py-12 text-gray-500">
          <p>Blog articles coming soon...</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Have a story to tell?</h2>
          <p className="text-gray-300 mb-6">
            Share your unfiltered confession anonymously. Join hundreds of creators speaking their truth.
          </p>
          <Link
            href="/confessions/submit"
            className="inline-block px-8 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Submit Your Confession
          </Link>
        </div>
      </section>
    </main>
  );
}
