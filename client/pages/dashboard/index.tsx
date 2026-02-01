import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  XCircle,
  Zap,
  Globe,
  Bell,
  Settings,
  ArrowRight,
  Folder,
  Star,
  GitBranch,
  Terminal,
  Play,
  BarChart3,
  Eye,
  Sparkles
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("overview");

  // Enhanced mock data
  const metrics = {
    totalProjects: 12,
    apiCalls: { current: 2350, limit: 10000, trend: '+15%' },
    storageUsed: { current: 45.2, limit: 100, trend: '+8%' },
    teamMembers: 8,
    activeDeployments: 3,
    securityScore: 92
  };

  const projects = [
    {
      id: 1,
      name: 'E-Commerce Platform',
      description: 'Full-stack marketplace application',
      status: 'active',
      language: 'TypeScript',
      lastActivity: '2 hours ago',
      progress: 78,
      starred: true,
      deployments: 24,
      issues: 3
    },
    {
      id: 2,
      name: 'AI Analytics Dashboard',
      description: 'Real-time data visualization',
      status: 'active',
      language: 'Python',
      lastActivity: '5 hours ago',
      progress: 92,
      starred: true,
      deployments: 18,
      issues: 0
    },
    {
      id: 3,
      name: 'Mobile Banking App',
      description: 'Cross-platform fintech solution',
      status: 'review',
      language: 'React Native',
      lastActivity: '1 day ago',
      progress: 65,
      starred: false,
      deployments: 12,
      issues: 7
    },
    {
      id: 4,
      name: 'IoT Sensor Network',
      description: 'Industrial monitoring system',
      status: 'development',
      language: 'Go',
      lastActivity: '3 hours ago',
      progress: 45,
      starred: false,
      deployments: 8,
      issues: 2
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'deployment',
      title: 'Production deployment successful',
      project: 'E-Commerce Platform',
      timestamp: '10 minutes ago',
      status: 'success',
      icon: Code
    },
    {
      id: 2,
      type: 'ai_request',
      title: 'AI Code Review completed',
      project: 'AI Analytics Dashboard',
      timestamp: '45 minutes ago',
      status: 'success',
      icon: Bot
    },
    {
      id: 3,
      type: 'security',
      title: 'Security scan found 2 issues',
      project: 'Mobile Banking App',
      timestamp: '2 hours ago',
      status: 'warning',
      icon: Shield
    },
    {
      id: 4,
      type: 'team',
      title: 'Sarah joined the team',
      project: 'IoT Sensor Network',
      timestamp: '4 hours ago',
      status: 'info',
      icon: Users
    },
    {
      id: 5,
      type: 'build',
      title: 'Pipeline build failed',
      project: 'Mobile Banking App',
      timestamp: '6 hours ago',
      status: 'error',
      icon: Terminal
    }
  ];

  const notifications = [
    { id: 1, title: 'Security update available', message: 'Critical patch for Node.js dependencies', type: 'warning', time: '1h ago' },
    { id: 2, title: 'Usage limit approaching', message: 'API calls at 85% of monthly limit', type: 'info', time: '3h ago' },
    { id: 3, title: 'New team member invite', message: 'John requested to join your project', type: 'action', time: '5h ago' },
    { id: 4, title: 'Deployment completed', message: 'v2.3.1 deployed to production', type: 'success', time: '8h ago' }
  ];

  const upcomingTasks = [
    { id: 1, title: 'Review pull request #142', project: 'E-Commerce Platform', dueDate: 'Today', priority: 'high' },
    { id: 2, title: 'Update security certificates', project: 'Mobile Banking App', dueDate: 'Tomorrow', priority: 'critical' },
    { id: 3, title: 'API endpoint documentation', project: 'AI Analytics Dashboard', dueDate: 'Dec 5', priority: 'medium' },
    { id: 4, title: 'Performance optimization', project: 'IoT Sensor Network', dueDate: 'Dec 7', priority: 'low' }
  ];

  const performanceData = [
    { day: 'Mon', requests: 1240, deployments: 5, scans: 3 },
    { day: 'Tue', requests: 1580, deployments: 8, scans: 2 },
    { day: 'Wed', requests: 2100, deployments: 12, scans: 4 },
    { day: 'Thu', requests: 1890, deployments: 6, scans: 5 },
    { day: 'Fri', requests: 2350, deployments: 9, scans: 3 },
    { day: 'Sat', requests: 980, deployments: 2, scans: 1 },
    { day: 'Sun', requests: 650, deployments: 1, scans: 1 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'info': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getProjectStatus = (status: string) => {
    switch (status) {
      case 'active': return { label: 'Active', color: 'bg-green-500' };
      case 'review': return { label: 'In Review', color: 'bg-yellow-500' };
      case 'development': return { label: 'Development', color: 'bg-blue-500' };
      default: return { label: 'Unknown', color: 'bg-gray-500' };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-500 bg-red-100 dark:bg-red-900/30';
      case 'high': return 'text-orange-500 bg-orange-100 dark:bg-orange-900/30';
      case 'medium': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome to your FeexSystems dashboard. Here's what's happening with your account.
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm px-3 py-1">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              All Systems Operational
            </Badge>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Folder className="w-8 h-8 text-primary" />
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold mt-2">{metrics.totalProjects}</p>
              <p className="text-xs text-muted-foreground">Active projects</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Zap className="w-8 h-8 text-blue-500" />
                <span className="text-xs text-green-500">+15%</span>
              </div>
              <p className="text-2xl font-bold mt-2">{metrics.apiCalls.current.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">API Calls</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Globe className="w-8 h-8 text-purple-500" />
                <span className="text-xs text-green-500">+8%</span>
              </div>
              <p className="text-2xl font-bold mt-2">{metrics.storageUsed.current} GB</p>
              <p className="text-xs text-muted-foreground">Of {metrics.storageUsed.limit} GB limit</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Users className="w-8 h-8 text-orange-500" />
                <span className="text-xs text-muted-foreground">+1 new</span>
              </div>
              <p className="text-2xl font-bold mt-2">{metrics.teamMembers}</p>
              <p className="text-xs text-muted-foreground">Active users</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Play className="w-8 h-8 text-emerald-500" />
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              </div>
              <p className="text-2xl font-bold mt-2">{metrics.activeDeployments}</p>
              <p className="text-xs text-muted-foreground">Running now</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-500/10 to-teal-500/5 border-teal-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Shield className="w-8 h-8 text-teal-500" />
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold mt-2">{metrics.securityScore}%</p>
              <p className="text-xs text-muted-foreground">Security score</p>
            </CardContent>
          </Card>
        </div>

        {/* Account Status Card */}
        <Card className="border-primary/30 bg-gradient-to-r from-card to-primary/5">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Account Status</h3>
                  <p className="text-sm text-muted-foreground">Your account is active and all systems are operational</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4 md:items-center">
                <div className="text-right">
                  <p className="text-sm font-medium">Current Plan</p>
                  <p className="text-xl font-bold text-primary">Professional</p>
                </div>
                <div className="border-l pl-4 hidden md:block">
                  <p className="text-sm text-muted-foreground">Role</p>
                  <Badge>User</Badge>
                </div>
                <div className="border-l pl-4 hidden md:block">
                  <p className="text-sm text-muted-foreground">Monthly Usage</p>
                  <div className="flex items-center gap-2">
                    <Progress value={23.5} className="w-24 h-2" />
                    <span className="text-sm">2,350 / 10,000 API calls</span>
                  </div>
                </div>
                <Button variant="outline" className="ml-4">
                  Upgrade Plan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Dashboard Sections */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Performance Chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Weekly Performance
                  </CardTitle>
                  <CardDescription>API requests, deployments, and scans over the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end justify-between gap-2">
                    {performanceData.map((day, i) => (
                      <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full flex flex-col gap-1" style={{ height: '200px' }}>
                          <div
                            className="w-full bg-primary/80 rounded-t"
                            style={{ height: `${(day.requests / 2500) * 100}%` }}
                            title={`${day.requests} requests`}
                          />
                          <div
                            className="w-full bg-emerald-500"
                            style={{ height: `${(day.deployments / 15) * 50}px` }}
                            title={`${day.deployments} deployments`}
                          />
                          <div
                            className="w-full bg-orange-500 rounded-b"
                            style={{ height: `${(day.scans / 10) * 30}px` }}
                            title={`${day.scans} scans`}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{day.day}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-primary/80 rounded" />
                      <span className="text-sm">API Requests</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded" />
                      <span className="text-sm">Deployments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded" />
                      <span className="text-sm">Scans</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/dashboard/ai">
                    <Button variant="outline" className="w-full justify-between group">
                      <span className="flex items-center gap-2">
                        <Bot className="w-4 h-4" />
                        New AI Request
                      </span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </Button>
                  </Link>
                  <Link to="/dashboard/devops">
                    <Button variant="outline" className="w-full justify-between group">
                      <span className="flex items-center gap-2">
                        <Code className="w-4 h-4" />
                        Deploy Code
                      </span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </Button>
                  </Link>
                  <Link to="/dashboard/security">
                    <Button variant="outline" className="w-full justify-between group">
                      <span className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Security Scan
                      </span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </Button>
                  </Link>
                  <Link to="/dashboard/teams">
                    <Button variant="outline" className="w-full justify-between group">
                      <span className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Manage Team
                      </span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </Button>
                  </Link>
                  <Link to="/dashboard/analytics">
                    <Button variant="outline" className="w-full justify-between group">
                      <span className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        View Analytics
                      </span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates across your projects</CardDescription>
                </div>
                <Button variant="ghost" size="sm">View All</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition">
                        <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.project}</p>
                        </div>
                        <span className="text-sm text-muted-foreground">{activity.timestamp}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Your Projects</h2>
              <Button>
                <Folder className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {projects.map((project) => {
                const status = getProjectStatus(project.status);
                return (
                  <Card key={project.id} className="hover:border-primary/50 transition cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-muted rounded-lg">
                            <Folder className="w-5 h-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              {project.name}
                              {project.starred && <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />}
                            </CardTitle>
                            <CardDescription>{project.description}</CardDescription>
                          </div>
                        </div>
                        <Badge className={status.color}>{status.label}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            <GitBranch className="w-4 h-4 inline mr-1" />
                            {project.language}
                          </span>
                          <span className="text-muted-foreground">
                            <Code className="w-4 h-4 inline mr-1" />
                            {project.deployments} deployments
                          </span>
                          <span className={project.issues > 0 ? 'text-yellow-500' : 'text-green-500'}>
                            <AlertTriangle className="w-4 h-4 inline mr-1" />
                            {project.issues} issues
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          Last activity: {project.lastActivity}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Feed</CardTitle>
                <CardDescription>All recent activity across your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...recentActivity, ...recentActivity].map((activity, i) => {
                    const Icon = activity.icon;
                    return (
                      <div key={`${activity.id}-${i}`} className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/30 transition">
                        <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.project}</p>
                        </div>
                        <Badge variant="outline">{activity.type}</Badge>
                        <span className="text-sm text-muted-foreground">{activity.timestamp}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Tasks</CardTitle>
                <CardDescription>Tasks that need your attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/30 transition">
                      <input type="checkbox" className="w-5 h-5 rounded border-primary" />
                      <div className="flex-1">
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-muted-foreground">{task.project}</p>
                      </div>
                      <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                      <span className="text-sm font-medium">{task.dueDate}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Stay updated with important alerts</CardDescription>
                </div>
                <Button variant="ghost" size="sm">Mark all as read</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className={`flex items-start gap-4 p-4 rounded-lg border ${getStatusColor(notification.type === 'warning' ? 'warning' : notification.type === 'success' ? 'success' : 'info')}`}>
                      <Bell className="w-5 h-5 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium">{notification.title}</p>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
