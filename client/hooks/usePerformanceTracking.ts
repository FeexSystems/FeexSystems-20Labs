import { useEffect, useRef } from 'react';
import * as Sentry from '@sentry/react';

interface PerformanceOptions {
  componentName: string;
  featureName?: string;
  trackProps?: boolean;
  trackState?: boolean;
  trackEffects?: boolean;
}

export const usePerformanceTracking = ({
  componentName,
  featureName,
  trackProps = false,
  trackState = false,
  trackEffects = false,
}: PerformanceOptions) => {
  const mountTime = useRef(Date.now());
  const renderCount = useRef(0);
  const transaction = useRef<Sentry.Transaction | null>(null);

  useEffect(() => {
    // Start transaction for component mount
    transaction.current = Sentry.startTransaction({
      name: `component.${componentName}`,
      op: 'component.mount',
      tags: {
        feature: featureName,
        component: componentName,
      },
    });

    const mountDuration = Date.now() - mountTime.current;
    transaction.current?.setData('mountDuration', mountDuration);

    return () => {
      if (transaction.current) {
        // Add final metrics before component unmounts
        transaction.current.setData('renderCount', renderCount.current);
        transaction.current.setData('totalLifetime', Date.now() - mountTime.current);
        transaction.current.finish();
      }
    };
  }, [componentName, featureName]);

  const trackRender = (props?: any, state?: any) => {
    renderCount.current++;

    const span = transaction.current?.startChild({
      op: 'component.render',
      description: `Render #${renderCount.current}`,
    });

    if (trackProps && props) {
      span?.setData('props', props);
    }

    if (trackState && state) {
      span?.setData('state', state);
    }

    return span;
  };

  const trackEffect = (effectName: string) => {
    if (!trackEffects) return;

    const span = transaction.current?.startChild({
      op: 'component.effect',
      description: effectName,
    });

    return {
      finish: () => span?.finish(),
      setData: (data: Record<string, any>) => span?.setData('effectData', data),
    };
  };

  const trackInteraction = (interactionName: string) => {
    const span = transaction.current?.startChild({
      op: 'component.interaction',
      description: interactionName,
    });

    return {
      finish: () => span?.finish(),
      setData: (data: Record<string, any>) => span?.setData('interactionData', data),
    };
  };

  return {
    trackRender,
    trackEffect,
    trackInteraction,
  };
};
