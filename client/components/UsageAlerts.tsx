import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  TrendingUp, 
  Zap,
  Shield,
  HardDrive,
  GitBranch
} from 'lucide-react';
import { 
  type UsageMetrics, 
  type SubscriptionPlan 
} from '@/../../shared/api';

interface UsageAlertsProps {
  usage: UsageMetrics;
  limits: SubscriptionPlan['limits'];
  onUpgrade?: () => void;
  className?: string;
}

interface UsageAlert {
  type: 'warning' | 'critical' | 'info';
  title: string;
  message: string;
  icon: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function UsageAlerts({ usage, limits, onUpgrade, className }: UsageAlertsProps) {
  const alerts: UsageAlert[] = [];

  const checkUsage = (used: number, limit: number, name: string, icon: React.ReactNode) => {
    if (limit === -1) return; // Unlimited

    const percentage = (used / limit) * 100;
    
    if (percentage >= 95) {
      alerts.push({
        type: 'critical',
        title: `${name} Limit Reached`,
        message: `You've used ${used.toLocaleString()} of ${limit.toLocaleString()} ${name.toLowerCase()}. Upgrade to continue using this feature.`,
        icon,
        action: onUpgrade ? {
          label: 'Upgrade Plan',
          onClick: onUpgrade
        } : undefined
      });
    } else if (percentage >= 80) {
      alerts.push({
        type: 'warning',
        title: `${name} Usage High`,
        message: `You've used ${Math.round(percentage)}% of your ${name.toLowerCase()} limit (${used.toLocaleString()}/${limit.toLocaleString()}). Consider upgrading soon.`,
        icon,
        action: onUpgrade ? {
          label: 'View Plans',
          onClick: onUpgrade
        } : undefined
      });
    }
  };

  // Check each usage metric
  checkUsage(usage.aiRequestsUsed, limits.aiRequests, 'AI Requests', <Zap className="w-4 h-4" />);
  checkUsage(usage.deploymentsUsed, limits.deployments, 'Deployments', <GitBranch className="w-4 h-4" />);
  checkUsage(usage.securityScansUsed, limits.securityScans, 'Security Scans', <Shield className="w-4 h-4" />);
  checkUsage(usage.storageUsed, limits.storage, 'Storage GB', <HardDrive className="w-4 h-4" />);

  // Add period-based alerts
  const periodEnd = new Date(usage.resetDate);
  const now = new Date();
  const daysUntilReset = Math.ceil((periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilReset <= 3 && daysUntilReset > 0) {
    const totalUsage = usage.aiRequestsUsed + usage.deploymentsUsed + usage.securityScansUsed;
    if (totalUsage > 0) {
      alerts.push({
        type: 'info',
        title: 'Usage Reset Soon',
        message: `Your usage limits will reset in ${daysUntilReset} day${daysUntilReset === 1 ? '' : 's'} on ${periodEnd.toLocaleDateString()}.`,
        icon: <TrendingUp className="w-4 h-4" />
      });
    }
  }

  if (alerts.length === 0) return null;

  const getAlertStyles = (type: UsageAlert['type']) => {
    switch (type) {
      case 'critical':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getAlertIconColor = (type: UsageAlert['type']) => {
    switch (type) {
      case 'critical':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      case 'info':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getAlertTextColor = (type: UsageAlert['type']) => {
    switch (type) {
      case 'critical':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
      default:
        return 'text-gray-800';
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {alerts.map((alert, index) => (
        <Alert key={index} className={getAlertStyles(alert.type)}>
          <div className={`flex items-start space-x-3 ${getAlertIconColor(alert.type)}`}>
            {alert.icon}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h4 className={`font-medium ${getAlertTextColor(alert.type)}`}>
                    {alert.title}
                  </h4>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      alert.type === 'critical' ? 'border-red-300 text-red-700' :
                      alert.type === 'warning' ? 'border-yellow-300 text-yellow-700' :
                      'border-blue-300 text-blue-700'
                    }`}
                  >
                    {alert.type.toUpperCase()}
                  </Badge>
                </div>
                {alert.action && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={alert.action.onClick}
                    className={`ml-4 ${
                      alert.type === 'critical' ? 'border-red-300 text-red-700 hover:bg-red-100' :
                      alert.type === 'warning' ? 'border-yellow-300 text-yellow-700 hover:bg-yellow-100' :
                      'border-blue-300 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    {alert.action.label}
                  </Button>
                )}
              </div>
              <AlertDescription className={`mt-1 ${getAlertTextColor(alert.type)}`}>
                {alert.message}
              </AlertDescription>
            </div>
          </div>
        </Alert>
      ))}
    </div>
  );
}