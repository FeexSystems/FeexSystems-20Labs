import React, { useEffect, useState } from 'react';
import * as Sentry from '@sentry/react';

interface PerformanceMetric {
  name: string;
  value: number;
  threshold: number;
  unit: string;
}

interface PerformanceDashboardProps {
  featureName: string;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ featureName }) => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const transaction = Sentry.startTransaction({
      name: `dashboard.${featureName}`,
      op: 'performance.view'
    });

    const loadMetrics = async () => {
      try {
        // Simulate loading performance metrics
        // In a real app, this would come from your backend
        const mockMetrics: PerformanceMetric[] = [
          { name: 'Page Load', value: 1200, threshold: 1000, unit: 'ms' },
          { name: 'First Input Delay', value: 75, threshold: 100, unit: 'ms' },
          { name: 'Time to Interactive', value: 2200, threshold: 2000, unit: 'ms' },
          { name: 'Error Rate', value: 0.02, threshold: 0.05, unit: '%' }
        ];

        setMetrics(mockMetrics);
      } catch (error) {
        Sentry.captureException(error);
      } finally {
        setLoading(false);
        transaction.finish();
      }
    };

    loadMetrics();
  }, [featureName]);

  if (loading) {
    return <div>Loading performance metrics...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Performance Metrics: {featureName}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.name}
            className={`p-4 rounded-lg ${
              metric.value > metric.threshold ? 'bg-red-50' : 'bg-green-50'
            }`}
          >
            <div className="text-sm font-medium text-gray-600">{metric.name}</div>
            <div className="mt-1 flex items-baseline">
              <div className="text-2xl font-semibold">
                {metric.value}
                <span className="text-sm ml-1">{metric.unit}</span>
              </div>
              <div className={`ml-2 text-sm ${
                metric.value > metric.threshold ? 'text-red-600' : 'text-green-600'
              }`}>
                {metric.value > metric.threshold ? '↑' : '↓'} Threshold: {metric.threshold}{metric.unit}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
