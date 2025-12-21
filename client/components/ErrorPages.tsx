import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AlertTriangle, 
  Wifi, 
  Shield, 
  Clock, 
  Search, 
  RefreshCw, 
  Home,
  ArrowLeft 
} from 'lucide-react';

interface ErrorPageProps {
  onRetry?: () => void;
  onGoHome?: () => void;
  onGoBack?: () => void;
}

// Network/Connection Error
export function NetworkErrorPage({ onRetry, onGoHome }: ErrorPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <Wifi className="h-16 w-16 text-muted-foreground" />
          </div>
          <CardTitle>Connection Problem</CardTitle>
          <CardDescription>
            We're having trouble connecting to our servers. Please check your internet connection and try again.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button onClick={onRetry} className="w-full flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Button onClick={onGoHome} variant="outline" className="w-full flex items-center gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            <p>If the problem persists, please check your internet connection or try again later.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Authentication Error
export function AuthErrorPage({ onRetry, onGoHome }: ErrorPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <Shield className="h-16 w-16 text-destructive" />
          </div>
          <CardTitle>Authentication Required</CardTitle>
          <CardDescription>
            Your session has expired or you don't have permission to access this page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button onClick={() => window.location.href = '/login'} className="w-full">
              Sign In
            </Button>
            <Button onClick={onGoHome} variant="outline" className="w-full flex items-center gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            <p>Please sign in to continue or contact support if you believe this is an error.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Timeout Error
export function TimeoutErrorPage({ onRetry, onGoHome }: ErrorPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <Clock className="h-16 w-16 text-orange-500" />
          </div>
          <CardTitle>Request Timeout</CardTitle>
          <CardDescription>
            The request took too long to complete. This might be due to a slow connection or server issues.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button onClick={onRetry} className="w-full flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Button onClick={onGoHome} variant="outline" className="w-full flex items-center gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            <p>If this continues to happen, please try again later or contact support.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 404 Not Found Error
export function NotFoundErrorPage({ onGoHome, onGoBack }: ErrorPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <Search className="h-16 w-16 text-muted-foreground" />
          </div>
          <CardTitle>Page Not Found</CardTitle>
          <CardDescription>
            The page you're looking for doesn't exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button onClick={onGoBack} className="w-full flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            <Button onClick={onGoHome} variant="outline" className="w-full flex items-center gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            <p>Check the URL for typos or use the navigation menu to find what you're looking for.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Server Error (5xx)
export function ServerErrorPage({ onRetry, onGoHome }: ErrorPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <AlertTriangle className="h-16 w-16 text-destructive" />
          </div>
          <CardTitle>Server Error</CardTitle>
          <CardDescription>
            Something went wrong on our end. We're working to fix this issue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button onClick={onRetry} className="w-full flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Button onClick={onGoHome} variant="outline" className="w-full flex items-center gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            <p>Our team has been notified. Please try again in a few minutes.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Generic Error Page
export function GenericErrorPage({ onRetry, onGoHome }: ErrorPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <AlertTriangle className="h-16 w-16 text-destructive" />
          </div>
          <CardTitle>Something Went Wrong</CardTitle>
          <CardDescription>
            An unexpected error occurred. Please try again or contact support if the problem persists.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button onClick={onRetry} className="w-full flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Button onClick={onGoHome} variant="outline" className="w-full flex items-center gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            <p>If this problem continues, please contact our support team.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Error page selector based on error type
interface ErrorPageSelectorProps extends ErrorPageProps {
  errorType?: 'network' | 'auth' | 'timeout' | 'notfound' | 'server' | 'generic';
}

export function ErrorPageSelector({ errorType = 'generic', ...props }: ErrorPageSelectorProps) {
  switch (errorType) {
    case 'network':
      return <NetworkErrorPage {...props} />;
    case 'auth':
      return <AuthErrorPage {...props} />;
    case 'timeout':
      return <TimeoutErrorPage {...props} />;
    case 'notfound':
      return <NotFoundErrorPage {...props} />;
    case 'server':
      return <ServerErrorPage {...props} />;
    default:
      return <GenericErrorPage {...props} />;
  }
}