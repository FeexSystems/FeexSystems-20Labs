import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

// Performance monitoring for specific features
export const startFeatureTransaction = (
  name: string,
  options: { data?: Record<string, any>; tags?: Record<string, string> } = {}
) => {
  const transaction = Sentry.startTransaction({
    name: `feature.${name}`,
    op: 'feature',
    ...options,
  });

  // Set transaction as current
  Sentry.getCurrentHub().configureScope(scope => {
    scope.setSpan(transaction);
  });

  return transaction;
};

// Error monitoring for specific features
export const monitorFeature = (featureName: string) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const transaction = startFeatureTransaction(featureName);

      try {
        const result = await originalMethod.apply(this, args);
        transaction.setStatus('ok');
        return result;
      } catch (error) {
        Sentry.withScope((scope) => {
          scope.setTag('feature', featureName);
          scope.setExtra('arguments', args);
          scope.setExtra('context', this);
          Sentry.captureException(error);
        });
        transaction.setStatus('error');
        throw error;
      } finally {
        transaction.finish();
      }
    };

    return descriptor;
  };
};

// Custom error filters
export const errorFilter = (event: Sentry.Event) => {
  // Ignore certain network errors
  if (event.exception?.values?.[0]?.type === 'NetworkError') {
    return null;
  }

  // Rate limit certain frequent errors
  if (event.exception?.values?.[0]?.type === 'ValidationError') {
    const key = `validation-error-${Date.now()}`;
    const count = parseInt(sessionStorage.getItem(key) || '0');
    if (count > 5) {
      return null;
    }
    sessionStorage.setItem(key, (count + 1).toString());
  }

  return event;
};

// Performance monitoring configuration
export const configurePerformanceMonitoring = () => {
  Sentry.init({
    ...Sentry.init,
    integrations: [
      new BrowserTracing({
        tracingOrigins: ['localhost', 'your-production-domain.com'],
        routingInstrumentation: Sentry.reactRouterV6Instrumentation(
          React.useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes
        ),
      }),
    ],
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    profilesSampleRate: 0.1,
  });
};
