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
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageWidth, setPageWidth] = useState<number | undefined>(undefined);
  const [isMobile, setIsMobile] = useState(false);
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
      scrollRef.current?.scrollTo({ top: 0 });
    }, 150);
  }, [numPages, pageNumber]);

  const goPrev = useCallback(() => {
    if (pageNumber <= 1) return;
    setAnimDir("right");
    setTimeout(() => {
      setPageNumber((p) => p - 1);
      setAnimDir(null);
      scrollRef.current?.scrollTo({ top: 0 });
    }, 150);
  }, [pageNumber]);

  useEffect(() => {
    const measure = () => {
      const vw = window.innerWidth;
      const mobile = vw < 768;
      setIsMobile(mobile);
      if (mobile) {
        setPageWidth(vw);
      } else {
        const maxW = Math.min(vw - 80, 1000);
        setPageWidth(maxW > 0 ? maxW : undefined);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "PageDown") {
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
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dy = e.changedTouches[0].clientY - touchStartY.current;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
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
    >
      <style jsx global>{`
        @media print {
          body { display: none !important; }
        }
      `}</style>

      {/* Top bar */}
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-white/10 bg-black/95 px-4 backdrop-blur-sm">
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
            className="px-2 py-1 hover:text-ravok-gold disabled:opacity-30"
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
            className="px-2 py-1 hover:text-ravok-gold disabled:opacity-30"
            onClick={goNext}
            disabled={!numPages || pageNumber >= numPages}
          >
            ▸
          </button>
        </div>
        <div className="w-14" />
      </div>

      {/* Scrollable page area — scroll vertically within a page on mobile */}
      <div
        ref={scrollRef}
        className={`flex-1 overflow-y-auto overflow-x-hidden ${isMobile ? "" : "flex items-center justify-center"}`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {error ? (
          <div className="m-4 rounded border border-red-500/30 bg-red-500/10 p-4 font-sans text-sm text-red-300">
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
              <div className="flex min-h-[50vh] items-center justify-center font-sans text-sm text-ravok-slate">
                Loading document…
              </div>
            }
            className={`select-none ${isMobile ? "" : "flex items-center justify-center"}`}
          >
            <div className={`transition-all duration-150 ease-in-out ${animClass} ${isMobile ? "" : "shadow-[0_8px_40px_rgba(0,0,0,0.6)]"}`}>
              <Page
                pageNumber={pageNumber}
                width={pageWidth}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            </div>
          </Document>
        )}
      </div>

      {/* Tap zones — only on desktop (mobile uses swipe + scroll) */}
      {!isMobile && (
        <>
          <div
            className="absolute left-0 top-11 bottom-0 w-1/5 cursor-w-resize"
            onClick={goPrev}
          />
          <div
            className="absolute right-0 top-11 bottom-0 w-1/5 cursor-e-resize"
            onClick={goNext}
          />
        </>
      )}

      {watermark && (
        <div
          className="pointer-events-none fixed bottom-2 right-3 z-30 font-sans text-[7px] uppercase tracking-[0.2em] text-white/20 sm:bottom-3 sm:right-4 sm:text-[9px] sm:tracking-[0.3em]"
          aria-hidden
        >
          {watermark}
        </div>
      )}
    </div>
  );
}
