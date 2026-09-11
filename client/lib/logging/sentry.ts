import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

export const initializeSentry = () => {
  if (Boolean(import.meta.env?.PROD)) {
    Sentry.init({
      dsn: (import.meta as any).env?.VITE_SENTRY_DSN || (typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_SENTRY_DSN : undefined),
      integrations: [new BrowserTracing()],
      // Performance Monitoring
      tracesSampleRate: 1.0, // Capture 100% of the transactions
      // Set profilesSampleRate to 1.0 to profile all transactions
      // Adjust in production
      profilesSampleRate: 1.0,
      // Only enable in production
      enabled: Boolean(import.meta.env?.PROD),
      // Before an error is sent to Sentry, this code will be called
      beforeSend(event) {
        // Check if we have an error message
        if (event.message) {
          // Don't send errors for canceled requests or network issues
          if (
            event.message.includes('Request aborted') ||
            event.message.includes('Failed to fetch') ||
            event.message.includes('NetworkError') ||
            event.message.includes('Network request failed')
          ) {
            return null;
          }
        }
        return event;
      },
    });
  }
};

import React from 'react';

// Higher-order component for error boundaries
export const withErrorBoundary = (Component: React.ComponentType<any>) => {
  return Sentry.withErrorBoundary(Component, {
    fallback: () =>
      React.createElement(
        'div',
        { className: 'error-boundary-fallback' },
        React.createElement('h2', null, 'Something went wrong'),
        React.createElement('p', null, "We've been notified and will fix this issue soon."),
        React.createElement(
          'button',
          { onClick: () => window.location.reload(), className: 'refresh-button' },
          'Refresh Page'
        )
      ),
  });
};

// Custom error logger that sends to Sentry
export const logError = (error: Error, context: Record<string, any> = {}) => {
  Sentry.withScope((scope) => {
    // Add any additional context
    Object.entries(context).forEach(([key, value]) => {
      scope.setExtra(key, value);
    });
    
    // Capture the error
    Sentry.captureException(error);
  });

  // Also log to console in development
  if (!import.meta.env?.PROD) {
    console.error('[Error]:', error);
    if (Object.keys(context).length) {
      console.error('[Error Context]:', context);
    }
  }
};
