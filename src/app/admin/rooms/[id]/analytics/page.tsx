"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  getRoomAnalyticsDetail,
  getRoomVisitors,
  getRoomVisitorDetail,
  type RoomDetail,
  type RoomVisitorStat,
  type RoomVisitorDetail,
} from "@/lib/api/v1/room-analytics";

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m < 60) return `${m}m ${s}s`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

function formatMs(ms: number): string {
  return formatDuration(Math.round(ms / 1000));
}

export default function RoomAnalyticsPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params?.id);

  const [data, setData] = useState<RoomDetail | null>(null);
  const [visitors, setVisitors] = useState<RoomVisitorStat[]>([]);
  const [selectedVisitor, setSelectedVisitor] = useState<RoomVisitorDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([getRoomAnalyticsDetail(id), getRoomVisitors(id)])
      .then(([d, v]) => { setData(d); setVisitors(v); })
      .finally(() => setLoading(false));
  }, [id]);

  const showVisitor = async (v: RoomVisitorStat) => {
    const detail = await getRoomVisitorDetail(id, v.id);
    setSelectedVisitor(detail);
  };

  if (loading) return <p className="py-16 text-center font-sans text-ravok-slate">Loading…</p>;
  if (!data) return <p className="py-16 text-center font-sans text-red-400">Room not found.</p>;

  return (
    <div className="mx-auto max-w-5xl">
      <Link href={`/admin/rooms/${id}`} className="font-sans text-xs uppercase tracking-[0.2em] text-ravok-slate hover:text-ravok-gold">
        ← Back to Room
      </Link>
      <h1 className="mt-4 mb-6 font-heading text-2xl font-bold tracking-tight text-white">
        {data.room.name} — Analytics
      </h1>

      {/* Summary */}
      <div className="mb-8 grid grid-cols-3 gap-3">
        {[
          { label: "Visitors", value: data.summary.total_visitors },
          { label: "Total Views", value: data.summary.total_views },
          { label: "Total Time", value: formatDuration(data.summary.total_duration_seconds) },
        ].map((c) => (
          <div key={c.label} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <p className="font-sans text-xl font-light tabular-nums text-ravok-gold">{c.value}</p>
            <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.2em] text-white/40">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Per-document stats */}
      {data.document_stats.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 font-sans text-xs font-medium uppercase tracking-[0.2em] text-white/60">
            Documents
          </h2>
          <div className="space-y-1">
            {data.document_stats.map((ds) => (
              <div key={ds.id} className="flex items-center justify-between rounded border border-white/10 bg-white/[0.03] px-3 py-2">
                <span className="truncate font-sans text-sm text-white">{ds.name}</span>
                <div className="flex gap-4 font-sans text-xs tabular-nums text-white/50">
                  <span>{ds.total_views} views</span>
                  <span>{ds.unique_viewers} viewers</span>
                  <span className="text-ravok-gold">{formatDuration(ds.total_duration_seconds)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visitors */}
      <div className="mb-8">
        <h2 className="mb-3 font-sans text-xs font-medium uppercase tracking-[0.2em] text-white/60">
          Visitors
        </h2>
        {visitors.length === 0 ? (
          <p className="font-sans text-sm text-ravok-slate">No visitors yet.</p>
        ) : (
          <div className="space-y-1">
            {visitors.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => showVisitor(v)}
                className="w-full rounded border border-white/10 bg-white/[0.03] px-3 py-2 text-left transition-colors hover:border-ravok-gold/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-sans text-sm text-white">{v.name}</p>
                    <p className="font-sans text-xs text-ravok-slate">
                      {v.email}
                      {v.location && (
                        <span className="ml-1 text-white/30">· {v.location}</span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-sans text-sm tabular-nums text-ravok-gold">{formatDuration(v.total_duration_seconds)}</p>
                    <p className="font-sans text-[10px] text-white/40">{v.total_views} views</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Visitor detail modal */}
      {selectedVisitor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-lg rounded-lg border border-white/10 bg-[#0a0a0a] p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="font-sans text-sm font-medium text-white">{selectedVisitor.visitor.name}</h3>
                <p className="font-sans text-xs text-ravok-slate">{selectedVisitor.visitor.email}</p>
              </div>
              <button type="button" onClick={() => setSelectedVisitor(null)} className="font-sans text-xs text-ravok-slate hover:text-white">✕</button>
            </div>
            <div className="max-h-80 space-y-3 overflow-y-auto">
              {selectedVisitor.views.map((view) => (
                <div key={view.id} className="rounded border border-white/10 bg-white/[0.03] p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-sans text-sm text-white">{view.document.name}</p>
                    <p className="font-sans text-xs tabular-nums text-ravok-gold">{formatDuration(view.total_duration_seconds)}</p>
                  </div>
                  <p className="mt-0.5 font-sans text-[10px] text-white/30">
                    {view.total_pages_viewed} pages · {new Date(view.started_at).toLocaleString()}
                  </p>
                  {view.page_summary.length > 0 && (
                    <div className="mt-2 space-y-0.5">
                      {view.page_summary.map((ps) => {
                        const maxMs = Math.max(...view.page_summary.map((p) => p.total_ms), 1);
                        return (
                          <div key={ps.page_number} className="flex items-center gap-2">
                            <span className="w-8 text-right font-sans text-[10px] tabular-nums text-white/40">p.{ps.page_number}</span>
                            <div className="flex-1"><div className="h-3 rounded-sm bg-ravok-gold/50" style={{ width: `${Math.max(3, (ps.total_ms / maxMs) * 100)}%` }} /></div>
                            <span className="w-12 font-sans text-[10px] tabular-nums text-white/40">{formatMs(ps.total_ms)}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
