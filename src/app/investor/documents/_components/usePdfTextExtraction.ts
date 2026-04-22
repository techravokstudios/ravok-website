"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { pdfjs } from "react-pdf";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PdfDoc = any;
import { parseTextContent, hasEnoughText, type ParsedParagraph } from "./pdf-text-parser";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export type PageContent = {
  paragraphs: ParsedParagraph[];
  useCanvas: boolean;
};

export function usePdfTextExtraction(fileUrl: string, authToken: string | null) {
  const [pdfDocument, setPdfDocument] = useState<PdfDoc | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cache = useRef(new Map<number, PageContent>());

  useEffect(() => {
    if (!fileUrl) return;

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const loadingTask = pdfjs.getDocument({
          url: fileUrl,
          httpHeaders: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
          withCredentials: false,
        });

        const doc = await loadingTask.promise;
        if (cancelled) return;

        setPdfDocument(doc);
        setNumPages(doc.numPages);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load document.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [fileUrl, authToken]);

  const getPageContent = useCallback(
    async (pageNumber: number): Promise<PageContent> => {
      const cached = cache.current.get(pageNumber);
      if (cached) return cached;

      if (!pdfDocument) {
        return { paragraphs: [], useCanvas: true };
      }

      const page = await pdfDocument.getPage(pageNumber);
      const textContent = await page.getTextContent();

      const content: PageContent = hasEnoughText(textContent as Parameters<typeof hasEnoughText>[0])
        ? {
            paragraphs: parseTextContent(textContent as Parameters<typeof parseTextContent>[0]),
            useCanvas: false,
          }
        : { paragraphs: [], useCanvas: true };

      cache.current.set(pageNumber, content);
      return content;
    },
    [pdfDocument]
  );

  return { pdfDocument, numPages, loading, error, getPageContent };
}
