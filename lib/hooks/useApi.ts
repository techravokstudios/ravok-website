'use client';

/**
 * Generic API hook for executing async operations
 * Handles loading, error, and success states
 */

import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: AxiosError | null;
}

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: AxiosError) => void;
}

export function useApi<T>(options?: UseApiOptions<T>) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (fn: () => Promise<T>) => {
      setState({ data: null, loading: true, error: null });

      try {
        const data = await fn();
        setState({ data, loading: false, error: null });
        options?.onSuccess?.(data);
        return data;
      } catch (error) {
        const axiosError = error as AxiosError;
        setState({ data: null, loading: false, error: axiosError });
        options?.onError?.(axiosError);
        throw axiosError;
      }
    },
    [options]
  );

  return {
    ...state,
    execute,
  };
}
