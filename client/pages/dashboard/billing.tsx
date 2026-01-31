import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { AlertCircle, TrendingUp, DollarSign, Calendar, CreditCard } from 'lucide-react';
import { PlanComparison } from '@/components/PlanComparison';
import { UsageDashboard } from '@/components/UsageDashboard';
import { InvoiceHistory } from '@/components/InvoiceHistory';
import { PaymentMethodManager } from '@/components/PaymentMethodManager';
import { SubscriptionManager } from '@/components/SubscriptionManager';
import { BillingOverview } from '@/components/BillingOverview';
import { UsageAlerts } from '@/components/UsageAlerts';
import { BillingSettings } from '@/components/BillingSettings';
import { useBilling } from '@/hooks/use-billing';

export default function BillingPage() {
  const {
    subscription,
    plans,
    usage,
    invoices,
    paymentMethods,
    isLoading,
    error,
    changePlan,
    cancelSubscription,
    reactivateSubscription,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod
  } = useBilling();

  const handleDownloadInvoice = (invoiceId: string) => {
    console.log('Downloading invoice:', invoiceId);
  };

  const handleViewInvoice = (invoiceId: string) => {
    console.log('Viewing invoice:', invoiceId);
  };

  const handleDownloadAllInvoices = () => {
    console.log('Downloading all invoices');
  };

  if (isLoading && !subscription) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Billing & Subscription</h1>
          <p className="text-muted-foreground">
            Manage your subscription, view usage, and update payment methods
          </p>
        </div>
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Billing & Subscription</h1>
          <p className="text-muted-foreground">
            No subscription found. Please contact support.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground">
          Manage your subscription, view usage, and update payment methods
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plans" data-value="plans">Plans</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Usage Alerts */}
          {usage && subscription.plan && (
            <UsageAlerts 
              usage={usage}
              limits={subscription.plan.limits}
              onUpgrade={() => {
                // Switch to plans tab
                const plansTab = document.querySelector('[data-value="plans"]') as HTMLElement;
                plansTab?.click();
              }}
            />
          )}

          {/* Billing Overview */}
          <BillingOverview 
            subscription={subscription}
            usage={usage}
            invoices={invoices}
          />

          {/* Subscription Management */}
          <SubscriptionManager 
            subscription={subscription}
            onCancelSubscription={cancelSubscription}
            onReactivateSubscription={reactivateSubscription}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Available Plans</h2>
            <p className="text-muted-foreground">
              Choose the plan that best fits your needs. You can upgrade or downgrade at any time.
            </p>
          </div>

          <PlanComparison 
            plans={plans}
            currentPlanId={subscription.planId}
            currentSubscription={subscription}
            onSelectPlan={changePlan}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          {usage && (
            <UsageDashboard 
              usage={usage} 
              limits={subscription.plan?.limits || {
                aiRequests: 0,
                deployments: 0,
                securityScans: 0,
                teamMembers: 0,
                storage: 0
              }} 
            />
          )}
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <InvoiceHistory 
            invoices={invoices}
            onDownloadInvoice={handleDownloadInvoice}
            onViewInvoice={handleViewInvoice}
            onDownloadAll={handleDownloadAllInvoices}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="payment-methods" className="space-y-6">
          <PaymentMethodManager 
            paymentMethods={paymentMethods}
            onAddPaymentMethod={addPaymentMethod}
            onUpdatePaymentMethod={updatePaymentMethod}
            onDeletePaymentMethod={deletePaymentMethod}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <BillingSettings 
            onSave={(settings) => {
              console.log('Saving billing settings:', settings);
              // In a real app, this would call an API endpoint
            }}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}