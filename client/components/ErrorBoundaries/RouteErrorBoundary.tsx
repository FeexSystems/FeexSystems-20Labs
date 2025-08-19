import React from 'react';
import * as Sentry from '@sentry/react';
import { Route } from 'react-router-dom';
import Dashboard from './Dashboard'; // Adjust the import based on your file structure

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  routeName: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class RouteErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.withScope((scope) => {
      scope.setTag('route', this.props.routeName);
      scope.setExtra('componentStack', errorInfo.componentStack);
      Sentry.captureException(error);
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">
            We've been notified and will fix this issue soon.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Try Again
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div className="mt-6 p-4 bg-red-50 rounded">
              <pre className="text-sm text-red-800 whitespace-pre-wrap">
                {this.state.error.toString()}
              </pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage in your routing
<Route 
  path="/dashboard" 
  element={
    <RouteErrorBoundary routeName="dashboard">
      <Dashboard />
    </RouteErrorBoundary>
  } 
/>

export default RouteErrorBoundary;
