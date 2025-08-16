import { useEffect, useState, useCallback } from 'react';
import { webSocketService, StatusUpdate, ProgressUpdate } from '@/lib/services/websocket';

export interface RealtimeStatus {
  id: string;
  type: 'deployment' | 'scan' | 'ai_request';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress?: number;
  message?: string;
  stage?: string;
  estimatedTimeRemaining?: number;
  metadata?: Record<string, any>;
  lastUpdated: Date;
}

interface UseRealtimeStatusOptions {
  resourceId?: string;
  resourceType?: 'deployment' | 'scan' | 'ai_request';
  autoSubscribe?: boolean;
}

export function useRealtimeStatus(options: UseRealtimeStatusOptions = {}) {
  const { resourceId, resourceType, autoSubscribe = true } = options;
  const [statuses, setStatuses] = useState<Map<string, RealtimeStatus>>(new Map());
  const [isConnected, setIsConnected] = useState(webSocketService.isConnected);

  const handleStatusUpdate = useCallback((event: CustomEvent<StatusUpdate>) => {
    const update = event.detail;
    
    // Filter by resource type if specified
    if (resourceType && update.type !== resourceType) {
      return;
    }
    
    // Filter by resource ID if specified
    if (resourceId && update.id !== resourceId) {
      return;
    }

    setStatuses(prev => {
      const newStatuses = new Map(prev);
      const existing = newStatuses.get(update.id);
      
      newStatuses.set(update.id, {
        ...existing,
        id: update.id,
        type: update.type,
        status: update.status,
        message: update.message,
        metadata: update.metadata,
        progress: update.progress,
        lastUpdated: new Date()
      });
      
      return newStatuses;
    });
  }, [resourceId, resourceType]);

  const handleProgressUpdate = useCallback((event: CustomEvent<ProgressUpdate>) => {
    const update = event.detail;
    
    // Filter by resource type if specified
    if (resourceType && update.type !== resourceType) {
      return;
    }
    
    // Filter by resource ID if specified
    if (resourceId && update.id !== resourceId) {
      return;
    }

    setStatuses(prev => {
      const newStatuses = new Map(prev);
      const existing = newStatuses.get(update.id);
      
      if (existing) {
        newStatuses.set(update.id, {
          ...existing,
          progress: update.progress,
          stage: update.stage,
          message: update.message || existing.message,
          estimatedTimeRemaining: update.estimatedTimeRemaining,
          lastUpdated: new Date()
        });
      }
      
      return newStatuses;
    });
  }, [resourceId, resourceType]);

  useEffect(() => {
    if (!autoSubscribe) return;

    // Listen for WebSocket connection status
    const checkConnection = () => {
      setIsConnected(webSocketService.isConnected);
    };

    // Set up event listeners for status and progress updates
    window.addEventListener('status_update', handleStatusUpdate as EventListener);
    window.addEventListener('progress_update', handleProgressUpdate as EventListener);
    
    // Check connection status periodically
    const connectionInterval = setInterval(checkConnection, 1000);
    
    // Subscribe to specific resource if provided
    if (resourceId && resourceType) {
      webSocketService.emit('subscribe', { 
        type: resourceType, 
        id: resourceId 
      });
    }

    return () => {
      window.removeEventListener('status_update', handleStatusUpdate as EventListener);
      window.removeEventListener('progress_update', handleProgressUpdate as EventListener);
      clearInterval(connectionInterval);
      
      // Unsubscribe from specific resource if provided
      if (resourceId && resourceType) {
        webSocketService.emit('unsubscribe', { 
          type: resourceType, 
          id: resourceId 
        });
      }
    };
  }, [autoSubscribe, resourceId, resourceType, handleStatusUpdate, handleProgressUpdate]);

  const getStatus = useCallback((id: string): RealtimeStatus | undefined => {
    return statuses.get(id);
  }, [statuses]);

  const getAllStatuses = useCallback((): RealtimeStatus[] => {
    return Array.from(statuses.values());
  }, [statuses]);

  const subscribeToResource = useCallback((id: string, type: 'deployment' | 'scan' | 'ai_request') => {
    webSocketService.emit('subscribe', { type, id });
  }, []);

  const unsubscribeFromResource = useCallback((id: string, type: 'deployment' | 'scan' | 'ai_request') => {
    webSocketService.emit('unsubscribe', { type, id });
  }, []);

  const clearStatus = useCallback((id: string) => {
    setStatuses(prev => {
      const newStatuses = new Map(prev);
      newStatuses.delete(id);
      return newStatuses;
    });
  }, []);

  const clearAllStatuses = useCallback(() => {
    setStatuses(new Map());
  }, []);

  return {
    statuses: getAllStatuses(),
    getStatus,
    isConnected,
    subscribeToResource,
    unsubscribeFromResource,
    clearStatus,
    clearAllStatuses
  };
}

// Hook specifically for deployment status updates
export function useDeploymentStatus(deploymentId?: string) {
  return useRealtimeStatus({
    resourceId: deploymentId,
    resourceType: 'deployment'
  });
}

// Hook specifically for security scan status updates
export function useSecurityScanStatus(scanId?: string) {
  return useRealtimeStatus({
    resourceId: scanId,
    resourceType: 'scan'
  });
}

// Hook specifically for AI request status updates
export function useAIRequestStatus(requestId?: string) {
  return useRealtimeStatus({
    resourceId: requestId,
    resourceType: 'ai_request'
  });
}