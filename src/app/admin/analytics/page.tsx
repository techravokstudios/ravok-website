"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDocumentAnalytics, type DocumentStats } from "@/lib/api/v1/analytics";

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m < 60) return `${m}m ${s}s`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function AnalyticsPage() {
  const [docs, setDocs] = useState<DocumentStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocumentAnalytics()
      .then(setDocs)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-ravok-gold">
          Document Analytics
        </h1>
        <p className="mt-1 font-sans text-sm text-ravok-slate">
          Track who viewed your documents and for how long
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <p className="font-sans text-ravok-slate">Loading…</p>
        </div>
      ) : docs.length === 0 ? (
        <div className="rounded border border-white/10 bg-white/5 p-8 text-center font-sans text-sm text-ravok-slate">
          No documents have been viewed yet.
        </div>
      ) : (
        <div className="space-y-3">
          {docs.map((doc) => (
            <Link
              key={doc.id}
              href={`/admin/analytics/${doc.id}`}
              className="block rounded-lg border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-ravok-gold/30 hover:bg-white/[0.06]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-sans text-sm font-medium text-white">
                    {doc.name}
                  </h2>
                  <p className="mt-0.5 font-sans text-xs text-ravok-slate">
                    {doc.category || "Uncategorized"}
                  </p>
                </div>
                {doc.last_viewed_at && (
                  <span className="shrink-0 font-sans text-[10px] uppercase tracking-[0.15em] text-white/30">
                    {timeAgo(doc.last_viewed_at)}
                  </span>
                )}
              </div>

              <div className="mt-3 flex gap-6">
                <div>
                  <p className="font-sans text-lg font-light tabular-nums text-ravok-gold">
                    {doc.total_views}
                  </p>
                  <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-white/40">
                    Views
                  </p>
                </div>
                <div>
                  <p className="font-sans text-lg font-light tabular-nums text-white/80">
                    {doc.unique_viewers}
                  </p>
                  <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-white/40">
                    Viewers
                  </p>
                </div>
                <div>
                  <p className="font-sans text-lg font-light tabular-nums text-white/80">
                    {formatDuration(doc.total_duration_seconds)}
                  </p>
                  <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-white/40">
                    Total time
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
