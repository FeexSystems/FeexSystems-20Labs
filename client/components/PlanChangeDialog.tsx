import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  Calendar,
  DollarSign
} from 'lucide-react';
import { 
  type SubscriptionPlan, 
  type Subscription,
  PlanInterval 
} from '@/../../shared/api';

interface PlanChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentSubscription: Subscription;
  targetPlan: SubscriptionPlan;
  onConfirm: (planId: string) => void;
  isLoading?: boolean;
}

export function PlanChangeDialog({ 
  isOpen, 
  onClose, 
  currentSubscription, 
  targetPlan, 
  onConfirm,
  isLoading 
}: PlanChangeDialogProps) {
  const [showProrationDetails, setShowProrationDetails] = useState(false);
  
  const currentPlan = currentSubscription.plan;
  if (!currentPlan) return null;

  const isUpgrade = targetPlan.price > currentPlan.price;
  const isDowngrade = targetPlan.price < currentPlan.price;
  const priceDifference = Math.abs(targetPlan.price - currentPlan.price);
  
  // Calculate proration (simplified calculation)
  const daysRemaining = Math.ceil(
    (currentSubscription.currentPeriodEnd.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  const totalDays = currentPlan.interval === PlanInterval.MONTH ? 30 : 365;
  const prorationFactor = daysRemaining / totalDays;
  const prorationAmount = isUpgrade 
    ? priceDifference * prorationFactor 
    : -priceDifference * prorationFactor;

  const handleConfirm = () => {
    onConfirm(targetPlan.id);
  };

  const formatLimit = (limit: number) => {
    return limit === -1 ? 'Unlimited' : limit.toLocaleString();
  };

  const compareFeature = (currentLimit: number, newLimit: number, name: string) => {
    if (currentLimit === newLimit) return null;
    
    const isIncrease = newLimit > currentLimit || newLimit === -1;
    const icon = isIncrease ? (
      <TrendingUp className="w-4 h-4 text-green-500" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-500" />
    );
    
    return (
      <div className="flex items-center justify-between py-2">
        <span className="text-sm">{name}</span>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {formatLimit(currentLimit)} → {formatLimit(newLimit)}
          </span>
          {icon}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {isUpgrade ? (
              <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
            ) : (
              <TrendingDown className="w-5 h-5 text-orange-500 mr-2" />
            )}
            {isUpgrade ? 'Upgrade' : 'Change'} to {targetPlan.name}
          </DialogTitle>
          <DialogDescription>
            Review the changes to your subscription before confirming
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plan Comparison */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Current Plan */}
              <div className="p-4 border rounded-lg">
                <div className="text-center">
                  <h4 className="font-medium">{currentPlan.name}</h4>
                  <p className="text-2xl font-bold mt-2">
                    ${currentPlan.price}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{currentPlan.interval.toLowerCase()}
                    </span>
                  </p>
                  <Badge variant="outline" className="mt-2">Current</Badge>
                </div>
              </div>

              {/* Target Plan */}
              <div className="p-4 border rounded-lg bg-primary/5">
                <div className="text-center">
                  <h4 className="font-medium">{targetPlan.name}</h4>
                  <p className="text-2xl font-bold mt-2">
                    ${targetPlan.price}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{targetPlan.interval.toLowerCase()}
                    </span>
                  </p>
                  <Badge className="mt-2">New Plan</Badge>
                </div>
              </div>
            </div>

            {/* Feature Changes */}
            <div className="space-y-2">
              <h4 className="font-medium">What's changing:</h4>
              <div className="border rounded-lg p-4 space-y-1">
                {compareFeature(currentPlan.limits.aiRequests, targetPlan.limits.aiRequests, 'AI Requests')}
                {compareFeature(currentPlan.limits.deployments, targetPlan.limits.deployments, 'Deployments')}
                {compareFeature(currentPlan.limits.securityScans, targetPlan.limits.securityScans, 'Security Scans')}
                {compareFeature(currentPlan.limits.teamMembers, targetPlan.limits.teamMembers, 'Team Members')}
                {compareFeature(currentPlan.limits.storage, targetPlan.limits.storage, 'Storage (GB)')}
              </div>
            </div>
          </div>

          {/* Billing Information */}
          <div className="space-y-4">
            <Separator />
            
            <div className="space-y-3">
              <h4 className="font-medium flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                Billing Details
              </h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Current plan ({daysRemaining} days remaining)</span>
                  <span>${currentPlan.price}</span>
                </div>
                
                {isUpgrade && prorationAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Prorated upgrade charge</span>
                    <span>+${prorationAmount.toFixed(2)}</span>
                  </div>
                )}
                
                {isDowngrade && (
                  <div className="flex justify-between">
                    <span>Credit for unused time</span>
                    <span>-${Math.abs(prorationAmount).toFixed(2)}</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between font-medium">
                  <span>
                    {isUpgrade ? 'Charge today' : isDowngrade ? 'Credit applied' : 'No charge'}
                  </span>
                  <span>
                    {isUpgrade && prorationAmount > 0 && `$${prorationAmount.toFixed(2)}`}
                    {isDowngrade && `$${Math.abs(prorationAmount).toFixed(2)} credit`}
                    {!isUpgrade && !isDowngrade && '$0.00'}
                  </span>
                </div>
                
                <div className="flex justify-between text-muted-foreground">
                  <span>Next billing date</span>
                  <span>{currentSubscription.currentPeriodEnd.toLocaleDateString()}</span>
                </div>
                
                <div className="flex justify-between text-muted-foreground">
                  <span>Next charge amount</span>
                  <span>${targetPlan.price}</span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProrationDetails(!showProrationDetails)}
                className="text-xs"
              >
                {showProrationDetails ? 'Hide' : 'Show'} proration details
              </Button>

              {showProrationDetails && (
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertTriangle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 text-sm">
                    <strong>Proration explained:</strong> You'll be charged/credited for the difference 
                    between your current plan and new plan, calculated for the remaining {daysRemaining} days 
                    in your current billing period. Your next full billing cycle starts on{' '}
                    {currentSubscription.currentPeriodEnd.toLocaleDateString()}.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Warnings */}
          {isDowngrade && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Downgrade Notice:</strong> Some features may become unavailable immediately. 
                If you're currently exceeding the new plan's limits, you may need to reduce usage 
                before the change takes effect.
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm}
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm {isUpgrade ? 'Upgrade' : 'Change'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}