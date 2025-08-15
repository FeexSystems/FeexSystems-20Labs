import { useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/store/auth';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface AppInitializerProps {
  children: ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const { 
    initialize, 
    isInitialized, 
    isLoading, 
    error, 
    clearError 
  } = useAuthStore();

  useEffect(() => {
    // Initialize authentication state on app start
    initialize();
  }, [initialize]);

  // Show loading spinner during initialization
  if (!isInitialized && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <LoadingSpinner />
          <p className="text-muted-foreground">Initializing application...</p>
        </div>
      </div>
    );
  }

  // Show error state if initialization failed
  if (error && error.type === 'INITIALIZATION_ERROR') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to initialize the application. Please check your connection and try again.
            </AlertDescription>
          </Alert>
          <div className="flex justify-center space-x-2">
            <Button 
              onClick={() => {
                clearError();
                initialize();
              }}
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
            <Button 
              onClick={() => {
                clearError();
                window.location.reload();
              }}
              variant="default"
            >
              Reload Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render children once initialized
  return <>{children}</>;
}