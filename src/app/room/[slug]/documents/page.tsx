"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getPublicRoomDocuments,
  getRoomToken,
  type PublicRoomDocument,
} from "@/lib/api/v1/rooms";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function RoomDocumentsPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params?.slug ?? "";

  const [roomName, setRoomName] = useState("");
  const [docs, setDocs] = useState<PublicRoomDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    if (!getRoomToken(slug)) {
      router.replace(`/room/${slug}`);
      return;
    }
    getPublicRoomDocuments(slug)
      .then((res) => {
        setRoomName(res.room.name);
        setDocs(res.documents);
      })
      .catch(() => {
        sessionStorage.removeItem(`ravok_room_${slug}`);
        router.replace(`/room/${slug}`);
      })
      .finally(() => setLoading(false));
  }, [slug, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <p className="font-sans text-sm text-ravok-slate">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-2xl font-light tracking-tight text-white">
            {roomName}
          </h1>
          <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.3em] text-white/30">
            {docs.length} document{docs.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="space-y-2">
          {docs.map((doc) => (
            <Link
              key={doc.id}
              href={`/room/${slug}/documents/${doc.id}`}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-ravok-gold/30 hover:bg-white/[0.06]"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-sans text-sm text-white">{doc.name}</p>
                <p className="mt-0.5 font-sans text-xs text-ravok-slate">
                  {doc.mime_type === "application/pdf" ? "PDF" : doc.mime_type} · {formatSize(doc.size_bytes)}
                </p>
              </div>
              <span className="ml-3 font-sans text-xs text-ravok-gold">View →</span>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-center font-sans text-[10px] uppercase tracking-[0.2em] text-white/20">
          Powered by Ravok Studios
        </p>
      </div>
    </div>
  );
}
