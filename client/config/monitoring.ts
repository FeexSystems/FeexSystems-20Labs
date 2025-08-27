// src/config/monitoring.ts
export const monitoringConfig = {
  sentry: {
    // Sample rates for different event types
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Environments to enable monitoring
    enabledEnvironments: ['production', 'staging'],
    
    // Error filtering
    ignoredErrors: [
      'Network request failed',
      'Failed to fetch',
      'AbortError',
      'ChunkLoadError',
    ],
    
    // Performance thresholds (in milliseconds)
    performance: {
      slowTransaction: 1000,
      verySlowTransaction: 3000,
      timeoutTransaction: 5000,
    },
    
    // Feature monitoring
    features: {
      auth: {
        sampleRate: 1.0,
        errorThreshold: 0.1,
      },
      billing: {
        sampleRate: 1.0,
        errorThreshold: 0.05,
      },
      ai: {
        sampleRate: 0.5,
        errorThreshold: 0.2,
      },
    },
    
    // Alert thresholds
    alerts: {
      errorRate: {
        critical: 0.1,
        warning: 0.05,
      },
      responseTime: {
        critical: 3000,
        warning: 1000,
      },
    },
  },
};
