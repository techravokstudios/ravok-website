"use client";

import { useCallback, useEffect, useState } from "react";
import { usePdfTextExtraction, type PageContent } from "./usePdfTextExtraction";
import { useDocumentTracking } from "./useDocumentTracking";
import ReflowablePage from "./ReflowablePage";
import ViewerToolbar from "./ViewerToolbar";

type ReflowableViewerProps = {
  fileUrl: string;
  authToken: string | null;
  documentId: number;
  watermark?: string | null;
};

export default function ReflowableViewer({ fileUrl, authToken, documentId, watermark }: ReflowableViewerProps) {
  const { numPages, loading, error, getPageContent } = usePdfTextExtraction(fileUrl, authToken);
  const { currentPage, observePage } = useDocumentTracking(documentId, numPages);
  const [fontSize, setFontSize] = useState(16);
  const [pages, setPages] = useState<Map<number, PageContent>>(new Map());

  useEffect(() => {
    if (numPages <= 0) return;

    async function extractAll() {
      const results = new Map<number, PageContent>();
      for (let i = 1; i <= numPages; i++) {
        const content = await getPageContent(i);
        results.set(i, content);
      }
      setPages(results);
    }

    void extractAll();
  }, [numPages, getPageContent]);

  const handleFontSize = useCallback((delta: number) => {
    setFontSize((s) => Math.max(12, Math.min(24, s + delta)));
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black"
      onContextMenu={(e) => e.preventDefault()}
    >
      <style jsx global>{`
        @media print {
          body { display: none !important; }
        }
      `}</style>

      <ViewerToolbar
        currentPage={currentPage}
        numPages={numPages}
        fontSize={fontSize}
        onFontSizeChange={handleFontSize}
        onBack={() => window.history.back()}
      />

      <div className="flex-1 overflow-y-auto select-none">
        {error ? (
          <div className="m-4 rounded border border-red-500/30 bg-red-500/10 p-4 font-sans text-sm text-red-300">
            {error}
          </div>
        ) : loading ? (
          <div className="flex min-h-[50vh] items-center justify-center font-sans text-sm text-ravok-slate">
            Loading document…
          </div>
        ) : pages.size === 0 ? (
          <div className="flex min-h-[50vh] items-center justify-center font-sans text-sm text-ravok-slate">
            Extracting text…
          </div>
        ) : (
          Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => {
            const content = pages.get(pageNum);
            if (!content || content.useCanvas) {
              return (
                <div
                  key={pageNum}
                  ref={(el) => { if (el) observePage(pageNum, el); }}
                  data-page={pageNum}
                  className="border-b border-white/8 px-4 py-6"
                >
                  <div className="mx-auto max-w-[720px]">
                    <div className="mb-2 font-sans text-[10px] uppercase tracking-[0.3em] text-white/20">
                      Page {pageNum}
                    </div>
                    <p className="font-sans text-sm italic text-white/40">
                      This page contains images or charts — view on desktop for full layout.
                    </p>
                  </div>
                </div>
              );
            }

            return (
              <ReflowablePage
                key={pageNum}
                ref={(el) => { if (el) observePage(pageNum, el); }}
                pageNumber={pageNum}
                paragraphs={content.paragraphs}
                fontSize={fontSize}
                isLast={pageNum === numPages}
              />
            );
          })
        )}
      </div>

      {watermark && (
        <div
          className="pointer-events-none fixed bottom-2 right-3 z-30 font-sans text-[7px] uppercase tracking-[0.2em] text-white/20 sm:text-[9px]"
          aria-hidden
        >
          {watermark}
        </div>
      )}
    </div>
  );
}
