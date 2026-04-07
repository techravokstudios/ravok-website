"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getPublicCategories,
  getPublicPosts,
  getPostImageUrl,
  type CategoryWithCount,
  type Post,
} from "@/lib/api";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function InsightsCategoryClient({ slug }: { slug: string }) {
  const [category, setCategory] = useState<CategoryWithCount | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(!!slug);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const cats = await getPublicCategories();
        const cat = cats.find((c) => c.slug === slug);
        if (!cat) {
          setError("Category not found");
          setLoading(false);
          return;
        }
        setCategory(cat);
        const res = await getPublicPosts({
          category_id: cat.id,
          per_page: 12,
          page: 1,
        });
        setPosts(res.data ?? []);
        setLastPage(res.last_page ?? 1);
        setPage(1);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  async function loadPage(p: number) {
    if (!category) return;
    try {
      const res = await getPublicPosts({
        category_id: category.id,
        per_page: 12,
        page: p,
      });
      setPosts(res.data ?? []);
      setPage(res.current_page ?? p);
      setLastPage(res.last_page ?? 1);
    } catch {
      setError("Failed to load");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white selection:bg-ravok-gold selection:text-black overflow-x-hidden">
      <Navbar />

      <div className="pt-32 pb-24 px-6">
        <div className="container mx-auto">
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-ravok-slate font-sans text-sm uppercase tracking-widest hover:text-ravok-gold transition-colors mb-12"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Insights
          </Link>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 font-sans text-sm text-red-400 mb-8">
              {error}
            </div>
          )}

          {loading ? (
            <p className="font-sans text-ravok-slate">Loading…</p>
          ) : category ? (
            <>
              <h1 className="text-4xl lg:text-5xl font-heading font-bold text-ravok-gold uppercase tracking-wide mb-12">
                {category.name}
              </h1>

              {posts.length === 0 ? (
                <p className="text-ravok-slate font-sans text-lg">No posts in this category yet.</p>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {posts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/insights/${post.slug}`}
                        className="block group p-4 rounded-lg bg-black/30 border border-white/5 hover:border-ravok-gold/30 transition-colors"
                      >
                        {getPostImageUrl(post.featured_image) && (
                          <div className="aspect-[4/3] rounded-lg overflow-hidden border border-white/10 mb-4">
                            <img
                              src={getPostImageUrl(post.featured_image)!}
                              alt=""
                              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                            />
                          </div>
                        )}
                        <h2 className="font-heading font-semibold text-white group-hover:text-ravok-gold transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                        {post.published_at && (
                          <p className="text-ravok-slate font-sans text-sm mt-1">
                            {new Date(post.published_at).toLocaleDateString()}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>

                  {lastPage > 1 && (
                    <div className="flex items-center justify-between border-t border-white/10 pt-6">
                      <p className="font-sans text-sm text-ravok-slate">
                        Page {page} of {lastPage}
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => loadPage(page - 1)}
                          disabled={page <= 1}
                          className="inline-flex items-center gap-2 border border-white/20 text-white px-4 py-2 rounded font-sans text-sm hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Previous
                        </button>
                        <button
                          type="button"
                          onClick={() => loadPage(page + 1)}
                          disabled={page >= lastPage}
                          className="inline-flex items-center gap-2 border border-white/20 text-white px-4 py-2 rounded font-sans text-sm hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          ) : !loading && slug ? (
            <p className="font-sans text-ravok-slate">Category not found.</p>
          ) : null}
        </div>
      </div>

      <Footer />
    </main>
  );
}
