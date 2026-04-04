'use client';

/**
 * Confession Card — individual confession in masonry wall
 * Displays text, metadata, and interactions
 */

import { Confession } from '@/lib/types/entities';
import { formatRelativeTime } from '@/lib/utils/date';
import { useState } from 'react';

interface ConfessionCardProps {
  confession: Confession;
  onReact?: (confessionId: number) => Promise<void>;
}

export function ConfessionCard({ confession, onReact }: ConfessionCardProps) {
  const [reacting, setReacting] = useState(false);
  const [reactionCount, setReactionCount] = useState(confession.reactions);

  const handleReact = async () => {
    if (!onReact || reacting) return;

    setReacting(true);
    try {
      await onReact(confession.id);
      setReactionCount((prev) => prev + 1);
    } catch (error) {
      console.error('Failed to react to confession', error);
    } finally {
      setReacting(false);
    }
  };

  return (
    <div className="confession-card bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col h-full">
      {/* Category tag (if present) */}
      {confession.category && (
        <div className="mb-2">
          <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
            {confession.category}
          </span>
        </div>
      )}

      {/* Confession text */}
      <p className="text-sm text-gray-800 leading-relaxed flex-grow mb-3 font-serif italic">
        "{confession.body}"
      </p>

      {/* Metadata & interactions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-500">
          {formatRelativeTime(new Date(confession.created_at))}
        </span>

        <div className="flex items-center gap-2">
          {/* React button */}
          <button
            onClick={handleReact}
            disabled={reacting}
            className="flex items-center gap-1 text-xs text-gray-600 hover:text-red-500 transition-colors disabled:opacity-50"
          >
            <span>❤️</span>
            <span>{reactionCount}</span>
          </button>

          {/* Featured indicator */}
          {confession.status === 'featured' && confession.amanda_response && (
            <span className="text-xs text-blue-600 font-medium">✓ Featured</span>
          )}
        </div>
      </div>

      {/* Amanda's response indicator */}
      {confession.amanda_response && (
        <div className="mt-3 pt-3 border-t border-blue-100 bg-blue-50 rounded p-2">
          <p className="text-xs text-blue-900 font-medium mb-1">Amanda's Take:</p>
          <p className="text-xs text-blue-800 leading-relaxed">
            {confession.amanda_response.substring(0, 100)}
            {confession.amanda_response.length > 100 ? '...' : ''}
          </p>
        </div>
      )}
    </div>
  );
}
