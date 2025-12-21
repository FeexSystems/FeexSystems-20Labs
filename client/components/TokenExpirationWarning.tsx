import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { tokenManager } from '@/lib/token-manager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Clock, RefreshCw, LogOut, AlertTriangle } from 'lucide-react';

interface TokenExpirationWarningProps {
  warningThresholdMinutes?: number; // Show warning when token expires in X minutes
  criticalThresholdMinutes?: number; // Show critical warning when token expires in X minutes
}

export function TokenExpirationWarning({
  warningThresholdMinutes = 10,
  criticalThresholdMinutes = 2,
}: TokenExpirationWarningProps) {
  const { tokens, refreshToken, logout, isLoading } = useAuth();
  const [timeUntilExpiration, setTimeUntilExpiration] = useState<number | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [showCriticalWarning, setShowCriticalWarning] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!tokens) {
      setTimeUntilExpiration(null);
      setShowWarning(false);
      setShowCriticalWarning(false);
      return;
    }

    const updateTimer = () => {
      const timeLeft = tokenManager.getTimeUntilExpiration(tokens);
      setTimeUntilExpiration(timeLeft);

      if (timeLeft !== null) {
        // Show critical warning
        if (timeLeft <= criticalThresholdMinutes && timeLeft > 0) {
          setShowCriticalWarning(true);
          setShowWarning(false);
        }
        // Show regular warning
        else if (timeLeft <= warningThresholdMinutes && timeLeft > criticalThresholdMinutes) {
          setShowWarning(true);
          setShowCriticalWarning(false);
        }
        // Hide warnings
        else {
          setShowWarning(false);
          setShowCriticalWarning(false);
        }
      }
    };

    // Update immediately
    updateTimer();

    // Update every 30 seconds
    const interval = setInterval(updateTimer, 30000);

    return () => clearInterval(interval);
  }, [tokens, warningThresholdMinutes, criticalThresholdMinutes]);

  const handleRefreshToken = async () => {
    setIsRefreshing(true);
    try {
      await refreshToken();
      setShowWarning(false);
      setShowCriticalWarning(false);
    } catch (error) {
      console.error('Failed to refresh token:', error);
      // Token manager will handle logout on failure
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowWarning(false);
    setShowCriticalWarning(false);
  };

  const formatTimeRemaining = (minutes: number): string => {
    if (minutes < 1) {
      return 'Less than 1 minute';
    } else if (minutes === 1) {
      return '1 minute';
    } else {
      return `${minutes} minutes`;
    }
  };

  const getProgressValue = (minutes: number): number => {
    return Math.max(0, Math.min(100, (minutes / warningThresholdMinutes) * 100));
  };

  // Critical warning dialog
  if (showCriticalWarning && timeUntilExpiration !== null) {
    return (
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              <DialogTitle>Session Expiring Soon</DialogTitle>
            </div>
            <DialogDescription>
              Your session will expire in {formatTimeRemaining(timeUntilExpiration)}. 
              You will be automatically logged out unless you take action.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Time remaining</span>
                <span className="font-medium text-destructive">
                  {formatTimeRemaining(timeUntilExpiration)}
                </span>
              </div>
              <Progress 
                value={getProgressValue(timeUntilExpiration)} 
                className="h-2"
              />
            </div>
            
            {tokenManager.isCurrentlyRefreshing && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Refreshing session...
              </div>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              onClick={handleRefreshToken}
              disabled={isRefreshing || isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Extend Session'}
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Regular warning banner
  if (showWarning && timeUntilExpiration !== null) {
    return (
      <div className="fixed top-4 right-4 z-50 max-w-sm">
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <CardTitle className="text-sm">Session Warning</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs">
                {formatTimeRemaining(timeUntilExpiration)}
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Your session will expire soon
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-0 space-y-3">
            <Progress 
              value={getProgressValue(timeUntilExpiration)} 
              className="h-1"
            />
            
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleRefreshToken}
                disabled={isRefreshing || isLoading}
                className="flex-1 text-xs"
              >
                {isRefreshing ? 'Refreshing...' : 'Extend'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowWarning(false)}
                className="text-xs"
              >
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}

// Hook to get token expiration info
export function useTokenExpiration() {
  const { tokens } = useAuth();
  const [timeUntilExpiration, setTimeUntilExpiration] = useState<number | null>(null);
  const [isExpiringSoon, setIsExpiringSoon] = useState(false);

  useEffect(() => {
    if (!tokens) {
      setTimeUntilExpiration(null);
      setIsExpiringSoon(false);
      return;
    }

    const updateTimer = () => {
      const timeLeft = tokenManager.getTimeUntilExpiration(tokens);
      setTimeUntilExpiration(timeLeft);
      setIsExpiringSoon(timeLeft !== null && timeLeft <= 10);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 30000);

    return () => clearInterval(interval);
  }, [tokens]);

  return {
    timeUntilExpiration,
    isExpiringSoon,
    isTokenExpired: timeUntilExpiration !== null && timeUntilExpiration <= 0,
  };
}