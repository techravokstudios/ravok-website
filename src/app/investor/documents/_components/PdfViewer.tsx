"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type PdfViewerProps = {
  fileUrl: string;
  authToken: string | null;
  watermark?: string | null;
  onLoad?: (numPages: number) => void;
};

export default function PdfViewer({ fileUrl, authToken, watermark, onLoad }: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef(0);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageWidth, setPageWidth] = useState<number | undefined>(undefined);
  const [pageHeight, setPageHeight] = useState<number | undefined>(undefined);
  const [animDir, setAnimDir] = useState<"left" | "right" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileProp = useMemo(
    () => ({
      url: fileUrl,
      httpHeaders: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      withCredentials: false,
    }),
    [fileUrl, authToken]
  );

  const goNext = useCallback(() => {
    if (!numPages || pageNumber >= numPages) return;
    setAnimDir("left");
    setTimeout(() => {
      setPageNumber((p) => p + 1);
      setAnimDir(null);
    }, 150);
  }, [numPages, pageNumber]);

  const goPrev = useCallback(() => {
    if (pageNumber <= 1) return;
    setAnimDir("right");
    setTimeout(() => {
      setPageNumber((p) => p - 1);
      setAnimDir(null);
    }, 150);
  }, [pageNumber]);

  useEffect(() => {
    const measure = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const toolbarH = 48;
      const availH = vh - toolbarH - 24;
      const pdfRatio = 1 / 1.29;
      let w = Math.min(vw - 32, 1100);
      let h = w / pdfRatio;
      if (h > availH) {
        h = availH;
        w = h * pdfRatio;
      }
      setPageWidth(Math.floor(w));
      setPageHeight(Math.floor(h));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        goPrev();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(dx) > 50) {
        if (dx < 0) goNext();
        else goPrev();
      }
    },
    [goNext, goPrev]
  );

  const animClass =
    animDir === "left"
      ? "translate-x-[-8%] opacity-0"
      : animDir === "right"
        ? "translate-x-[8%] opacity-0"
        : "translate-x-0 opacity-100";

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col bg-black"
      onContextMenu={(e) => e.preventDefault()}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <style jsx global>{`
        @media print {
          body { display: none !important; }
        }
      `}</style>

      {/* Top bar */}
      <div className="flex h-12 shrink-0 items-center justify-between px-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="font-sans text-xs uppercase tracking-[0.2em] text-ravok-slate hover:text-ravok-gold"
        >
          ← Back
        </button>
        <div className="flex items-center gap-3 font-sans text-xs text-white/70">
          <button
            type="button"
            className="px-1 hover:text-ravok-gold disabled:opacity-30"
            onClick={goPrev}
            disabled={pageNumber <= 1}
          >
            ◂
          </button>
          <span className="tabular-nums text-ravok-beige">
            {numPages ? `${pageNumber} / ${numPages}` : "…"}
          </span>
          <button
            type="button"
            className="px-1 hover:text-ravok-gold disabled:opacity-30"
            onClick={goNext}
            disabled={!numPages || pageNumber >= numPages}
          >
            ▸
          </button>
        </div>
        <div className="w-16" />
      </div>

      {/* Page area */}
      <div className="flex flex-1 items-center justify-center overflow-hidden">
        {error ? (
          <div className="rounded border border-red-500/30 bg-red-500/10 p-4 font-sans text-sm text-red-300">
            {error}
          </div>
        ) : (
          <Document
            file={fileProp}
            onLoadSuccess={({ numPages: n }) => {
              setNumPages(n);
              onLoad?.(n);
            }}
            onLoadError={(err) => setError(err?.message ?? "Failed to load document.")}
            loading={
              <div className="font-sans text-sm text-ravok-slate">Loading document…</div>
            }
            className="flex select-none items-center justify-center"
          >
            <div className={`transition-all duration-150 ease-in-out ${animClass}`}>
              <Page
                pageNumber={pageNumber}
                width={pageWidth}
                height={pageHeight}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                className="shadow-[0_8px_40px_rgba(0,0,0,0.6)]"
              />
            </div>
          </Document>
        )}
      </div>

      {/* Tap zones */}
      <div
        className="absolute left-0 top-12 bottom-0 w-1/4 cursor-w-resize"
        onClick={goPrev}
      />
      <div
        className="absolute right-0 top-12 bottom-0 w-1/4 cursor-e-resize"
        onClick={goNext}
      />

      {watermark && (
        <div
          className="pointer-events-none absolute bottom-3 right-4 z-30 font-sans text-[8px] uppercase tracking-[0.25em] text-white/25 sm:text-[9px] sm:tracking-[0.3em]"
          aria-hidden
        >
          {watermark}
        </div>
      )}
    </div>
  );
}
