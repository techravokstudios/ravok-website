"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getPublicCategories,
  getPublicFeaturedPosts,
  getPublicPosts,
  getPostImageUrl,
  type CategoryWithCount,
  type Post,
} from "@/lib/api";

const CATEGORY_ORDER = ["ravok-insights", "latest-analysis", "creator-stories", "data-research"];
const EXCERPT_LENGTH = 140;

function sortCategories(cats: CategoryWithCount[]): CategoryWithCount[] {
  const bySlug = Object.fromEntries(cats.map((c) => [c.slug, c]));
  return CATEGORY_ORDER.map((slug) => bySlug[slug]).filter(Boolean);
}

function getExcerpt(html: string, maxLen = EXCERPT_LENGTH): string {
  if (!html) return "";
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trim() + "…";
}

function PostCard({
  post,
  index = 0,
}: {
  post: Post;
  index?: number;
}) {
  const imageUrl = getPostImageUrl(post.featured_image);
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group flex flex-col rounded-2xl overflow-hidden bg-gradient-to-b from-white/[0.06] to-transparent border border-white/10 hover:border-ravok-gold/40 shadow-lg hover:shadow-xl hover:shadow-ravok-gold/5 transition-all duration-300"
    >
      {imageUrl ? (
        <Link
          href={`/insights/${post.slug}`}
          className="block aspect-[16/10] overflow-hidden bg-white/5"
        >
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      ) : (
        <div className="aspect-[16/10] bg-white/5 border-b border-white/5" />
      )}
      <div className="flex flex-1 flex-col p-6">
        {post.category && (
          <span className="mb-3 inline-block w-fit rounded-full bg-ravok-gold/15 px-3 py-1 font-sans text-xs font-medium uppercase tracking-wider text-ravok-gold">
            {post.category.name}
          </span>
        )}
        <Link href={`/insights/${post.slug}`} className="mb-2 block flex-1">
          <h3 className="font-heading text-xl font-semibold leading-snug text-white transition-colors line-clamp-2 group-hover:text-ravok-gold lg:text-2xl">
            {post.title}
          </h3>
        </Link>
        <p className="mb-4 font-sans text-sm leading-relaxed text-ravok-slate/90 line-clamp-3">
          {getExcerpt(post.body)}
        </p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
          {post.published_at && (
            <span className="inline-flex items-center gap-1.5 font-sans text-xs text-ravok-slate">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(post.published_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          )}
          <Link
            href={`/insights/${post.slug}`}
            className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-ravok-gold transition-colors hover:text-ravok-beige"
          >
            Read article
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default function InsightsPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [featured, setFeatured] = useState<Post[]>([]);
  const [postsByCategory, setPostsByCategory] = useState<Record<number, Post[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [cats, feat] = await Promise.all([
          getPublicCategories(),
          getPublicFeaturedPosts(5),
        ]);
        setCategories(sortCategories(cats));
        setFeatured(feat);

        const byCat: Record<number, Post[]> = {};
        for (const cat of sortCategories(cats)) {
          const res = await getPublicPosts({ category_id: cat.id, per_page: 3, page: 1 });
          byCat[cat.id] = res.data ?? [];
        }
        setPostsByCategory(byCat);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load insights");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-ravok-gold selection:text-black overflow-x-hidden">
      <Navbar />

      {error && (
        <div className="container mx-auto max-w-6xl px-6 pt-28">
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 font-sans text-sm text-red-400">
            {error}
          </div>
        </div>
      )}

      {loading ? (
        <section className="px-6 py-24">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 animate-pulse rounded-full bg-ravok-gold" />
              <p className="font-sans text-ravok-slate">Loading insights…</p>
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* Page title */}
          <header className="border-b border-white/10 px-6 pt-32 pb-12">
            <div className="container mx-auto max-w-6xl">
              <motion.h1
                className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Insights
              </motion.h1>
              <motion.p
                className="mt-3 font-sans text-base text-ravok-slate/90"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Analysis, stories, and research from the RAVOK team.
              </motion.p>
              <motion.div
                className="mt-4 h-0.5 w-16 bg-ravok-gold"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ transformOrigin: "left" }}
              />
            </div>
          </header>

          {/* Featured Posts */}
          {featured.length > 0 && (
            <section id="featured" className="px-6 py-16 lg:py-20">
              <div className="container mx-auto max-w-6xl">
                <motion.div
                  className="mb-10"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <p className="mb-1 font-sans text-xs font-medium uppercase tracking-widest text-ravok-slate">
                    Editor’s pick
                  </p>
                  <h2 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    Featured Posts
                  </h2>
                </motion.div>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {featured.map((post, i) => (
                    <PostCard key={post.id} post={post} index={i} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Category sections */}
          {categories.map((category) => {
            const posts = postsByCategory[category.id] ?? [];
            return (
              <section
                key={category.id}
                id={category.slug}
                className="border-t border-white/10 px-6 py-16 lg:py-20"
              >
                <div className="container mx-auto max-w-6xl">
                  <motion.div
                    className="mb-10 flex flex-wrap items-end justify-between gap-4"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <div>
                      <h2 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
                        {category.name}
                      </h2>
                      {posts.length > 0 && (
                        <p className="mt-1 font-sans text-sm text-ravok-slate">
                          {posts.length} post{posts.length !== 1 ? "s" : ""} in this category
                        </p>
                      )}
                    </div>
                    {posts.length > 0 && (
                      <Link
                        href={`/insights/category/${category.slug}`}
                        className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-ravok-gold transition-colors hover:text-ravok-beige"
                      >
                        View all
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    )}
                  </motion.div>

                  {posts.length === 0 ? (
                    <motion.p
                      className="font-sans text-ravok-slate/80"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                    >
                      No posts in this category yet.
                    </motion.p>
                  ) : (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                      {posts.map((post, i) => (
                        <PostCard key={post.id} post={post} index={i} />
                      ))}
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </>
      )}

      <Footer />
    </main>
  );
}
