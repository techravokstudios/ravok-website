"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useDocumentTracking } from "./useDocumentTracking";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type PdfViewerProps = {
  fileUrl: string;
  authToken: string | null;
  documentId: number;
  watermark?: string | null;
  onLoad?: (numPages: number) => void;
};

export default function PdfViewer({ fileUrl, authToken, documentId, watermark, onLoad }: PdfViewerProps) {
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
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Pinch-to-zoom state
  const [scale, setScale] = useState(1);
  const pinchStartDist = useRef(0);
  const pinchStartScale = useRef(1);
  const lastTapTime = useRef(0);

  const { trackPageChange } = useDocumentTracking(documentId, numPages ?? 0);

  // Track page changes
  useEffect(() => {
    if (numPages && numPages > 0) {
      trackPageChange(pageNumber);
    }
  }, [pageNumber, numPages, trackPageChange]);

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
      setScale(1);
      setAnimDir(null);
      scrollRef.current?.scrollTo({ top: 0 });
    }, 150);
  }, [numPages, pageNumber]);

  const goPrev = useCallback(() => {
    if (pageNumber <= 1) return;
    setAnimDir("right");
    setTimeout(() => {
      setPageNumber((p) => p - 1);
      setScale(1);
      setAnimDir(null);
      scrollRef.current?.scrollTo({ top: 0 });
    }, 150);
  }, [pageNumber]);

  // Viewport measurement
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

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "Escape" && scale > 1) {
        setScale(1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, scale]);

  // Fullscreen API
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    } else if (containerRef.current.requestFullscreen) {
      containerRef.current.requestFullscreen().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Auto-fullscreen on mobile after load
  useEffect(() => {
    if (isMobile && numPages && numPages > 0 && containerRef.current?.requestFullscreen && !document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    }
  }, [isMobile, numPages]);

  // Swipe navigation (single-finger, only when not zoomed)
  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1 && scale <= 1) {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
      }
      // Pinch start (two fingers)
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        pinchStartDist.current = Math.sqrt(dx * dx + dy * dy);
        pinchStartScale.current = scale;
      }
    },
    [scale]
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (pinchStartDist.current > 0) {
          const newScale = Math.min(3, Math.max(1, pinchStartScale.current * (dist / pinchStartDist.current)));
          setScale(newScale);
        }
      }
    },
    []
  );

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      pinchStartDist.current = 0;

      // Single-finger swipe (only when not zoomed)
      if (e.changedTouches.length === 1 && scale <= 1) {
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        const dy = e.changedTouches[0].clientY - touchStartY.current;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
          if (dx < 0) goNext();
          else goPrev();
        }
      }

      // Double-tap to toggle zoom
      if (e.changedTouches.length === 1) {
        const now = Date.now();
        if (now - lastTapTime.current < 300) {
          setScale((s) => (s > 1 ? 1 : 2));
        }
        lastTapTime.current = now;
      }
    },
    [goNext, goPrev, scale]
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
          onClick={() => {
            if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
            window.history.back();
          }}
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
        <button
          type="button"
          onClick={toggleFullscreen}
          className="font-sans text-xs text-ravok-slate hover:text-ravok-gold"
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? "⊡" : "⊞"}
        </button>
      </div>

      {/* Scrollable page area */}
      <div
        ref={scrollRef}
        className={`flex-1 overflow-auto ${isMobile ? "" : "flex items-center justify-center"}`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
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
                width={pageWidth ? pageWidth * scale : undefined}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            </div>
          </Document>
        )}
      </div>

      {/* Zoom indicator */}
      {scale > 1 && (
        <button
          type="button"
          onClick={() => setScale(1)}
          className="absolute bottom-14 left-1/2 z-30 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 font-sans text-[10px] uppercase tracking-[0.2em] text-white/60 backdrop-blur-sm hover:bg-white/20"
        >
          {Math.round(scale * 100)}% · tap to reset
        </button>
      )}

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
