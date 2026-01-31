import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Zap,
  Shield,
  HardDrive
} from 'lucide-react';
import { type UsageMetrics, type SubscriptionPlan } from '@shared/api';

interface UsageDashboardProps {
  usage: UsageMetrics;
  limits: SubscriptionPlan['limits'];
  className?: string;
}

export function UsageDashboard({ usage, limits, className }: UsageDashboardProps) {
  const formatUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0; // unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const formatLimit = (limit: number) => {
    return limit === -1 ? 'Unlimited' : limit.toLocaleString();
  };

  const getUsageStatus = (used: number, limit: number) => {
    if (limit === -1) return 'unlimited';
    const percentage = (used / limit) * 100;
    if (percentage >= 90) return 'critical';
    if (percentage >= 75) return 'warning';
    return 'normal';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'unlimited':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'unlimited':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const usageItems = [
    {
      name: 'AI Requests',
      used: usage.aiRequestsUsed,
      limit: limits.aiRequests,
      icon: Zap,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Deployments',
      used: usage.deploymentsUsed,
      limit: limits.deployments,
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      name: 'Security Scans',
      used: usage.securityScansUsed,
      limit: limits.securityScans,
      icon: Shield,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      name: 'Storage',
      used: usage.storageUsed,
      limit: limits.storage,
      icon: HardDrive,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      unit: 'GB'
    }
  ];

  return (
    <div className={className}>
      {/* Usage Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {usageItems.map((item) => {
          const status = getUsageStatus(item.used, item.limit);
          const percentage = formatUsagePercentage(item.used, item.limit);
          const Icon = item.icon;

          return (
            <Card key={item.name}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${item.bgColor}`}>
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  {getStatusIcon(status)}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.used.toLocaleString()}{item.unit || ''} / {formatLimit(item.limit)}{item.unit || ''}
                    </span>
                  </div>
                  
                  <Progress 
                    value={percentage} 
                    className={`h-2 ${
                      status === 'critical' ? '[&>div]:bg-red-500' :
                      status === 'warning' ? '[&>div]:bg-yellow-500' :
                      '[&>div]:bg-green-500'
                    }`}
                  />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      {item.used.toLocaleString()}{item.unit || ''}
                    </span>
                    {status !== 'unlimited' && (
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getStatusColor(status)}`}
                      >
                        {percentage.toFixed(0)}% used
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Usage Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Usage Details
          </CardTitle>
          <CardDescription>
            Current billing period: {usage.period} • Resets on {usage.resetDate.toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {usageItems.map((item) => {
            const status = getUsageStatus(item.used, item.limit);
            const percentage = formatUsagePercentage(item.used, item.limit);

            return (
              <div key={item.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${item.bgColor}`}>
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <p className="text-sm text-muted-foreground">
                        {item.used.toLocaleString()}{item.unit || ''} of {formatLimit(item.limit)}{item.unit || ''} used
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(status)}
                    <span className="text-sm font-medium">
                      {status === 'unlimited' ? 'Unlimited' : `${percentage.toFixed(0)}%`}
                    </span>
                  </div>
                </div>
                
                <Progress 
                  value={percentage} 
                  className={`h-2 ${
                    status === 'critical' ? '[&>div]:bg-red-500' :
                    status === 'warning' ? '[&>div]:bg-yellow-500' :
                    '[&>div]:bg-green-500'
                  }`}
                />
                
                {status === 'critical' && (
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    You're approaching your limit. Consider upgrading your plan.
                  </p>
                )}
                {status === 'warning' && (
                  <p className="text-sm text-yellow-600 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    You've used {percentage.toFixed(0)}% of your limit.
                  </p>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Additional Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bandwidth Usage</CardTitle>
            <CardDescription>Data transfer this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usage.bandwidthUsed.toFixed(1)} GB</div>
            <p className="text-sm text-muted-foreground mt-1">
              Bandwidth usage is not limited on your current plan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Usage Trends</CardTitle>
            <CardDescription>Compared to last period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-sm text-green-600">+12% increase</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Your usage is trending upward
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}