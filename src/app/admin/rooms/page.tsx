"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listRooms, updateRoom, type DataRoom } from "@/lib/api/v1/rooms";

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<DataRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listRooms().then(setRooms).finally(() => setLoading(false));
  }, []);

  const toggleActive = async (room: DataRoom) => {
    await updateRoom(room.id, { is_active: !room.is_active });
    setRooms((prev) => prev.map((r) => (r.id === room.id ? { ...r, is_active: !r.is_active } : r)));
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-ravok-gold">
            Data Rooms
          </h1>
          <p className="mt-1 font-sans text-sm text-ravok-slate">
            Create shareable document rooms with tracking
          </p>
        </div>
        <Link
          href="/admin/rooms/create"
          className="rounded bg-ravok-gold px-4 py-2 font-sans text-sm font-medium text-black hover:brightness-90"
        >
          + Create Room
        </Link>
      </div>

      {loading ? (
        <p className="py-16 text-center font-sans text-ravok-slate">Loading…</p>
      ) : rooms.length === 0 ? (
        <div className="rounded border border-white/10 bg-white/5 p-8 text-center font-sans text-sm text-ravok-slate">
          No data rooms yet. Create your first one.
        </div>
      ) : (
        <div className="space-y-3">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="rounded-lg border border-white/10 bg-white/[0.03] p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/rooms/${room.id}`}
                    className="font-sans text-sm font-medium text-white hover:text-ravok-gold"
                  >
                    {room.name}
                  </Link>
                  <p className="mt-0.5 font-sans text-xs text-ravok-slate">
                    /{room.slug}
                    {room.expires_at && ` · expires ${new Date(room.expires_at).toLocaleDateString()}`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleActive(room)}
                  className={`shrink-0 rounded px-2 py-0.5 font-sans text-[10px] uppercase tracking-[0.15em] ${
                    room.is_active
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {room.is_active ? "Active" : "Inactive"}
                </button>
              </div>
              <div className="mt-3 flex gap-6">
                <div>
                  <p className="font-sans text-lg font-light tabular-nums text-ravok-gold">
                    {room.visitors_count ?? 0}
                  </p>
                  <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-white/40">Visitors</p>
                </div>
                <div>
                  <p className="font-sans text-lg font-light tabular-nums text-white/80">
                    {room.documents_count ?? 0}
                  </p>
                  <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-white/40">Documents</p>
                </div>
                <div>
                  <p className="font-sans text-lg font-light tabular-nums text-white/80">
                    {room.views_count ?? 0}
                  </p>
                  <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-white/40">Views</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
