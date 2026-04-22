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
  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const fileProp = useMemo(
    () => ({
      url: fileUrl,
      httpHeaders: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      withCredentials: false,
    }),
    [fileUrl, authToken]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth - 16;
      setWidth(w > 0 ? Math.min(w, 1100) : undefined);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const setPageRef = useCallback((page: number, el: HTMLDivElement | null) => {
    if (el) pageRefs.current.set(page, el);
    else pageRefs.current.delete(page);
  }, []);

  useEffect(() => {
    if (!numPages) return;
    const observer = new IntersectionObserver(
      (entries) => {
        let bestPage = currentPage;
        let bestRatio = 0;
        for (const entry of entries) {
          if (entry.intersectionRatio > bestRatio) {
            const p = Number(entry.target.getAttribute("data-page"));
            if (p) {
              bestRatio = entry.intersectionRatio;
              bestPage = p;
            }
          }
        }
        if (bestRatio > 0) setCurrentPage(bestPage);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    for (const el of pageRefs.current.values()) observer.observe(el);
    return () => observer.disconnect();
  }, [numPages, currentPage]);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      onContextMenu={(e) => e.preventDefault()}
    >
      <style jsx global>{`
        @media print {
          body { display: none !important; }
        }
      `}</style>

      {/* Floating toolbar */}
      <div className="sticky top-2 z-20 mx-auto mb-3 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-black/85 px-3 py-1.5 font-sans text-xs text-white/80 backdrop-blur-sm">
        <span className="tabular-nums text-ravok-beige">
          {numPages ? `${currentPage} / ${numPages}` : "…"}
        </span>
        <span className="mx-1 h-3 w-px bg-white/15" />
        <button
          type="button"
          className="px-1.5 py-0.5 hover:text-ravok-gold"
          onClick={() => setScale((s) => Math.max(0.5, +(s - 0.15).toFixed(2)))}
          aria-label="Zoom out"
        >
          −
        </button>
        <span className="tabular-nums text-ravok-slate">{Math.round(scale * 100)}%</span>
        <button
          type="button"
          className="px-1.5 py-0.5 hover:text-ravok-gold"
          onClick={() => setScale((s) => Math.min(2.5, +(s + 0.15).toFixed(2)))}
          aria-label="Zoom in"
        >
          +
        </button>
      </div>

      {error ? (
        <div className="mt-12 rounded border border-red-500/30 bg-red-500/10 p-4 font-sans text-sm text-red-300">
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
            <div className="flex min-h-[60vh] items-center justify-center font-sans text-sm text-ravok-slate">
              Loading document…
            </div>
          }
          className="flex select-none flex-col items-center gap-4 pb-16"
        >
          {numPages &&
            Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
              <div
                key={page}
                ref={(el) => setPageRef(page, el)}
                data-page={page}
              >
                <Page
                  pageNumber={page}
                  width={width}
                  scale={scale}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  className="shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
                />
              </div>
            ))}
        </Document>
      )}

      {watermark && (
        <div
          className="pointer-events-none fixed bottom-3 right-4 z-30 font-sans text-[8px] uppercase tracking-[0.25em] text-white/30 sm:text-[9px] sm:tracking-[0.3em]"
          aria-hidden
        >
          {watermark}
        </div>
      )}
    </div>
  );
}
