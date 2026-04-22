"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getInvestorDocument,
  investorDocumentFileUrl,
  storageUrl,
  getStoredUser,
  getToken,
  me,
  setAuth,
  type InvestorDocument,
  type User,
} from "@/lib/api";
import PdfViewer from "../_components/PdfViewer";

export default function DocumentViewerPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params?.id);

  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [doc, setDoc] = useState<InvestorDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!Number.isFinite(id) || id <= 0) {
      setError("Invalid document id.");
      setAuthChecked(true);
      setLoading(false);
      return;
    }

    async function load() {
      setLoading(true);
      setError("");
      try {
        const token = getToken();
        if (!token) {
          setError("Your session is missing. Please sign in again.");
          setAuthChecked(true);
          return;
        }
        let u = getStoredUser();
        try {
          const serverUser = await me();
          setAuth(token, serverUser);
          u = serverUser;
        } catch {
          setError("Could not verify your session. Please sign in again.");
          setAuthChecked(true);
          return;
        }
        if (u.role !== "admin" && u.status !== "approved") {
          router.replace("/pending");
          return;
        }
        setUser(u);
        setAuthChecked(true);

        const d = await getInvestorDocument(id);
        setDoc(d);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load document.");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [id, router]);

  const token = getToken();
  const fileUrl = Number.isFinite(id) && id > 0 ? investorDocumentFileUrl(id) : "";
  const mime = doc?.mime_type ?? "";
  const isPdf = mime === "application/pdf";
  const isImage = mime.startsWith("image/");
  const watermark = user?.email ? `${user.email} · viewed ${new Date().toLocaleDateString()}` : null;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/investor/documents"
          className="font-sans text-xs uppercase tracking-[0.25em] text-ravok-slate hover:text-ravok-gold"
        >
          ← Back to documents
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 font-sans text-sm text-red-400">
          {error}
        </div>
      )}

      {!authChecked || loading ? (
        <div className="px-2 py-8">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 animate-pulse rounded-full bg-ravok-gold" />
            <p className="font-sans text-ravok-slate">Loading document…</p>
          </div>
        </div>
      ) : doc ? (
        <>
          <div className="mb-4">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white">
              {doc.original_name || doc.name}
            </h1>
            <p className="mt-2 font-sans text-xs uppercase tracking-[0.2em] text-ravok-slate">
              View Only · Confidential
            </p>
            {doc.description && (
              <p className="mt-3 font-sans text-sm text-ravok-slate/90">{doc.description}</p>
            )}
            <div className="mt-3 h-0.5 w-12 bg-ravok-gold" />
          </div>

          {isPdf ? (
            <PdfViewer fileUrl={fileUrl} authToken={token} watermark={watermark} />
          ) : isImage ? (
            <div className="flex justify-center py-6" onContextMenu={(e) => e.preventDefault()}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={storageUrl(doc.file_path)}
                alt={doc.original_name || doc.name}
                className="max-h-[80vh] select-none rounded border border-white/10 object-contain"
                draggable={false}
              />
              {watermark && (
                <div className="pointer-events-none fixed bottom-4 right-6 z-30 font-sans text-[9px] uppercase tracking-[0.3em] text-white/40">
                  {watermark}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded border border-white/10 bg-white/5 p-8 text-center font-sans text-sm text-ravok-slate">
              In-browser preview is not available for this file type ({mime || "unknown"}).
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
