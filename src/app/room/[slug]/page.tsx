"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getPublicRoomInfo,
  enterRoom,
  setRoomToken,
  setRoomVisitorEmail,
  getRoomToken,
  type PublicRoomInfo,
} from "@/lib/api/v1/rooms";

export default function RoomEntryPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params?.slug ?? "";

  const [room, setRoom] = useState<PublicRoomInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const existingToken = getRoomToken(slug);
    if (existingToken) {
      getPublicRoomInfo(slug)
        .then((info) => {
          if (info.is_active && !info.is_expired) {
            router.replace(`/room/${slug}/documents`);
          } else {
            sessionStorage.removeItem(`ravok_room_${slug}`);
            setRoom(info);
            setLoading(false);
          }
        })
        .catch(() => {
          sessionStorage.removeItem(`ravok_room_${slug}`);
          setError("Room not found.");
          setLoading(false);
        });
      return;
    }
    getPublicRoomInfo(slug)
      .then(setRoom)
      .catch(() => setError("Room not found."))
      .finally(() => setLoading(false));
  }, [slug, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await enterRoom(slug, { email, name, passcode: passcode || undefined });
      setRoomToken(slug, res.access_token);
      setRoomVisitorEmail(slug, res.visitor.email);
      router.push(`/room/${slug}/documents`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to enter room.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <p className="font-sans text-sm text-ravok-slate">Loading…</p>
      </div>
    );
  }

  if (!room || error === "Room not found.") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <p className="font-sans text-sm text-white/50">This room does not exist.</p>
      </div>
    );
  }

  if (room.is_expired || !room.is_active) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <p className="font-sans text-sm text-white/50">This room is no longer available.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-2xl font-light tracking-tight text-white">
            {room.name}
          </h1>
          {room.description && (
            <p className="mt-2 font-sans text-sm text-ravok-slate">{room.description}</p>
          )}
          <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.3em] text-white/30">
            {room.document_count} document{room.document_count !== 1 ? "s" : ""}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded border border-white/10 bg-white/5 px-4 py-3 font-sans text-sm text-white placeholder-white/30 outline-none focus:border-ravok-gold/50"
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded border border-white/10 bg-white/5 px-4 py-3 font-sans text-sm text-white placeholder-white/30 outline-none focus:border-ravok-gold/50"
            />
          </div>
          {room.requires_passcode && (
            <div>
              <input
                type="password"
                placeholder="Passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                required
                className="w-full rounded border border-white/10 bg-white/5 px-4 py-3 font-sans text-sm text-white placeholder-white/30 outline-none focus:border-ravok-gold/50"
              />
            </div>
          )}
          {error && (
            <p className="font-sans text-xs text-red-400">{error}</p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded bg-ravok-gold py-3 font-sans text-sm font-medium text-black transition-colors hover:brightness-90 disabled:opacity-50"
          >
            {submitting ? "Entering…" : "Continue"}
          </button>
        </form>

        <p className="mt-6 text-center font-sans text-[10px] uppercase tracking-[0.2em] text-white/20">
          Powered by Ravok Studios
        </p>
      </div>
    </div>
  );
}
