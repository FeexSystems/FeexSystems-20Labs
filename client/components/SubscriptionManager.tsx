import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  CreditCard, 
  Calendar, 
  AlertCircle, 
  Settings, 
  X,
  CheckCircle,
  Clock
} from 'lucide-react';
import { 
  SubscriptionStatus, 
  type Subscription, 
  type SubscriptionPlan 
} from '@shared/api';

interface SubscriptionManagerProps {
  subscription: Subscription;
  onCancelSubscription: (data: { cancelAtPeriodEnd: boolean; reason?: string }) => void;
  onReactivateSubscription: () => void;
  isLoading?: boolean;
}

export function SubscriptionManager({ 
  subscription, 
  onCancelSubscription, 
  onReactivateSubscription,
  isLoading 
}: SubscriptionManagerProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(true);

  const getStatusBadge = (status: SubscriptionStatus) => {
    const variants = {
      [SubscriptionStatus.ACTIVE]: { variant: 'default' as const, color: 'text-green-700 bg-green-50 border-green-200' },
      [SubscriptionStatus.CANCELED]: { variant: 'destructive' as const, color: 'text-red-700 bg-red-50 border-red-200' },
      [SubscriptionStatus.PAST_DUE]: { variant: 'destructive' as const, color: 'text-red-700 bg-red-50 border-red-200' },
      [SubscriptionStatus.UNPAID]: { variant: 'destructive' as const, color: 'text-red-700 bg-red-50 border-red-200' },
      [SubscriptionStatus.TRIALING]: { variant: 'secondary' as const, color: 'text-blue-700 bg-blue-50 border-blue-200' }
    };

    const config = variants[status] || { variant: 'secondary' as const, color: 'text-gray-700 bg-gray-50 border-gray-200' };

    return (
      <Badge variant="outline" className={config.color}>
        {status.toLowerCase().replace('_', ' ')}
      </Badge>
    );
  };

  const getStatusIcon = (status: SubscriptionStatus) => {
    switch (status) {
      case SubscriptionStatus.ACTIVE:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case SubscriptionStatus.TRIALING:
        return <Clock className="w-5 h-5 text-blue-500" />;
      case SubscriptionStatus.CANCELED:
      case SubscriptionStatus.PAST_DUE:
      case SubscriptionStatus.UNPAID:
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleCancel = () => {
    onCancelSubscription({
      cancelAtPeriodEnd,
      reason: cancelReason.trim() || undefined
    });
    setShowCancelDialog(false);
    setCancelReason('');
  };

  const isActive = subscription.status === SubscriptionStatus.ACTIVE;
  const isCanceled = subscription.status === SubscriptionStatus.CANCELED;
  const isPastDue = subscription.status === SubscriptionStatus.PAST_DUE;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Subscription Management
          </span>
          {getStatusBadge(subscription.status)}
        </CardTitle>
        <CardDescription>
          Manage your subscription settings and billing preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Plan Info */}
        <div className="flex items-start space-x-4 p-4 bg-muted/50 rounded-lg">
          <div className="p-2 bg-primary/10 rounded-lg">
            {getStatusIcon(subscription.status)}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{subscription.plan?.name}</h3>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  ${subscription.plan?.price}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{subscription.plan?.interval.toLowerCase()}
                  </span>
                </p>
              </div>
            </div>
            <p className="text-muted-foreground mt-1">{subscription.plan?.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current period:</span>
                <span>
                  {subscription.currentPeriodStart.toLocaleDateString()} - {subscription.currentPeriodEnd.toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Next billing:</span>
                <span>{subscription.currentPeriodEnd.toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status-specific alerts */}
        {subscription.cancelAtPeriodEnd && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              Your subscription will be canceled on {subscription.currentPeriodEnd.toLocaleDateString()}. 
              You'll continue to have access until then.
            </AlertDescription>
          </Alert>
        )}

        {isPastDue && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Your subscription is past due. Please update your payment method to continue service.
            </AlertDescription>
          </Alert>
        )}

        {subscription.status === SubscriptionStatus.TRIALING && (
          <Alert className="border-blue-200 bg-blue-50">
            <Clock className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              You're currently on a trial period. Your subscription will begin on {subscription.currentPeriodEnd.toLocaleDateString()}.
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {isActive && !subscription.cancelAtPeriodEnd && (
            <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                  <X className="w-4 h-4 mr-2" />
                  Cancel Subscription
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cancel Subscription</DialogTitle>
                  <DialogDescription>
                    We're sorry to see you go. Your subscription will remain active until the end of your current billing period.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cancelReason">Reason for canceling (optional)</Label>
                    <Textarea
                      id="cancelReason"
                      placeholder="Help us improve by telling us why you're canceling..."
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="cancelAtPeriodEnd"
                      checked={cancelAtPeriodEnd}
                      onChange={(e) => setCancelAtPeriodEnd(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="cancelAtPeriodEnd" className="text-sm">
                      Cancel at the end of the current billing period ({subscription.currentPeriodEnd.toLocaleDateString()})
                    </Label>
                  </div>
                  
                  {!cancelAtPeriodEnd && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        Canceling immediately will end your access right away. No refund will be provided for the remaining period.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                      Keep Subscription
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleCancel}
                      disabled={isLoading}
                    >
                      {cancelAtPeriodEnd ? 'Cancel at Period End' : 'Cancel Now'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {subscription.cancelAtPeriodEnd && (
            <Button 
              variant="outline" 
              onClick={onReactivateSubscription}
              disabled={isLoading}
              className="text-green-600 border-green-200 hover:bg-green-50"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Reactivate Subscription
            </Button>
          )}

          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            View Billing History
          </Button>

          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Update Payment Method
          </Button>
        </div>

        {/* Subscription Benefits */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Your Plan Includes:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {subscription.plan?.features.map((feature, index) => (
              <div key={index} className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}