import React from 'react';

const Sentry: any = typeof window !== 'undefined' ? (window as any).Sentry : undefined;

export const initializeSentry = () => {
  if (Boolean(import.meta.env?.PROD) && Sentry?.init) {
    try {
      Sentry.init({
        dsn: (import.meta as any).env?.VITE_SENTRY_DSN,
        tracesSampleRate: 1.0,
        enabled: true,
      });
    } catch {
      // Graceful fallback
    }
  }
};

// Higher-order component for error boundaries
export const withErrorBoundary = (Component: React.ComponentType<any>) => {
  return Component;
};

// Custom error logger
export const logError = (error: Error, context: Record<string, any> = {}) => {
  try {
    if (Sentry?.captureException) {
      Sentry.withScope?.((scope: any) => {
        Object.entries(context).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
        Sentry.captureException(error);
      });
    } else {
      console.error('[Error]:', error);
      if (Object.keys(context).length) {
        console.error('[Error Context]:', context);
      }
    }
  } catch {
    console.error('[Error]:', error);
  }
};
