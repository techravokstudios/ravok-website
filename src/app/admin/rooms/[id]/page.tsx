"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  getRoom,
  updateRoom,
  removeRoomDocument,
  addRoomDocuments,
  type DataRoomDetail,
} from "@/lib/api/v1/rooms";
import { listInvestorDocuments, type InvestorDocument } from "@/lib/api";

export default function RoomDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params?.id);

  const [room, setRoom] = useState<DataRoomDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [allDocs, setAllDocs] = useState<InvestorDocument[]>([]);
  const [showAddDocs, setShowAddDocs] = useState(false);
  const [addDocIds, setAddDocIds] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    getRoom(id).then(setRoom).finally(() => setLoading(false));
    listInvestorDocuments(1, { per_page: 100 }).then((res) => setAllDocs(res.data));
  }, [id]);

  const copyLink = () => {
    if (!room) return;
    const link = `${window.location.origin}/room/${room.slug}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleActive = async () => {
    if (!room) return;
    const updated = await updateRoom(room.id, { is_active: !room.is_active });
    setRoom((prev) => prev ? { ...prev, ...updated } : prev);
  };

  const handleRemoveDoc = async (docId: number) => {
    if (!room) return;
    await removeRoomDocument(room.id, docId);
    setRoom((prev) => prev ? { ...prev, documents: prev.documents.filter((d) => d.id !== docId) } : prev);
  };

  const handleAddDocs = async () => {
    if (!room || addDocIds.length === 0) return;
    const updated = await addRoomDocuments(room.id, addDocIds);
    setRoom((prev) => prev ? { ...prev, documents: updated.documents } : prev);
    setShowAddDocs(false);
    setAddDocIds([]);
  };

  if (loading) return <p className="py-16 text-center font-sans text-ravok-slate">Loading…</p>;
  if (!room) return <p className="py-16 text-center font-sans text-red-400">Room not found.</p>;

  const existingDocIds = room.documents.map((d) => d.id);
  const availableDocs = allDocs.filter((d) => !existingDocIds.includes(d.id));

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/rooms" className="font-sans text-xs uppercase tracking-[0.2em] text-ravok-slate hover:text-ravok-gold">
        ← All Rooms
      </Link>

      <div className="mt-4 mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-white">{room.name}</h1>
          <p className="mt-1 font-sans text-xs text-ravok-slate">/{room.slug}</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={copyLink} className="rounded bg-ravok-gold px-3 py-1.5 font-sans text-xs text-black hover:brightness-90">
            {copied ? "Copied!" : "Copy Link"}
          </button>
          <button type="button" onClick={handleToggleActive} className={`rounded px-3 py-1.5 font-sans text-xs ${room.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
            {room.is_active ? "Active" : "Inactive"}
          </button>
          <Link href={`/admin/rooms/${room.id}/analytics`} className="rounded border border-white/10 px-3 py-1.5 font-sans text-xs text-white/70 hover:text-ravok-gold">
            Analytics
          </Link>
        </div>
      </div>

      {room.description && (
        <p className="mb-6 font-sans text-sm text-ravok-slate">{room.description}</p>
      )}

      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-white/60">
            Documents ({room.documents.length})
          </h2>
          <button type="button" onClick={() => setShowAddDocs(!showAddDocs)} className="font-sans text-xs text-ravok-gold hover:underline">
            + Add
          </button>
        </div>

        {showAddDocs && (
          <div className="mb-4 rounded border border-white/10 bg-white/[0.03] p-3">
            {availableDocs.length === 0 ? (
              <p className="font-sans text-xs text-ravok-slate">All documents are already in this room.</p>
            ) : (
              <>
                <div className="max-h-40 space-y-1 overflow-y-auto">
                  {availableDocs.map((d) => (
                    <label key={d.id} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-white/5">
                      <input type="checkbox" checked={addDocIds.includes(d.id)} onChange={() => setAddDocIds((prev) => prev.includes(d.id) ? prev.filter((x) => x !== d.id) : [...prev, d.id])} className="accent-ravok-gold" />
                      <span className="truncate font-sans text-sm text-white">{d.original_name || d.name}</span>
                    </label>
                  ))}
                </div>
                <button type="button" onClick={handleAddDocs} disabled={addDocIds.length === 0} className="mt-2 rounded bg-ravok-gold px-3 py-1 font-sans text-xs text-black disabled:opacity-30">
                  Add {addDocIds.length} document{addDocIds.length !== 1 ? "s" : ""}
                </button>
              </>
            )}
          </div>
        )}

        <div className="space-y-1">
          {room.documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between rounded border border-white/10 bg-white/[0.03] px-3 py-2">
              <span className="truncate font-sans text-sm text-white">{doc.original_name || doc.name}</span>
              <button type="button" onClick={() => handleRemoveDoc(doc.id)} className="shrink-0 font-sans text-xs text-red-400/60 hover:text-red-400">
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 font-sans text-xs font-medium uppercase tracking-[0.2em] text-white/60">
          Visitors ({room.visitors.length})
        </h2>
        {room.visitors.length === 0 ? (
          <p className="font-sans text-sm text-ravok-slate">No visitors yet. Share the link to get started.</p>
        ) : (
          <div className="space-y-1">
            {room.visitors.map((v) => (
              <div key={v.id} className="flex items-center justify-between rounded border border-white/10 bg-white/[0.03] px-3 py-2">
                <div>
                  <p className="font-sans text-sm text-white">{v.name}</p>
                  <p className="font-sans text-xs text-ravok-slate">{v.email}</p>
                </div>
                {v.last_accessed_at && (
                  <span className="font-sans text-[10px] text-white/30">
                    {new Date(v.last_accessed_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
