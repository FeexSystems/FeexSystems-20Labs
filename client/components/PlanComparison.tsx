import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import { PlanChangeDialog } from '@/components/PlanChangeDialog';
import { type SubscriptionPlan, type Subscription } from '@/../../shared/api';

interface PlanComparisonProps {
  plans: SubscriptionPlan[];
  currentPlanId?: string;
  currentSubscription?: Subscription;
  onSelectPlan: (planId: string) => void;
  isLoading?: boolean;
}

export function PlanComparison({ plans, currentPlanId, currentSubscription, onSelectPlan, isLoading }: PlanComparisonProps) {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showChangeDialog, setShowChangeDialog] = useState(false);

  const formatLimit = (limit: number) => {
    return limit === -1 ? 'Unlimited' : limit.toLocaleString();
  };

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    if (currentPlanId === plan.id) return;
    
    if (currentSubscription) {
      setSelectedPlan(plan);
      setShowChangeDialog(true);
    } else {
      onSelectPlan(plan.id);
    }
  };

  const handleConfirmChange = (planId: string) => {
    onSelectPlan(planId);
    setShowChangeDialog(false);
    setSelectedPlan(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <Card 
          key={plan.id} 
          className={`relative ${plan.isPopular ? 'border-primary shadow-lg' : ''} ${
            currentPlanId === plan.id ? 'ring-2 ring-primary' : ''
          }`}
        >
          {plan.isPopular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
            </div>
          )}
          
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-between">
              {plan.name}
              {currentPlanId === plan.id && (
                <Badge variant="secondary">Current</Badge>
              )}
            </CardTitle>
            <CardDescription>{plan.description}</CardDescription>
            <div className="text-4xl font-bold mt-4">
              ${plan.price}
              <span className="text-lg font-normal text-muted-foreground">
                /{plan.interval.toLowerCase()}
              </span>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Features List */}
            <ul className="space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Limits Breakdown */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Usage Limits</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">AI Requests:</span>
                  <span className="font-medium">{formatLimit(plan.limits.aiRequests)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deployments:</span>
                  <span className="font-medium">{formatLimit(plan.limits.deployments)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Security Scans:</span>
                  <span className="font-medium">{formatLimit(plan.limits.securityScans)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Team Members:</span>
                  <span className="font-medium">{formatLimit(plan.limits.teamMembers)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Storage:</span>
                  <span className="font-medium">{formatLimit(plan.limits.storage)}GB</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <Button 
              className="w-full" 
              variant={currentPlanId === plan.id ? "outline" : plan.isPopular ? "default" : "outline"}
              disabled={currentPlanId === plan.id || isLoading}
              onClick={() => handlePlanSelect(plan)}
            >
              {currentPlanId === plan.id 
                ? 'Current Plan' 
                : plan.isEnterprise 
                  ? 'Contact Sales' 
                  : 'Select Plan'
              }
            </Button>
          </CardContent>
        </Card>
      ))}

      {/* Plan Change Dialog */}
      {selectedPlan && currentSubscription && (
        <PlanChangeDialog
          isOpen={showChangeDialog}
          onClose={() => {
            setShowChangeDialog(false);
            setSelectedPlan(null);
          }}
          currentSubscription={currentSubscription}
          targetPlan={selectedPlan}
          onConfirm={handleConfirmChange}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}