"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createRoom } from "@/lib/api/v1/rooms";
import { listInvestorDocuments, type InvestorDocument } from "@/lib/api";

export default function CreateRoomPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ndaText, setNdaText] = useState("");
  const [passcode, setPasscode] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [allowDownload, setAllowDownload] = useState(false);
  const [notifyOnVisit, setNotifyOnVisit] = useState(true);
  const [selectedDocIds, setSelectedDocIds] = useState<number[]>([]);
  const [docs, setDocs] = useState<InvestorDocument[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [createdSlug, setCreatedSlug] = useState("");

  useEffect(() => {
    listInvestorDocuments(1, { per_page: 100 }).then((res) => setDocs(res.data));
  }, []);

  const toggleDoc = (id: number) => {
    setSelectedDocIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const room = await createRoom({
        name,
        description: description || undefined,
        nda_text: ndaText || undefined,
        passcode: passcode || undefined,
        expires_at: expiresAt || undefined,
        allow_download: allowDownload,
        notify_on_visit: notifyOnVisit,
        document_ids: selectedDocIds,
      });
      setCreatedSlug(room.slug);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create room.");
    } finally {
      setSubmitting(false);
    }
  };

  if (createdSlug) {
    const link = `${typeof window !== "undefined" ? window.location.origin : ""}/room/${createdSlug}`;
    return (
      <div className="mx-auto max-w-lg py-12">
        <h1 className="mb-4 font-heading text-2xl font-bold text-ravok-gold">Room Created</h1>
        <p className="mb-4 font-sans text-sm text-ravok-slate">Share this link with investors:</p>
        <div className="flex items-center gap-2">
          <input
            readOnly
            value={link}
            className="flex-1 rounded border border-white/10 bg-white/5 px-3 py-2 font-sans text-sm text-white"
          />
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(link)}
            className="shrink-0 rounded bg-ravok-gold px-3 py-2 font-sans text-sm text-black hover:brightness-90"
          >
            Copy
          </button>
        </div>
        <button
          type="button"
          onClick={() => router.push("/admin/rooms")}
          className="mt-6 font-sans text-xs uppercase tracking-[0.2em] text-ravok-slate hover:text-ravok-gold"
        >
          ← Back to rooms
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-8 font-heading text-2xl font-bold uppercase tracking-wide text-ravok-gold">
        Create Data Room
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-1 block font-sans text-xs uppercase tracking-[0.2em] text-white/60">
            Room Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g., Series A Due Diligence"
            className="w-full rounded border border-white/10 bg-white/5 px-4 py-2.5 font-sans text-sm text-white placeholder-white/30 outline-none focus:border-ravok-gold/50"
          />
        </div>

        <div>
          <label className="mb-1 block font-sans text-xs uppercase tracking-[0.2em] text-white/60">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Welcome message for visitors"
            className="w-full rounded border border-white/10 bg-white/5 px-4 py-2.5 font-sans text-sm text-white placeholder-white/30 outline-none focus:border-ravok-gold/50"
          />
        </div>

        <div>
          <label className="mb-1 block font-sans text-xs uppercase tracking-[0.2em] text-white/60">
            NDA / Confidentiality Agreement (optional)
          </label>
          <textarea
            value={ndaText}
            onChange={(e) => setNdaText(e.target.value)}
            rows={5}
            placeholder="If set, visitors must accept this before viewing"
            className="w-full rounded border border-white/10 bg-white/5 px-4 py-2.5 font-sans text-sm text-white placeholder-white/30 outline-none focus:border-ravok-gold/50"
          />
          <p className="mt-1 font-sans text-[10px] text-white/30">
            Visitors will see this text and must check &quot;I agree&quot; before continuing.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block font-sans text-xs uppercase tracking-[0.2em] text-white/60">
              Passcode (optional)
            </label>
            <input
              type="text"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Leave blank for none"
              className="w-full rounded border border-white/10 bg-white/5 px-4 py-2.5 font-sans text-sm text-white placeholder-white/30 outline-none focus:border-ravok-gold/50"
            />
          </div>
          <div>
            <label className="mb-1 block font-sans text-xs uppercase tracking-[0.2em] text-white/60">
              Expires (optional)
            </label>
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full rounded border border-white/10 bg-white/5 px-4 py-2.5 font-sans text-sm text-white outline-none focus:border-ravok-gold/50"
            />
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 font-sans text-sm text-white/80">
            <input
              type="checkbox"
              checked={allowDownload}
              onChange={(e) => setAllowDownload(e.target.checked)}
              className="accent-ravok-gold"
            />
            Allow download
          </label>
          <label className="flex items-center gap-2 font-sans text-sm text-white/80">
            <input
              type="checkbox"
              checked={notifyOnVisit}
              onChange={(e) => setNotifyOnVisit(e.target.checked)}
              className="accent-ravok-gold"
            />
            Email me on new visitor
          </label>
        </div>

        <div>
          <label className="mb-2 block font-sans text-xs uppercase tracking-[0.2em] text-white/60">
            Documents
          </label>
          {docs.length === 0 ? (
            <p className="font-sans text-sm text-ravok-slate">No documents uploaded yet.</p>
          ) : (
            <div className="max-h-64 space-y-1 overflow-y-auto rounded border border-white/10 p-2">
              {docs.map((doc) => (
                <label
                  key={doc.id}
                  className={`flex cursor-pointer items-center gap-3 rounded px-3 py-2 transition-colors ${
                    selectedDocIds.includes(doc.id)
                      ? "bg-ravok-gold/10 border border-ravok-gold/20"
                      : "hover:bg-white/5"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedDocIds.includes(doc.id)}
                    onChange={() => toggleDoc(doc.id)}
                    className="accent-ravok-gold"
                  />
                  <span className="truncate font-sans text-sm text-white">
                    {doc.original_name || doc.name}
                  </span>
                </label>
              ))}
            </div>
          )}
          <p className="mt-1 font-sans text-xs text-white/30">
            {selectedDocIds.length} selected
          </p>
        </div>

        {error && <p className="font-sans text-xs text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-ravok-gold px-6 py-2.5 font-sans text-sm font-medium text-black hover:brightness-90 disabled:opacity-50"
        >
          {submitting ? "Creating…" : "Create Room"}
        </button>
      </form>
    </div>
  );
}
