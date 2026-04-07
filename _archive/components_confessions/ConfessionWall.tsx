'use client';

/**
 * Confession Wall — masonry grid of confessions
 * Displays approved confessions in a pinned board aesthetic
 */

import { useEffect, useState } from 'react';
import { Confession } from '@/lib/types/confessions';
import { confessionsApi } from '@/lib/api/v1/confessions';
import { ConfessionCard } from './ConfessionCard';
import { useApi } from '@/lib/hooks/useApi';

interface ConfessionWallProps {
  initialLimit?: number;
  onLoadMore?: () => void;
}

export function ConfessionWall({
  initialLimit = 12,
  onLoadMore,
}: ConfessionWallProps) {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { data: paginatedData, loading, error, execute } = useApi<{
    data: Confession[];
    meta: { last_page: number };
  }>();

  // Load initial confessions
  useEffect(() => {
    execute(async () => {
      const result = await confessionsApi.getFeed(1, initialLimit);
      setConfessions(result.data);
      setPage(1);
      setHasMore(result.meta.current_page < result.meta.last_page);
      return {
        data: result.data,
        meta: result.meta,
      };
    });
  }, [execute, initialLimit]);

  // Load more confessions
  const handleLoadMore = async () => {
    const nextPage = page + 1;
    execute(async () => {
      const result = await confessionsApi.getFeed(nextPage, initialLimit);
      setConfessions((prev) => [...prev, ...result.data]);
      setPage(nextPage);
      setHasMore(result.meta.current_page < result.meta.last_page);
      onLoadMore?.();
      return {
        data: result.data,
        meta: result.meta,
      };
    });
  };

  // Handle confession reaction
  const handleReact = async (confessionId: number) => {
    await confessionsApi.react(confessionId);
    // Refetch the confession to get updated reaction count
    // In a real app, you might update local state instead
  };

  return (
    <div className="confession-wall">
      {/* Masonry grid of confessions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {confessions.map((confession) => (
          <ConfessionCard
            key={confession.id}
            confession={confession}
            onReact={handleReact}
          />
        ))}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading confessions...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center py-8">
          <p className="text-red-500">Failed to load confessions</p>
        </div>
      )}

      {/* Load more button */}
      {!loading && hasMore && (
        <div className="text-center">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Load More Confessions
          </button>
        </div>
      )}

      {/* No more confessions message */}
      {!hasMore && confessions.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No more confessions to load</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && confessions.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-gray-500">No confessions yet. Be the first to share!</p>
        </div>
      )}
    </div>
  );
}
