import { useAuthStore } from "@/store/auth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Bot, 
  Code, 
  Shield, 
  Users, 
  CreditCard, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuthStore();

  // Mock data - in real app, this would come from API
  const metrics = {
    aiRequests: { current: 45, limit: 100, trend: '+12%' },
    deployments: { current: 8, limit: 20, trend: '+5%' },
    securityScans: { current: 15, limit: 30, trend: '+8%' },
    storage: { current: 2.4, limit: 10, trend: '+3%' }
  };

  const recentActivity = [
    {
      id: 1,
      type: 'ai_request',
      title: 'AI Code Review completed',
      description: 'Code review for feature-branch completed successfully',
      timestamp: '2 hours ago',
      status: 'completed',
      icon: Bot
    },
    {
      id: 2,
      type: 'deployment',
      title: 'Production deployment successful',
      description: 'v2.1.0 deployed to production environment',
      timestamp: '4 hours ago',
      status: 'completed',
      icon: Code
    },
    {
      id: 3,
      type: 'security_scan',
      title: 'Vulnerability scan completed',
      description: 'Security scan found 2 low-risk vulnerabilities',
      timestamp: '6 hours ago',
      status: 'warning',
      icon: Shield
    },
    {
      id: 4,
      type: 'team_invite',
      title: 'Team invitation sent',
      description: 'Invited john.doe@example.com to join your team',
      timestamp: '1 day ago',
      status: 'pending',
      icon: Users
    }
  ];

  const quickActions = [
    {
      title: 'New AI Request',
      description: 'Submit a new AI service request',
      icon: Bot,
      href: '/dashboard/ai',
      variant: 'default' as const
    },
    {
      title: 'Deploy Code',
      description: 'Deploy your latest changes',
      icon: Code,
      href: '/dashboard/devops',
      variant: 'secondary' as const
    },
    {
      title: 'Security Scan',
      description: 'Run a security vulnerability scan',
      icon: Shield,
      href: '/dashboard/security',
      variant: 'outline' as const
    },
    {
      title: 'Manage Team',
      description: 'Invite members or update roles',
      icon: Users,
      href: '/dashboard/teams',
      variant: 'outline' as const
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'pending':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.firstName}!</h1>
            <p className="text-muted-foreground">
              Here's what's happening with your projects today.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-sm">
              <Activity className="w-3 h-3 mr-1" />
              System Status: Healthy
            </Badge>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Requests</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.aiRequests.current}</div>
              <p className="text-xs text-muted-foreground">
                of {metrics.aiRequests.limit} limit
              </p>
              <Progress 
                value={(metrics.aiRequests.current / metrics.aiRequests.limit) * 100} 
                className="mt-2" 
              />
              <div className="flex items-center mt-2">
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">{metrics.aiRequests.trend}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Deployments</CardTitle>
              <Code className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.deployments.current}</div>
              <p className="text-xs text-muted-foreground">
                of {metrics.deployments.limit} limit
              </p>
              <Progress 
                value={(metrics.deployments.current / metrics.deployments.limit) * 100} 
                className="mt-2" 
              />
              <div className="flex items-center mt-2">
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">{metrics.deployments.trend}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Scans</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.securityScans.current}</div>
              <p className="text-xs text-muted-foreground">
                of {metrics.securityScans.limit} limit
              </p>
              <Progress 
                value={(metrics.securityScans.current / metrics.securityScans.limit) * 100} 
                className="mt-2" 
              />
              <div className="flex items-center mt-2">
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">{metrics.securityScans.trend}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.storage}GB</div>
              <p className="text-xs text-muted-foreground">
                of {metrics.storage.limit}GB limit
              </p>
              <Progress 
                value={(metrics.storage.current / metrics.storage.limit) * 100} 
                className="mt-2" 
              />
              <div className="flex items-center mt-2">
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">{metrics.storage.trend}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions and Recent Activity */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Get started with common tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.title}
                    variant={action.variant}
                    className="w-full justify-start"
                    onClick={() => window.location.href = action.href}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    <div className="text-left">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-xs opacity-80">{action.description}</div>
                    </div>
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest actions and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {getStatusIcon(activity.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                          <p className="text-sm font-medium text-foreground">
                            {activity.title}
                          </p>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${getStatusColor(activity.status)}`}
                          >
                            {activity.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Subscription Status
            </CardTitle>
            <CardDescription>
              Manage your current plan and billing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Current Plan: Pro</p>
                <p className="text-xs text-muted-foreground">
                  $29/month • Next billing: March 15, 2024
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  View Billing
                </Button>
                <Button variant="outline" size="sm">
                  Upgrade Plan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
