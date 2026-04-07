"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getPublicPostBySlug,
  getPostImageUrl,
  getPublicPostComments,
  createPublicPostComment,
  getStoredUser,
  type Post,
  type PostComment,
} from "@/lib/api";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function InsightArticleClient({ slug }: { slug: string }) {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loading, setLoading] = useState(!!slug);
  const [notFoundState, setNotFoundState] = useState(false);

  const [commentName, setCommentName] = useState("");
  const [commentEmail, setCommentEmail] = useState("");
  const [commentBody, setCommentBody] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [user, setUser] = useState<ReturnType<typeof getStoredUser>>(null);
  useEffect(() => {
    setUser(getStoredUser());
  }, []);
  const isLoggedIn = !!user;

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFoundState(false);
    getPublicPostBySlug(slug)
      .then(setPost)
      .catch((e) => {
        if (e instanceof Error && e.message.includes("Not found")) {
          setNotFoundState(true);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!post) return;
    getPublicPostComments(slug)
      .then(setComments)
      .catch(() => setComments([]));
  }, [post, slug]);

  async function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isLoggedIn) {
      if (!commentBody.trim()) return;
    } else {
      if (!commentName.trim() || !commentBody.trim()) return;
    }
    setCommentSubmitting(true);
    try {
      if (isLoggedIn && user) {
        await createPublicPostComment(slug, { body: commentBody.trim() });
      } else {
        await createPublicPostComment(slug, {
          author_name: commentName.trim(),
          author_email: commentEmail.trim() || null,
          body: commentBody.trim(),
        });
      }
      setCommentName("");
      setCommentEmail("");
      setCommentBody("");
      toast.success("Comment submitted and pending approval.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to submit comment");
    } finally {
      setCommentSubmitting(false);
    }
  }

  if (notFoundState) {
    return (
      <main className="min-h-screen bg-black text-white selection:bg-ravok-gold selection:text-black overflow-x-hidden">
        <Navbar />
        <div className="pt-32 pb-24 px-6">
          <div className="container mx-auto max-w-3xl">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
              <h1 className="font-heading text-2xl font-bold text-white">Article not found</h1>
              <p className="mt-2 font-sans text-sm text-ravok-slate">
                The article you are looking for does not exist or has been removed.
              </p>
              <div className="mt-4">
                <Link
                  href="/insights"
                  className="inline-flex items-center gap-2 font-sans text-sm font-medium text-ravok-slate transition-colors hover:text-ravok-gold"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to Insights
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (loading || !post) {
    return (
      <main className="min-h-screen bg-black text-white selection:bg-ravok-gold selection:text-black overflow-x-hidden">
        <Navbar />
        <div className="pt-32 pb-24 px-6">
          <div className="container mx-auto max-w-3xl">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 animate-pulse rounded-full bg-ravok-gold" />
              <p className="font-sans text-ravok-slate">Loading article…</p>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const imageUrl = getPostImageUrl(post.featured_image);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-ravok-gold selection:text-black overflow-x-hidden">
      <Navbar />

      <article className="pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-3xl">
          {/* Back link */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 font-sans text-sm font-medium text-ravok-slate transition-colors hover:text-ravok-gold"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Insights
            </Link>
          </motion.div>

          {/* Featured image */}
          {imageUrl && (
            <motion.div
              className="mb-10 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <img
                src={imageUrl}
                alt=""
                className="aspect-[16/10] w-full object-cover"
              />
            </motion.div>
          )}

          {/* Meta: category + date */}
          <motion.div
            className="mb-6 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {post.category && (
              <span className="inline-block rounded-full bg-ravok-gold/15 px-3 py-1 font-sans text-xs font-medium uppercase tracking-wider text-ravok-gold">
                {post.category.name}
              </span>
            )}
            {post.published_at && (
              <span className="inline-flex items-center gap-1.5 font-sans text-sm text-ravok-slate">
                <Calendar className="h-4 w-4" />
                {new Date(post.published_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
          </motion.div>

          {/* Title */}
          <motion.h1
            className="font-heading text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {post.title}
          </motion.h1>

          {/* Article body */}
          <motion.div
            className="article-body mt-10 font-sans text-lg leading-relaxed text-white/90 [&_a]:text-ravok-gold [&_a]:underline [&_a]:hover:text-ravok-beige [&_img]:my-6 [&_img]:w-full [&_img]:rounded-xl [&_img]:border [&_img]:border-white/10 [&_p]:mb-6 [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2 [&_h2]:font-heading [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h3]:font-heading [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-white [&_blockquote]:border-l-2 [&_blockquote]:border-ravok-gold/50 [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:text-ravok-slate [&_blockquote]:my-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            dangerouslySetInnerHTML={{ __html: post.body }}
          />

          {/* Comments */}
          <motion.section
            className="mt-20 border-t border-white/10 pt-12"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <h2 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Comments
            </h2>
            <p className="mt-1 font-sans text-sm text-ravok-slate">
              {comments.length === 0
                ? "No comments yet. Be the first to share your thoughts."
                : `${comments.length} comment${comments.length !== 1 ? "s" : ""}`}
            </p>

            {comments.length > 0 && (
              <ul className="mt-8 space-y-6">
                {comments.map((c) => (
                  <li
                    key={c.id}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
                  >
                    <p className="font-sans font-medium text-white">{c.author_name}</p>
                    <p className="mt-0.5 font-sans text-xs text-ravok-slate">
                      {new Date(c.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <p className="mt-3 font-sans text-sm leading-relaxed text-white/90">
                      {c.body}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <h3 className="font-heading text-lg font-semibold text-white">
                Leave a comment
              </h3>
              <form onSubmit={handleCommentSubmit} className="mt-6 space-y-5">
                {!isLoggedIn && (
                  <>
                    <div>
                      <Label
                        htmlFor="comment-name"
                        className="font-sans text-sm font-medium text-white/90"
                      >
                        Name
                      </Label>
                      <Input
                        id="comment-name"
                        value={commentName}
                        onChange={(e) => setCommentName(e.target.value)}
                        className="mt-2 rounded-xl border-white/20 bg-black/30 font-sans text-white placeholder:text-ravok-slate/60"
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="comment-email"
                        className="font-sans text-sm font-medium text-white/90"
                      >
                        Email (optional)
                      </Label>
                      <Input
                        id="comment-email"
                        type="email"
                        value={commentEmail}
                        onChange={(e) => setCommentEmail(e.target.value)}
                        className="mt-2 rounded-xl border-white/20 bg-black/30 font-sans text-white placeholder:text-ravok-slate/60"
                        placeholder="you@example.com"
                      />
                    </div>
                  </>
                )}
                <div>
                  <Label
                    htmlFor="comment-body"
                    className="font-sans text-sm font-medium text-white/90"
                  >
                    Comment
                  </Label>
                  <textarea
                    id="comment-body"
                    value={commentBody}
                    onChange={(e) => setCommentBody(e.target.value)}
                    rows={4}
                    className="mt-2 w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 font-sans text-sm text-white placeholder:text-ravok-slate/60 focus:border-ravok-gold/50 focus:outline-none focus:ring-1 focus:ring-ravok-gold/30"
                    placeholder="Share your thoughts…"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="rounded-xl bg-ravok-gold px-6 py-2.5 font-sans text-sm font-medium text-black transition-colors hover:bg-ravok-gold/90"
                  disabled={
                    commentSubmitting ||
                    !commentBody.trim() ||
                    (!isLoggedIn && !commentName.trim())
                  }
                >
                  {commentSubmitting ? "Submitting…" : "Post comment"}
                </Button>
              </form>
            </div>
          </motion.section>
        </div>
      </article>

      <Footer />
    </main>
  );
}
