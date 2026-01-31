import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { 
  type Subscription, 
  type UsageMetrics, 
  type Invoice,
  SubscriptionStatus 
} from '@shared/api';

interface BillingOverviewProps {
  subscription: Subscription;
  usage: UsageMetrics | null;
  invoices: Invoice[];
  className?: string;
}

export function BillingOverview({ subscription, usage, invoices, className }: BillingOverviewProps) {
  const currentPeriodDays = Math.ceil(
    (subscription.currentPeriodEnd.getTime() - subscription.currentPeriodStart.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  const daysRemaining = Math.ceil(
    (subscription.currentPeriodEnd.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  
  const periodProgress = Math.max(0, Math.min(100, ((currentPeriodDays - daysRemaining) / currentPeriodDays) * 100));
  
  const totalSpent = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);
  
  const pendingAmount = invoices
    .filter(inv => inv.status === 'open')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const getStatusColor = (status: SubscriptionStatus) => {
    switch (status) {
      case SubscriptionStatus.ACTIVE:
        return 'text-green-600 bg-green-50 border-green-200';
      case SubscriptionStatus.TRIALING:
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case SubscriptionStatus.CANCELED:
      case SubscriptionStatus.PAST_DUE:
      case SubscriptionStatus.UNPAID:
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getUsageStatus = (used: number, limit: number) => {
    if (limit === -1) return { percentage: 0, status: 'unlimited' };
    const percentage = Math.min((used / limit) * 100, 100);
    return {
      percentage,
      status: percentage >= 90 ? 'critical' : percentage >= 75 ? 'warning' : 'normal'
    };
  };

  return (
    <div className={className}>
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Current Plan */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <Badge variant="outline" className={getStatusColor(subscription.status)}>
                {subscription.status.toLowerCase().replace('_', ' ')}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{subscription.plan?.name}</p>
              <p className="text-sm text-muted-foreground">
                ${subscription.plan?.price}/{subscription.plan?.interval.toLowerCase()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Total Spent */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Total spent</p>
            </div>
          </CardContent>
        </Card>

        {/* Billing Period */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <Clock className="w-4 h-4 text-blue-500" />
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{daysRemaining}</p>
              <p className="text-sm text-muted-foreground">Days remaining</p>
            </div>
          </CardContent>
        </Card>

        {/* Usage Status */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Zap className="w-5 h-5 text-orange-600" />
              </div>
              {usage && (
                <div className="text-right">
                  {getUsageStatus(usage.aiRequestsUsed, subscription.plan?.limits.aiRequests || 0).status === 'critical' ? (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </div>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">
                {usage ? usage.aiRequestsUsed.toLocaleString() : '0'}
              </p>
              <p className="text-sm text-muted-foreground">AI requests used</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing Period Progress */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Current Billing Period
          </CardTitle>
          <CardDescription>
            {subscription.currentPeriodStart.toLocaleDateString()} - {subscription.currentPeriodEnd.toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Period Progress</span>
              <span>{Math.round(periodProgress)}% complete</span>
            </div>
            <Progress value={periodProgress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Started {subscription.currentPeriodStart.toLocaleDateString()}</span>
              <span>Ends {subscription.currentPeriodEnd.toLocaleDateString()}</span>
            </div>
          </div>

          {subscription.cancelAtPeriodEnd && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="w-4 h-4 text-orange-600 mr-2" />
                <span className="text-sm text-orange-800">
                  Your subscription will end on {subscription.currentPeriodEnd.toLocaleDateString()}
                </span>
              </div>
            </div>
          )}

          {pendingAmount > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                  <span className="text-sm text-red-800">
                    Outstanding balance: ${pendingAmount.toFixed(2)}
                  </span>
                </div>
                <Button size="sm" variant="outline">
                  Pay Now
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Summary */}
      {usage && subscription.plan && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Usage Summary
            </CardTitle>
            <CardDescription>
              Current usage for this billing period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  name: 'AI Requests',
                  used: usage.aiRequestsUsed,
                  limit: subscription.plan.limits.aiRequests,
                  color: 'text-blue-600'
                },
                {
                  name: 'Deployments',
                  used: usage.deploymentsUsed,
                  limit: subscription.plan.limits.deployments,
                  color: 'text-green-600'
                },
                {
                  name: 'Security Scans',
                  used: usage.securityScansUsed,
                  limit: subscription.plan.limits.securityScans,
                  color: 'text-orange-600'
                },
                {
                  name: 'Storage',
                  used: usage.storageUsed,
                  limit: subscription.plan.limits.storage,
                  color: 'text-purple-600',
                  unit: 'GB'
                }
              ].map((item) => {
                const { percentage, status } = getUsageStatus(item.used, item.limit);
                
                return (
                  <div key={item.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className={`text-xs ${item.color}`}>
                        {item.used.toLocaleString()}{item.unit || ''} / {item.limit === -1 ? '∞' : item.limit.toLocaleString()}{item.unit || ''}
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
                    {status === 'critical' && (
                      <p className="text-xs text-red-600">Approaching limit</p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}