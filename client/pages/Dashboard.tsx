import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FullWidthNav } from '@/components/framer/FullWidthNav';
import { DashboardSkeleton } from '@/components/LoadingSkeletons';
import {
  Activity,
  CreditCard,
  Users,
  Cpu,
  Cloud,
  Shield,
  BarChart3,
  TrendingUp,
  TrendingDown,
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
    <Card className="bg-black border-white/20 text-white rounded-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-mono tracking-widest uppercase text-gray-400">{title}</CardTitle>
        <Icon className="h-4 w-4 text-white" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold font-mono tracking-tighter">{value}</div>
        <p className="text-xs font-mono text-gray-500 mt-1">{description}</p>
        {trend && (
          <div className="flex items-center pt-2">
            {trend.isPositive ? (
              <TrendingUp className="h-3 w-3 mr-1 text-white" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1 text-white" />
            )}
            <span className="text-xs font-mono text-gray-400">
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
    <Card className="bg-black hover:bg-white/5 border-white/20 transition-all rounded-none group">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Icon className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
          {badge && <Badge variant="outline" className="font-mono text-xs rounded-none border-white text-white">{badge}</Badge>}
        </div>
        <CardTitle className="text-lg font-mono uppercase tracking-widest text-white mt-4">{title}</CardTitle>
        <CardDescription className="text-gray-400 font-mono text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild variant="outline" className="w-full rounded-none border-white/20 text-white hover:bg-white hover:text-black transition-colors font-mono uppercase">
          <Link to={href} className="flex items-center justify-center">
            Access System
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
    if (currentHour < 12) return 'SYSTEM INIT';
    if (currentHour < 18) return 'ACTIVE SESSION';
    return 'LATE CYCLE';
  };

  const formatRoleName = (role: string) => {
    return role.replace('_', ' ').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <FullWidthNav />
      
      <main className="container mx-auto p-6 pt-24 space-y-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="flex flex-col space-y-2 pb-6 border-b border-white/10">
          <h1 className="text-4xl font-black tracking-tighter uppercase">
            {getGreeting()} // <span className="text-gray-500">{user?.firstName || 'OPERATOR'}</span>
          </h1>
          <p className="text-gray-400 font-mono text-sm uppercase tracking-widest">
            FeexSystems Command Center. Authenticated access granted.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Projects"
            value="12"
            description="Active repositories"
            icon={Activity}
            trend={{ value: 20, isPositive: true }}
          />
          <StatCard
            title="Telemetry"
            value="2,350"
            description="Events / sec"
            icon={BarChart3}
            trend={{ value: 15, isPositive: true }}
          />
          <StatCard
            title="Storage"
            value="45.2 GB"
            description="Of 100 GB limit"
            icon={Cloud}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Nodes"
            value="8"
            description="Active users"
            icon={Users}
            trend={{ value: 2, isPositive: true }}
          />
        </div>

        {/* Account Status */}
        <Card className="bg-black border-white/20 rounded-none">
          <CardHeader className="border-b border-white/10 pb-4">
            <CardTitle className="flex items-center gap-2 font-mono uppercase tracking-widest text-white">
              <CheckCircle className="h-5 w-5" />
              System Status: Nominal
            </CardTitle>
            <CardDescription className="font-mono text-gray-400">
              Account active. All subsystems operational.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Current Plan</p>
                <p className="text-2xl font-bold font-mono uppercase">Professional</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Clearance</p>
                <Badge variant="outline" className="rounded-none border-white text-white font-mono uppercase">
                  {formatRoleName(user?.role || 'USER')}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-gray-400 uppercase">
                <span>Bandwidth Usage</span>
                <span>2,350 / 10,000 OP/s</span>
              </div>
              <Progress value={23.5} className="h-1 bg-white/10" indicatorClassName="bg-white" />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono text-gray-500 uppercase tracking-widest">
                <Clock className="h-4 w-4" />
                Cycle resets in 12 days
              </div>
              <Button variant="outline" size="sm" asChild className="rounded-none border-white/20 text-white hover:bg-white hover:text-black font-mono uppercase">
                <Link to="/billing">Upgrade</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold font-mono tracking-widest uppercase mb-4 text-white">Subsystems</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <QuickActionCard
              title="AI Services"
              description="Access AI orchestration and neural routing"
              icon={Cpu}
              href="/dashboard/ai-services"
              badge="CORE"
            />
            <QuickActionCard
              title="DevOps"
              description="Pipeline execution and automated rollbacks"
              icon={Cloud}
              href="/dashboard/devops"
            />
            <QuickActionCard
              title="Security"
              description="Threat detection and HMAC verification"
              icon={Shield}
              href="/dashboard/security"
              badge="AUDIT"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="bg-black border-white/20 rounded-none h-full">
              <CardHeader className="border-b border-white/10 pb-4">
                <CardTitle className="font-mono uppercase tracking-widest text-white">Event Log</CardTitle>
                <CardDescription className="font-mono text-gray-400">
                  Cryptographic transaction & event ledger
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {[
                    { action: 'NODE_UPDATE', time: 'T-2M', status: 'success' },
                    { action: 'KEY_GEN_SHA256', time: 'T-1H', status: 'success' },
                    { action: 'SECURITY_SCAN', time: 'T-3H', status: 'success' },
                    { action: 'DEPLOY_FAIL_REVERT', time: 'T-5H', status: 'error' },
                    { action: 'AUTH_GRANT', time: 'T-24H', status: 'success' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                      <div className={`w-2 h-2 rounded-none ${
                        activity.status === 'success' ? 'bg-white' : 'bg-gray-600'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-mono font-bold text-white uppercase">{activity.action}</p>
                        <p className="text-xs font-mono text-gray-500 uppercase">{activity.time}</p>
                      </div>
                      {activity.status === 'error' && (
                        <AlertTriangle className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Quick Links */}
            <Card className="bg-black border-white/20 rounded-none">
              <CardHeader className="border-b border-white/10 pb-4">
                <CardTitle className="font-mono uppercase tracking-widest text-white">Operations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-6">
                <Button variant="outline" className="w-full justify-start rounded-none border-white/10 text-white hover:bg-white hover:text-black transition-colors font-mono uppercase" asChild>
                  <Link to="/profile">
                    <Users className="mr-3 h-4 w-4" />
                    Identity
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-none border-white/10 text-white hover:bg-white hover:text-black transition-colors font-mono uppercase" asChild>
                  <Link to="/dashboard/billing">
                    <CreditCard className="mr-3 h-4 w-4" />
                    Billing
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-none border-white/10 text-white hover:bg-white hover:text-black transition-colors font-mono uppercase" asChild>
                  <Link to="/settings">
                    <Activity className="mr-3 h-4 w-4" />
                    Configuration
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