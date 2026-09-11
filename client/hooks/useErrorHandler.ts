import { useCallback } from 'react';

interface ErrorHandlerOptions {
  context?: Record<string, any>;
  tags?: Record<string, string>;
  level?: string;
  shouldRethrow?: boolean;
  onError?: (error: Error) => void;
}

export const useErrorHandler = (options: ErrorHandlerOptions = {}) => {
  const handleError = useCallback(
    async (error: Error, additionalContext?: Record<string, any>) => {
      const { context, tags, shouldRethrow = false, onError } = options;

      if (onError) {
        onError(error);
      }

      console.error('[Error Handler]:', error, {
        ...context,
        ...tags,
        ...additionalContext,
      });

      if (shouldRethrow) {
        throw error;
      }
    },
    [options]
  );

  return handleError;
};
