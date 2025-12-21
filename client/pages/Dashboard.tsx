import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/Navigation';
import { DashboardSkeleton } from '@/components/LoadingSkeletons';
import {
  Activity,
  CreditCard,
  DollarSign,
  Users,
  Cpu,
  Cloud,
  Shield,
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function StatCard({ title, value, description, icon: Icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div className="flex items-center pt-1">
            <TrendingUp className={`h-3 w-3 mr-1 ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`} />
            <span className={`text-xs ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {trend.isPositive ? '+' : ''}{trend.value}% from last month
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
}

function QuickActionCard({ title, description, icon: Icon, href, badge }: QuickActionProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Icon className="h-8 w-8 text-primary" />
          {badge && <Badge variant="secondary">{badge}</Badge>}
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full">
          <Link to={href} className="flex items-center">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return 'Good morning';
    if (currentHour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formatRoleName = (role: string) => {
    return role.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto p-6 space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {getGreeting()}, {user?.firstName}!
          </h1>
          <p className="text-muted-foreground">
            Welcome to your FeexSystems dashboard. Here's what's happening with your account.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Projects"
            value="12"
            description="Active projects"
            icon={Activity}
            trend={{ value: 20, isPositive: true }}
          />
          <StatCard
            title="API Calls"
            value="2,350"
            description="This month"
            icon={BarChart3}
            trend={{ value: 15, isPositive: true }}
          />
          <StatCard
            title="Storage Used"
            value="45.2 GB"
            description="Of 100 GB limit"
            icon={Cloud}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Team Members"
            value="8"
            description="Active users"
            icon={Users}
            trend={{ value: 2, isPositive: true }}
          />
        </div>

        {/* Account Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Account Status
            </CardTitle>
            <CardDescription>
              Your account is active and all systems are operational
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Current Plan</p>
                <p className="text-2xl font-bold">Professional</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-sm font-medium">Role</p>
                <Badge variant="default">
                  {formatRoleName(user?.role || 'USER')}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Monthly Usage</span>
                <span>2,350 / 10,000 API calls</span>
              </div>
              <Progress value={23.5} className="h-2" />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Resets in 12 days
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/billing">Upgrade Plan</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">Quick Actions</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <QuickActionCard
              title="AI Services"
              description="Access AI-powered tools and analytics for your projects"
              icon={Cpu}
              href="/ai-services"
              badge="Popular"
            />
            <QuickActionCard
              title="DevOps Tools"
              description="Manage deployments, CI/CD pipelines, and infrastructure"
              icon={Cloud}
              href="/devops"
            />
            <QuickActionCard
              title="Security Center"
              description="Run security scans and monitor vulnerabilities"
              icon={Shield}
              href="/security"
              badge="New"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest actions and system events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      action: 'Profile updated',
                      time: '2 minutes ago',
                      status: 'success',
                    },
                    {
                      action: 'API key generated',
                      time: '1 hour ago',
                      status: 'success',
                    },
                    {
                      action: 'Security scan completed',
                      time: '3 hours ago',
                      status: 'success',
                    },
                    {
                      action: 'Deployment failed',
                      time: '5 hours ago',
                      status: 'error',
                    },
                    {
                      action: 'New team member added',
                      time: '1 day ago',
                      status: 'success',
                    },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                      {activity.status === 'error' && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Usage Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Usage Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>API Calls</span>
                    <span>2,350 / 10,000</span>
                  </div>
                  <Progress value={23.5} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Storage</span>
                    <span>45.2 GB / 100 GB</span>
                  </div>
                  <Progress value={45.2} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Bandwidth</span>
                    <span>12.8 GB / 50 GB</span>
                  </div>
                  <Progress value={25.6} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/profile">
                    <Users className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/billing">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Billing & Usage
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/settings">
                    <Activity className="mr-2 h-4 w-4" />
                    Account Settings
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}