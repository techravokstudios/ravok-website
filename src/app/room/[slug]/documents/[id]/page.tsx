"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  getRoomToken,
  getRoomVisitorEmail,
  publicRoomFileUrl,
  getPublicRoomDocuments,
  startRoomViewSession,
  logRoomPageEvents,
  endRoomViewSession,
} from "@/lib/api/v1/rooms";

const PdfViewerInner = dynamic(
  () => import("@/app/investor/documents/_components/PdfViewer"),
  { ssr: false }
);

export default function RoomDocumentViewerPage() {
  const params = useParams<{ slug: string; id: string }>();
  const router = useRouter();
  const slug = params?.slug ?? "";
  const docId = Number(params?.id);

  const [ready, setReady] = useState(false);
  const [allowDownload, setAllowDownload] = useState(false);
  const [docName, setDocName] = useState("");
  const token = getRoomToken(slug);
  const email = getRoomVisitorEmail(slug);

  // Room tracking
  const sessionToken = useRef<string | null>(null);
  const pendingEvents = useRef<{ page_number: number; entered_at: number; exited_at: number; duration_ms: number }[]>([]);
  const pageEnteredAt = useRef<Map<number, number>>(new Map());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [numPages, setNumPages] = useState(0);

  useEffect(() => {
    if (!slug || !token) {
      router.replace(`/room/${slug}`);
      return;
    }
    setReady(true);
    getPublicRoomDocuments(slug)
      .then((res) => {
        setAllowDownload(res.room.allow_download);
        const found = res.documents.find((d) => d.id === docId);
        if (found) setDocName(found.name);
      })
      .catch(() => {});
  }, [slug, token, router, docId]);

  // Start session
  useEffect(() => {
    if (!ready || !docId) return;
    startRoomViewSession(slug, docId)
      .then((s) => { sessionToken.current = s.session_id; })
      .catch(() => {});
    return () => { flushAndEnd(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, docId, slug]);

  // Batch flush interval
  useEffect(() => {
    intervalRef.current = setInterval(() => flushEvents(), 10000);
    const onVis = () => { if (document.visibilityState === "hidden") flushAndEnd(); };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener("visibilitychange", onVis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flushEvents = useCallback(() => {
    const events = pendingEvents.current;
    const st = sessionToken.current;
    if (!st || events.length === 0) return;
    const toSend = [...events];
    pendingEvents.current = [];
    logRoomPageEvents(slug, st, toSend).catch(() => {
      pendingEvents.current.push(...toSend);
    });
  }, [slug]);

  const flushAndEnd = useCallback(() => {
    const st = sessionToken.current;
    if (!st) return;
    pageEnteredAt.current.forEach((enteredAt, page) => {
      const now = Date.now();
      pendingEvents.current.push({ page_number: page, entered_at: enteredAt, exited_at: now, duration_ms: now - enteredAt });
    });
    pageEnteredAt.current.clear();
    const events = pendingEvents.current;
    pendingEvents.current = [];
    const hdrs = { 'Content-Type': 'application/json', 'X-Room-Token': token || '' };
    const base = typeof window !== 'undefined' ? window.location.origin : '';
    if (events.length > 0) {
      fetch(`${base}/api/public/room-views/${st}/pages`, { method: 'POST', headers: hdrs, body: JSON.stringify({ events }), keepalive: true }).catch(() => {});
    }
    fetch(`${base}/api/public/room-views/${st}/end`, { method: 'POST', headers: hdrs, keepalive: true }).catch(() => {});
    sessionToken.current = null;
  }, [token]);

  const handlePageChange = useCallback((page: number) => {
    const now = Date.now();
    pageEnteredAt.current.forEach((enteredAt, p) => {
      pendingEvents.current.push({ page_number: p, entered_at: enteredAt, exited_at: now, duration_ms: now - enteredAt });
    });
    pageEnteredAt.current.clear();
    pageEnteredAt.current.set(page, now);
  }, []);

  if (!ready) return null;

  const fileUrl = publicRoomFileUrl(slug, docId);
  const watermark = email ? `${email} · ${new Date().toLocaleDateString()}` : null;

  const handleDownload = async () => {
    try {
      const res = await fetch(`${fileUrl}?download=1`, {
        headers: { "X-Room-Token": token || "" },
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = docName || `document-${docId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // silent
    }
  };

  return (
    <PdfViewerInner
      fileUrl={fileUrl}
      authToken={null}
      documentId={docId}
      watermark={watermark}
      customHeaders={{ "X-Room-Token": token || "" }}
      allowDownload={allowDownload}
      onDownload={handleDownload}
      onPageChange={handlePageChange}
      onLoad={(n: number) => {
        setNumPages(n);
        handlePageChange(1);
      }}
    />
  );
}
