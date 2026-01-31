import React, { useState, useEffect } from 'react';
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Users,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  RefreshCw,
  Download,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SubscriptionMetrics {
  totalSubscriptions: number;
  activeSubscriptions: number;
  revenue: {
    monthly: number;
    yearly: number;
    currency: string;
  };
  planDistribution: Array<{
    planId: string;
    planName: string;
    count: number;
    revenue: number;
  }>;
  churnRate: number;
  growthRate: number;
}

interface SubscriptionRecord {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  planName: string;
  status: 'ACTIVE' | 'CANCELED' | 'INCOMPLETE' | 'PAST_DUE' | 'TRIALING' | 'UNPAID';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  trialEnd?: string;
  monthlyRevenue: number;
  createdAt: string;
}

interface RevenueData {
  period: string;
  revenue: number;
  subscriptions: number;
  newSubscriptions: number;
  canceledSubscriptions: number;
}

export default function AdminSubscriptionsPage() {
  const [metrics, setMetrics] = useState<SubscriptionMetrics | null>(null);
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionRecord | null>(null);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    plan: 'all'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchSubscriptionData();
  }, [filters, currentPage, selectedPeriod]);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      // In real app, these would be API calls
      // const [metricsRes, subscriptionsRes, revenueRes] = await Promise.all([
      //   fetch('/api/admin/subscriptions/metrics'),
      //   fetch(`/api/admin/subscriptions?${new URLSearchParams(filters)}`),
      //   fetch(`/api/admin/subscriptions/revenue?period=${selectedPeriod}`)
      // ]);
      
      // Mock data
      const mockMetrics: SubscriptionMetrics = {
        totalSubscriptions: 1247,
        activeSubscriptions: 1089,
        revenue: {
          monthly: 45670,
          yearly: 548040,
          currency: 'USD'
        },
        planDistribution: [
          { planId: '1', planName: 'Starter', count: 567, revenue: 11340 },
          { planId: '2', planName: 'Professional', count: 423, revenue: 21150 },
          { planId: '3', planName: 'Enterprise', count: 99, revenue: 19800 },
          { planId: '4', planName: 'Team', count: 158, revenue: 15800 }
        ],
        churnRate: 3.2,
        growthRate: 12.5
      };

      const mockSubscriptions: SubscriptionRecord[] = [
        {
          id: '1',
          userId: 'user1',
          userEmail: 'john.doe@example.com',
          userName: 'John Doe',
          planName: 'Professional',
          status: 'ACTIVE',
          currentPeriodStart: '2024-01-15T00:00:00Z',
          currentPeriodEnd: '2024-02-15T00:00:00Z',
          cancelAtPeriodEnd: false,
          stripeSubscriptionId: 'sub_1234567890',
          stripeCustomerId: 'cus_1234567890',
          monthlyRevenue: 49.99,
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          userId: 'user2',
          userEmail: 'jane.smith@example.com',
          userName: 'Jane Smith',
          planName: 'Enterprise',
          status: 'ACTIVE',
          currentPeriodStart: '2024-02-01T00:00:00Z',
          currentPeriodEnd: '2024-03-01T00:00:00Z',
          cancelAtPeriodEnd: false,
          stripeSubscriptionId: 'sub_0987654321',
          stripeCustomerId: 'cus_0987654321',
          monthlyRevenue: 199.99,
          createdAt: '2024-02-01T09:15:00Z'
        },
        {
          id: '3',
          userId: 'user3',
          userEmail: 'mike.wilson@example.com',
          userName: 'Mike Wilson',
          planName: 'Starter',
          status: 'TRIALING',
          currentPeriodStart: '2024-02-10T00:00:00Z',
          currentPeriodEnd: '2024-02-24T00:00:00Z',
          cancelAtPeriodEnd: false,
          trialEnd: '2024-02-24T00:00:00Z',
          monthlyRevenue: 0,
          createdAt: '2024-02-10T14:22:00Z'
        },
        {
          id: '4',
          userId: 'user4',
          userEmail: 'sarah.johnson@example.com',
          userName: 'Sarah Johnson',
          planName: 'Professional',
          status: 'CANCELED',
          currentPeriodStart: '2024-01-20T00:00:00Z',
          currentPeriodEnd: '2024-02-20T00:00:00Z',
          cancelAtPeriodEnd: true,
          stripeSubscriptionId: 'sub_1122334455',
          stripeCustomerId: 'cus_1122334455',
          monthlyRevenue: 49.99,
          createdAt: '2024-01-20T16:45:00Z'
        }
      ];

      const mockRevenueData: RevenueData[] = [
        { period: '2024-01-15', revenue: 42350, subscriptions: 1156, newSubscriptions: 89, canceledSubscriptions: 23 },
        { period: '2024-01-22', revenue: 43120, subscriptions: 1178, newSubscriptions: 67, canceledSubscriptions: 45 },
        { period: '2024-01-29', revenue: 44890, subscriptions: 1203, newSubscriptions: 78, canceledSubscriptions: 53 },
        { period: '2024-02-05', revenue: 45670, subscriptions: 1247, newSubscriptions: 92, canceledSubscriptions: 48 }
      ];

      setMetrics(mockMetrics);
      setSubscriptions(mockSubscriptions);
      setRevenueData(mockRevenueData);
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'TRIALING':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'CANCELED':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'PAST_DUE':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'default';
      case 'TRIALING':
        return 'secondary';
      case 'CANCELED':
        return 'destructive';
      case 'PAST_DUE':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) {
      return;
    }
    
    try {
      // In real app: await fetch(`/api/admin/subscriptions/${subscriptionId}/cancel`, { method: 'POST' });
      console.log(`Canceling subscription ${subscriptionId}`);
      fetchSubscriptionData(); // Refresh data
    } catch (error) {
      console.error('Error canceling subscription:', error);
    }
  };

  const handleReactivateSubscription = async (subscriptionId: string) => {
    try {
      // In real app: await fetch(`/api/admin/subscriptions/${subscriptionId}/reactivate`, { method: 'POST' });
      console.log(`Reactivating subscription ${subscriptionId}`);
      fetchSubscriptionData(); // Refresh data
    } catch (error) {
      console.error('Error reactivating subscription:', error);
    }
  };

  if (loading && !metrics) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading subscription data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Subscription Management</h1>
            <p className="text-muted-foreground">
              Monitor subscriptions, revenue, and billing analytics
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {['7d', '30d', '90d'].map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPeriod(period as any)}
                >
                  {period}
                </Button>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={fetchSubscriptionData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Metrics Overview */}
        {metrics && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalSubscriptions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 text-green-500 inline mr-1" />
                  +{metrics.growthRate}% growth rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.activeSubscriptions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {((metrics.activeSubscriptions / metrics.totalSubscriptions) * 100).toFixed(1)}% of total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${metrics.revenue.monthly.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 text-green-500 inline mr-1" />
                  +15% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.churnRate}%</div>
                <p className="text-xs text-muted-foreground">
                  Monthly customer churn
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Plan Distribution */}
        {metrics && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Plan Distribution
              </CardTitle>
              <CardDescription>
                Subscription distribution across different plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {metrics.planDistribution.map((plan) => (
                  <div key={plan.planId} className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">{plan.count}</div>
                    <div className="text-sm font-medium">{plan.planName}</div>
                    <div className="text-sm text-muted-foreground">
                      ${plan.revenue.toLocaleString()} revenue
                    </div>
                    <div className="mt-2">
                      <div className="text-xs text-muted-foreground">
                        {((plan.count / metrics.totalSubscriptions) * 100).toFixed(1)}% of total
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search subscriptions..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="TRIALING">Trialing</SelectItem>
                    <SelectItem value="CANCELED">Canceled</SelectItem>
                    <SelectItem value="PAST_DUE">Past Due</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Plan</label>
                <Select value={filters.plan} onValueChange={(value) => setFilters({ ...filters, plan: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Plans</SelectItem>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscriptions Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Subscriptions ({subscriptions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{subscription.userName}</div>
                        <div className="text-sm text-muted-foreground">{subscription.userEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{subscription.planName}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(subscription.status)} className="flex items-center w-fit">
                        {getStatusIcon(subscription.status)}
                        <span className="ml-1">{subscription.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        ${subscription.monthlyRevenue}/mo
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{new Date(subscription.currentPeriodStart).toLocaleDateString()}</div>
                        <div className="text-muted-foreground">
                          to {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {new Date(subscription.createdAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => {
                            setSelectedSubscription(subscription);
                            setShowSubscriptionDialog(true);
                          }}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Subscription
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {subscription.status === 'ACTIVE' ? (
                            <DropdownMenuItem 
                              onClick={() => handleCancelSubscription(subscription.id)}
                              className="text-red-600"
                            >
                              <AlertTriangle className="mr-2 h-4 w-4" />
                              Cancel Subscription
                            </DropdownMenuItem>
                          ) : subscription.status === 'CANCELED' ? (
                            <DropdownMenuItem 
                              onClick={() => handleReactivateSubscription(subscription.id)}
                              className="text-green-600"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Reactivate
                            </DropdownMenuItem>
                          ) : null}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Revenue Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Revenue Trends
            </CardTitle>
            <CardDescription>
              Revenue and subscription growth over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    ${revenueData[revenueData.length - 1]?.revenue.toLocaleString() || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Current Revenue</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {revenueData.reduce((sum, data) => sum + data.newSubscriptions, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">New Subscriptions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {revenueData.reduce((sum, data) => sum + data.canceledSubscriptions, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Canceled</div>
                </div>
              </div>
              <div className="flex items-end space-x-2 h-32">
                {revenueData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="flex-1 flex flex-col justify-end">
                      <div 
                        className="bg-green-500 rounded-t transition-all duration-300"
                        style={{ height: `${(data.revenue / 50000) * 100}%`, minHeight: '4px' }}
                        title={`$${data.revenue.toLocaleString()} revenue`}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {new Date(data.period).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Details Dialog */}
        <Dialog open={showSubscriptionDialog} onOpenChange={setShowSubscriptionDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Subscription Details</DialogTitle>
              <DialogDescription>
                Detailed information about the selected subscription
              </DialogDescription>
            </DialogHeader>
            {selectedSubscription && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Customer</label>
                    <p className="text-sm text-muted-foreground">
                      {selectedSubscription.userName} ({selectedSubscription.userEmail})
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Plan</label>
                    <Badge variant="outline">{selectedSubscription.planName}</Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Badge variant={getStatusBadgeVariant(selectedSubscription.status)} className="flex items-center w-fit">
                      {getStatusIcon(selectedSubscription.status)}
                      <span className="ml-1">{selectedSubscription.status}</span>
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Monthly Revenue</label>
                    <p className="text-sm text-muted-foreground">
                      ${selectedSubscription.monthlyRevenue}/month
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Current Period</label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedSubscription.currentPeriodStart).toLocaleDateString()} - {new Date(selectedSubscription.currentPeriodEnd).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Created</label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedSubscription.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {selectedSubscription.stripeSubscriptionId && (
                    <div>
                      <label className="text-sm font-medium">Stripe Subscription ID</label>
                      <p className="text-sm text-muted-foreground font-mono">
                        {selectedSubscription.stripeSubscriptionId}
                      </p>
                    </div>
                  )}
                  {selectedSubscription.stripeCustomerId && (
                    <div>
                      <label className="text-sm font-medium">Stripe Customer ID</label>
                      <p className="text-sm text-muted-foreground font-mono">
                        {selectedSubscription.stripeCustomerId}
                      </p>
                    </div>
                  )}
                  {selectedSubscription.trialEnd && (
                    <div>
                      <label className="text-sm font-medium">Trial End</label>
                      <p className="text-sm text-muted-foreground">
                        {new Date(selectedSubscription.trialEnd).toLocaleString()}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium">Cancel at Period End</label>
                    <Badge variant={selectedSubscription.cancelAtPeriodEnd ? 'destructive' : 'default'}>
                      {selectedSubscription.cancelAtPeriodEnd ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSubscriptionDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}