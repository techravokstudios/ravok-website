"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  getDocumentAnalyticsDetail,
  getViewDetail,
  type DocumentDetail,
  type ViewDetail,
  type ViewerEntry,
} from "@/lib/api/v1/analytics";

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m < 60) return `${m}m ${s}s`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

function formatMs(ms: number): string {
  return formatDuration(Math.round(ms / 1000));
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString();
}

export default function DocumentAnalyticsDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params?.id);

  const [data, setData] = useState<DocumentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<ViewDetail | null>(null);
  const [loadingView, setLoadingView] = useState(false);

  useEffect(() => {
    if (!id || id <= 0) return;
    getDocumentAnalyticsDetail(id)
      .then(setData)
      .finally(() => setLoading(false));
  }, [id]);

  const handleViewerClick = (entry: ViewerEntry) => {
    setLoadingView(true);
    getViewDetail(entry.session_token)
      .then(setSelectedView)
      .finally(() => setLoadingView(false));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="font-sans text-ravok-slate">Loading…</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded border border-red-500/30 bg-red-500/10 p-4 font-sans text-sm text-red-300">
        Document not found.
      </div>
    );
  }

  const maxAvgMs = Math.max(...data.page_stats.map((p) => p.avg_ms), 1);

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-2">
        <Link
          href="/admin/analytics"
          className="font-sans text-xs uppercase tracking-[0.2em] text-ravok-slate hover:text-ravok-gold"
        >
          ← All Documents
        </Link>
      </div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-white">
          {data.document.name}
        </h1>
        <p className="mt-1 font-sans text-xs text-ravok-slate">
          {data.document.category || "Uncategorized"} · Uploaded{" "}
          {new Date(data.document.created_at).toLocaleDateString()}
        </p>
      </div>

      {/* Summary cards */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Views", value: data.summary.total_views },
          { label: "Unique Viewers", value: data.summary.unique_viewers },
          { label: "Avg. Time", value: formatDuration(data.summary.avg_duration_seconds) },
          { label: "Total Time", value: formatDuration(data.summary.total_duration_seconds) },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-lg border border-white/10 bg-white/[0.03] p-4"
          >
            <p className="font-sans text-xl font-light tabular-nums text-ravok-gold">
              {card.value}
            </p>
            <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.2em] text-white/40">
              {card.label}
            </p>
          </div>
        ))}
      </div>

      {/* Page heatmap */}
      {data.page_stats.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 font-sans text-xs font-medium uppercase tracking-[0.2em] text-white/60">
            Time Per Page
          </h2>
          <div className="space-y-1.5">
            {data.page_stats.map((ps) => (
              <div key={ps.page_number} className="flex items-center gap-3">
                <span className="w-12 shrink-0 text-right font-sans text-xs tabular-nums text-white/50">
                  p.{ps.page_number}
                </span>
                <div className="flex-1">
                  <div
                    className="h-6 rounded-sm transition-all"
                    style={{
                      width: `${Math.max(2, (ps.avg_ms / maxAvgMs) * 100)}%`,
                      backgroundColor: `hsl(${40 + (1 - ps.avg_ms / maxAvgMs) * 20}, 70%, ${45 + (ps.avg_ms / maxAvgMs) * 15}%)`,
                    }}
                  />
                </div>
                <span className="w-16 shrink-0 font-sans text-xs tabular-nums text-white/50">
                  {formatMs(ps.avg_ms)} avg
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Viewer list */}
      <div className="mb-8">
        <h2 className="mb-4 font-sans text-xs font-medium uppercase tracking-[0.2em] text-white/60">
          Viewers
        </h2>
        {data.views.length === 0 ? (
          <p className="font-sans text-sm text-ravok-slate">No views yet.</p>
        ) : (
          <div className="space-y-2">
            {data.views.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => handleViewerClick(v)}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] p-3 text-left transition-colors hover:border-ravok-gold/30 hover:bg-white/[0.06]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-sans text-sm text-white">
                      {v.user?.name || "Unknown"}
                    </p>
                    <p className="font-sans text-xs text-ravok-slate">
                      {v.user?.email || v.ip_address || "—"}
                      {v.location && (
                        <span className="ml-2 text-white/30">· {v.location}</span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-sans text-sm tabular-nums text-ravok-gold">
                      {formatDuration(v.total_duration_seconds)}
                    </p>
                    <p className="font-sans text-[10px] text-white/40">
                      {v.total_pages_viewed} pages · {formatDate(v.started_at)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected view detail modal */}
      {(selectedView || loadingView) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-lg rounded-lg border border-white/10 bg-[#0a0a0a] p-6">
            {loadingView ? (
              <p className="font-sans text-sm text-ravok-slate">Loading session…</p>
            ) : selectedView ? (
              <>
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="font-sans text-sm font-medium text-white">
                      {selectedView.view.user?.name || "Unknown"}
                    </h3>
                    <p className="font-sans text-xs text-ravok-slate">
                      {selectedView.view.user?.email} · {formatDate(selectedView.view.started_at)}
                    </p>
                    <p className="mt-1 font-sans text-xs text-white/40">
                      {formatDuration(selectedView.view.total_duration_seconds)} total ·{" "}
                      {selectedView.view.total_pages_viewed} pages
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedView(null)}
                    className="font-sans text-xs text-ravok-slate hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                {/* Per-page breakdown for this session */}
                <h4 className="mb-2 font-sans text-[10px] uppercase tracking-[0.2em] text-white/40">
                  Page-by-page
                </h4>
                {selectedView.page_summary.length > 0 ? (
                  <div className="max-h-64 space-y-1 overflow-y-auto">
                    {selectedView.page_summary.map((ps) => {
                      const maxMs = Math.max(
                        ...selectedView.page_summary.map((p) => p.total_ms),
                        1
                      );
                      return (
                        <div key={ps.page_number} className="flex items-center gap-2">
                          <span className="w-10 shrink-0 text-right font-sans text-xs tabular-nums text-white/50">
                            p.{ps.page_number}
                          </span>
                          <div className="flex-1">
                            <div
                              className="h-5 rounded-sm bg-ravok-gold/60"
                              style={{
                                width: `${Math.max(3, (ps.total_ms / maxMs) * 100)}%`,
                              }}
                            />
                          </div>
                          <span className="w-14 shrink-0 font-sans text-xs tabular-nums text-white/50">
                            {formatMs(ps.total_ms)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="font-sans text-xs text-ravok-slate">No page data recorded.</p>
                )}
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
