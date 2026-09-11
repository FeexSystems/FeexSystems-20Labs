import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  startTime: number;
  loadTime?: number;
  interactionCount: number;
  errorCount: number;
  lastInteraction?: number;
}

export const useFeatureMonitoring = (featureName: string, _options = {}) => {
  const metrics = useRef<PerformanceMetrics>({
    startTime: Date.now(),
    interactionCount: 0,
    errorCount: 0
  });

  useEffect(() => {
    metrics.current.loadTime = Date.now() - metrics.current.startTime;
  }, [featureName]);

  const trackInteraction = (_interactionName: string) => {
    metrics.current.interactionCount++;
    metrics.current.lastInteraction = Date.now();
    return () => {};
  };

  const trackError = (error: Error) => {
    metrics.current.errorCount++;
    console.error(`[Feature Error in ${featureName}]:`, error);
  };

  return {
    trackInteraction,
    trackError,
    getMetrics: () => ({ ...metrics.current })
  };
};
