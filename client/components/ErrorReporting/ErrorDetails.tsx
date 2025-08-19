import React from 'react';
import * as Sentry from '@sentry/react';

interface ErrorDetailsProps {
  error: Error;
  componentStack?: string;
  eventId?: string;
}

export const ErrorDetails: React.FC<ErrorDetailsProps> = ({ error, componentStack, eventId }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 w-full">
          <h3 className="text-sm font-medium text-red-800">{error.name}</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{error.message}</p>
          </div>
          {componentStack && (
            <div className="mt-2">
              <details className="text-xs">
                <summary className="text-red-800 cursor-pointer">View Stack Trace</summary>
                <pre className="mt-2 whitespace-pre-wrap font-mono bg-red-100 p-2 rounded">
                  {componentStack}
                </pre>
              </details>
            </div>
          )}
          {eventId && (
            <div className="mt-2 text-xs text-red-600">
              Event ID: {eventId}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
