import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';
import { Express } from 'express';

export const initializeSentry = (app: Express) => {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      // Enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // Enable Express.js middleware tracing
      new Sentry.Integrations.Express({ app }),
      new ProfilingIntegration(),
    ],
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
    // Set profilesSampleRate to 1.0 to profile all transactions
    // We recommend adjusting this value in production
    profilesSampleRate: 1.0,
  });

  // The request handler must be the first middleware on the app
  app.use(Sentry.Handlers.requestHandler());

  // TracingHandler creates a trace for every incoming request
  app.use(Sentry.Handlers.tracingHandler());
};

export const setupSentryErrorHandler = (app: Express) => {
  // The error handler must be registered before any other error middleware and after all controllers
  app.use(Sentry.Handlers.errorHandler());

  // Optional fallthrough error handler
  app.use((err: any, req: any, res: any, next: any) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    // Capture error with additional context
    Sentry.withScope((scope) => {
      scope.setExtra('requestBody', req.body);
      scope.setExtra('requestQuery', req.query);
      scope.setExtra('requestParams', req.params);
      scope.setUser({
        id: req.user?.id,
        email: req.user?.email,
      });
      Sentry.captureException(err);
    });

    res.status(status).json({
      error: {
        message,
        status,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      }
    });
  });
};
