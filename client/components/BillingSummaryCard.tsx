import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  AlertTriangle, 
  Calendar,
  TrendingUp,
  ExternalLink
} from 'lucide-react';
import { 
  type Subscription, 
  type UsageMetrics,
  SubscriptionStatus 
} from '@shared/api';

interface BillingSummaryCardProps {
  subscription: Subscription;
  usage?: UsageMetrics;
  onViewBilling: () => void;
  className?: string;
}

export function BillingSummaryCard({ 
  subscription, 
  usage, 
  onViewBilling, 
  className 
}: BillingSummaryCardProps) {
  const daysUntilRenewal = Math.ceil(
    (subscription.currentPeriodEnd.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

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

  const hasUsageWarnings = usage && subscription.plan && (
    (subscription.plan.limits.aiRequests !== -1 && 
     (usage.aiRequestsUsed / subscription.plan.limits.aiRequests) >= 0.8) ||
    (subscription.plan.limits.deployments !== -1 && 
     (usage.deploymentsUsed / subscription.plan.limits.deployments) >= 0.8) ||
    (subscription.plan.limits.securityScans !== -1 && 
     (usage.securityScansUsed / subscription.plan.limits.securityScans) >= 0.8) ||
    (subscription.plan.limits.storage !== -1 && 
     (usage.storageUsed / subscription.plan.limits.storage) >= 0.8)
  );

  const getHighestUsagePercentage = () => {
    if (!usage || !subscription.plan) return 0;
    
    const percentages = [
      subscription.plan.limits.aiRequests !== -1 ? 
        (usage.aiRequestsUsed / subscription.plan.limits.aiRequests) * 100 : 0,
      subscription.plan.limits.deployments !== -1 ? 
        (usage.deploymentsUsed / subscription.plan.limits.deployments) * 100 : 0,
      subscription.plan.limits.securityScans !== -1 ? 
        (usage.securityScansUsed / subscription.plan.limits.securityScans) * 100 : 0,
      subscription.plan.limits.storage !== -1 ? 
        (usage.storageUsed / subscription.plan.limits.storage) * 100 : 0
    ];
    
    return Math.max(...percentages);
  };

  const highestUsage = getHighestUsagePercentage();

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Subscription
          </span>
          <Badge variant="outline" className={getStatusColor(subscription.status)}>
            {subscription.status.toLowerCase().replace('_', ' ')}
          </Badge>
        </CardTitle>
        <CardDescription>
          {subscription.plan?.name} Plan - ${subscription.plan?.price}/{subscription.plan?.interval.toLowerCase()}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Renewal Information */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">
              {subscription.cancelAtPeriodEnd ? 'Ends in' : 'Renews in'} {daysUntilRenewal} days
            </span>
          </div>
          <span className="text-sm font-medium">
            {subscription.currentPeriodEnd.toLocaleDateString()}
          </span>
        </div>

        {/* Usage Summary */}
        {usage && subscription.plan && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Usage Overview</span>
              {hasUsageWarnings && (
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
              )}
            </div>
            <Progress 
              value={Math.min(highestUsage, 100)} 
              className={`h-2 ${
                highestUsage >= 90 ? '[&>div]:bg-red-500' :
                highestUsage >= 75 ? '[&>div]:bg-yellow-500' :
                '[&>div]:bg-green-500'
              }`}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Highest usage: {Math.round(highestUsage)}%</span>
              <span>Resets {usage.resetDate.toLocaleDateString()}</span>
            </div>
          </div>
        )}

        {/* Alerts */}
        {subscription.cancelAtPeriodEnd && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="w-4 h-4 text-orange-600 mr-2" />
              <span className="text-sm text-orange-800">
                Subscription will end on {subscription.currentPeriodEnd.toLocaleDateString()}
              </span>
            </div>
          </div>
        )}

        {subscription.status === SubscriptionStatus.PAST_DUE && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
              <span className="text-sm text-red-800">
                Payment overdue - update payment method
              </span>
            </div>
          </div>
        )}

        {hasUsageWarnings && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
              <span className="text-sm text-yellow-800">
                Approaching usage limits - consider upgrading
              </span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onViewBilling}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Manage Billing
        </Button>
      </CardContent>
    </Card>
  );
}