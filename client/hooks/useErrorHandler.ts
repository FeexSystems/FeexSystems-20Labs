const handleError = useErrorHandler({
  context: { component: 'Dashboard' },
  tags: { feature: 'analytics' }
});

try {
  await loadDashboardData();
} catch (error) {
  handleError(error);
}import { useCallback } from 'react';
import * as Sentry from '@sentry/react';

interface ErrorHandlerOptions {
  context?: Record<string, any>;
  tags?: Record<string, string>;
  level?: Sentry.SeverityLevel;
  shouldRethrow?: boolean;
  onError?: (error: Error) => void;
}

export const useErrorHandler = (options: ErrorHandlerOptions = {}) => {
  const handleError = useCallback(
    async (error: Error, additionalContext?: Record<string, any>) => {
      const { context, tags, level, shouldRethrow = false, onError } = options;

      Sentry.withScope((scope) => {
        // Add tags
        if (tags) {
          Object.entries(tags).forEach(([key, value]) => {
            scope.setTag(key, value);
          });
        }

        // Add context
        if (context) {
          Object.entries(context).forEach(([key, value]) => {
            scope.setExtra(key, value);
          });
        }

        // Add additional context if provided
        if (additionalContext) {
          Object.entries(additionalContext).forEach(([key, value]) => {
            scope.setExtra(key, value);
          });
        }

        // Set error level
        if (level) {
          scope.setLevel(level);
        }

        // Capture the error
        Sentry.captureException(error);
      });

      // Call the onError callback if provided
      if (onError) {
        onError(error);
      }

      // Log to console in development
      if (process.env.NODE_ENV !== 'production') {
        console.error('[Error Handler]:', error);
        if (context || additionalContext) {
          console.error('[Error Context]:', {
            ...context,
            ...additionalContext,
          });
        }
      }

      // Rethrow the error if specified
      if (shouldRethrow) {
        throw error;
      }
    },
    [options]
  );

  return handleError;
};

// Example usage:
// const handleError = useErrorHandler({
//   context: { component: 'UserProfile' },
//   tags: { feature: 'settings' },
//   level: 'error',
//   shouldRethrow: false,
//   onError: (error) => {
//     // Custom error handling
//   },
// });
//
// try {
//   await someOperation();
// } catch (error) {
//   handleError(error, { additionalInfo: 'Failed during operation' });
// }
