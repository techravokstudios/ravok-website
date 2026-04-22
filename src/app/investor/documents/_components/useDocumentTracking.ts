"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { startViewSession, logPageEvents, endViewSession, type PageEvent } from "@/lib/api/v1/document-views";
import { getApiBase, getAuthHeaders } from "@/lib/api/base";

export function useDocumentTracking(documentId: number, numPages: number) {
  const sessionToken = useRef<string | null>(null);
  const pendingEvents = useRef<PageEvent[]>([]);
  const pageEnteredAt = useRef<Map<number, number>>(new Map());
  const [currentPage, setCurrentPage] = useState(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const pageElements = useRef<Map<number, Element>>(new Map());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!documentId || numPages <= 0) return;

    startViewSession(documentId)
      .then((s) => {
        sessionToken.current = s.session_id;
      })
      .catch(() => {});

    return () => {
      flushAndEnd();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId, numPages]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      flushEvents();
    }, 10000);

    const onVisChange = () => {
      if (document.visibilityState === "hidden") {
        flushAndEnd();
      }
    };
    document.addEventListener("visibilitychange", onVisChange);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener("visibilitychange", onVisChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flushEvents = useCallback(() => {
    const events = pendingEvents.current;
    const token = sessionToken.current;
    if (!token || events.length === 0) return;

    const toSend = [...events];
    pendingEvents.current = [];

    logPageEvents(token, toSend).catch(() => {
      pendingEvents.current.push(...toSend);
    });
  }, []);

  const flushAndEnd = useCallback(() => {
    const token = sessionToken.current;
    if (!token) return;

    pageEnteredAt.current.forEach((enteredAt, page) => {
      const now = Date.now();
      pendingEvents.current.push({
        page_number: page,
        entered_at: enteredAt,
        exited_at: now,
        duration_ms: now - enteredAt,
      });
    });
    pageEnteredAt.current.clear();

    const events = pendingEvents.current;
    pendingEvents.current = [];
    const base = getApiBase();
    const headers = getAuthHeaders();

    if (events.length > 0) {
      fetch(`${base}/api/document-views/${token}/pages`, {
        method: "POST",
        headers: headers as Record<string, string>,
        body: JSON.stringify({ events }),
        keepalive: true,
      }).catch(() => {});
    }

    fetch(`${base}/api/document-views/${token}/end`, {
      method: "POST",
      headers: headers as Record<string, string>,
      keepalive: true,
    }).catch(() => {});

    sessionToken.current = null;
  }, []);

  const observePage = useCallback(
    (pageNumber: number, element: HTMLDivElement | null) => {
      if (!element) {
        pageElements.current.delete(pageNumber);
        return;
      }
      pageElements.current.set(pageNumber, element);

      if (!observerRef.current) {
        observerRef.current = new IntersectionObserver(
          (entries) => {
            let bestPage = 0;
            let bestRatio = 0;

            for (const entry of entries) {
              const page = Number(entry.target.getAttribute("data-page"));
              if (!page) continue;

              if (entry.intersectionRatio > 0.25 && !pageEnteredAt.current.has(page)) {
                pageEnteredAt.current.set(page, Date.now());
              }

              if (entry.intersectionRatio < 0.1 && pageEnteredAt.current.has(page)) {
                const enteredAt = pageEnteredAt.current.get(page)!;
                const now = Date.now();
                pendingEvents.current.push({
                  page_number: page,
                  entered_at: enteredAt,
                  exited_at: now,
                  duration_ms: now - enteredAt,
                });
                pageEnteredAt.current.delete(page);
              }

              if (entry.intersectionRatio > bestRatio) {
                bestRatio = entry.intersectionRatio;
                bestPage = page;
              }
            }

            if (bestPage > 0) setCurrentPage(bestPage);
          },
          { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
        );
      }

      observerRef.current.observe(element);
    },
    []
  );

  return { currentPage, observePage };
}
