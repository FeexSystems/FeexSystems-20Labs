import { useEffect, useRef } from 'react';
import * as Sentry from '@sentry/react';

interface PerformanceMetrics {
  startTime: number;
  loadTime?: number;
  interactionCount: number;
  errorCount: number;
  lastInteraction?: number;
}

export const useFeatureMonitoring = (featureName: string, options = {}) => {
  const metrics = useRef<PerformanceMetrics>({
    startTime: Date.now(),
    interactionCount: 0,
    errorCount: 0
  });

  const transaction = useRef<Sentry.Transaction | null>(null);

  useEffect(() => {
    // Start feature transaction
    transaction.current = Sentry.startTransaction({
      name: `feature.${featureName}`,
      op: 'feature'
    });

    // Set load time when component mounts
    metrics.current.loadTime = Date.now() - metrics.current.startTime;

    // Send metrics on unmount
    return () => {
      if (transaction.current) {
        // Add all metrics as transaction data
        transaction.current.setData('metrics', {
          loadTime: metrics.current.loadTime,
          interactionCount: metrics.current.interactionCount,
          errorCount: metrics.current.errorCount,
          totalDuration: Date.now() - metrics.current.startTime
        });

        transaction.current.finish();
      }
    };
  }, [featureName]);

  const trackInteraction = (interactionName: string) => {
    metrics.current.interactionCount++;
    metrics.current.lastInteraction = Date.now();

    const span = transaction.current?.startChild({
      op: 'interaction',
      description: interactionName
    });

    return () => span?.finish();
  };

  const trackError = (error: Error) => {
    metrics.current.errorCount++;
    
    Sentry.withScope(scope => {
      scope.setTag('feature', featureName);
      scope.setExtra('metrics', metrics.current);
      Sentry.captureException(error);
    });
  };

  return {
    trackInteraction,
    trackError,
    getMetrics: () => ({ ...metrics.current })
  };
};
