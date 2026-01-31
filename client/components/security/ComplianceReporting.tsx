import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Download,
  FileText,
  Shield,
  Award,
  TrendingUp,
  TrendingDown,
  Minus,
  Info
} from 'lucide-react';
import { ComplianceFramework, ComplianceCheck } from '@/shared/api';
import { useToast } from '@/hooks/use-toast';

// Mock compliance data
const mockComplianceData = {
  [ComplianceFramework.OWASP_TOP_10]: {
    framework: ComplianceFramework.OWASP_TOP_10,
    name: 'OWASP Top 10',
    description: 'The most critical web application security risks',
    overallScore: 85,
    trend: 'up' as const,
    lastAssessment: new Date('2024-01-20T10:00:00'),
    checks: [
      {
        id: '1',
        framework: ComplianceFramework.OWASP_TOP_10,
        control: 'A01:2021 – Broken Access Control',
        description: 'Restrictions on what authenticated users are allowed to do are often not properly enforced.',
        status: 'pass' as const,
        evidence: 'Proper access controls implemented with role-based permissions',
        remediation: undefined
      },
      {
        id: '2',
        framework: ComplianceFramework.OWASP_TOP_10,
        control: 'A02:2021 – Cryptographic Failures',
        description: 'Failures related to cryptography which often leads to sensitive data exposure.',
        status: 'fail' as const,
        evidence: undefined,
        remediation: 'Implement proper encryption for sensitive data at rest and in transit'
      },
      {
        id: '3',
        framework: ComplianceFramework.OWASP_TOP_10,
        control: 'A03:2021 – Injection',
        description: 'Application is vulnerable to injection attacks such as SQL, NoSQL, OS, and LDAP injection.',
        status: 'warning' as const,
        evidence: 'Some parameterized queries implemented but not consistently',
        remediation: 'Implement parameterized queries across all database interactions'
      }
    ] as ComplianceCheck[]
  },
  [ComplianceFramework.PCI_DSS]: {
    framework: ComplianceFramework.PCI_DSS,
    name: 'PCI DSS',
    description: 'Payment Card Industry Data Security Standard',
    overallScore: 72,
    trend: 'stable' as const,
    lastAssessment: new Date('2024-01-18T14:30:00'),
    checks: [
      {
        id: '4',
        framework: ComplianceFramework.PCI_DSS,
        control: 'Requirement 1: Install and maintain a firewall configuration',
        description: 'Firewalls are computer devices that control computer traffic allowed between an entity\'s networks.',
        status: 'pass' as const,
        evidence: 'Firewall properly configured with documented rules',
        remediation: undefined
      },
      {
        id: '5',
        framework: ComplianceFramework.PCI_DSS,
        control: 'Requirement 2: Do not use vendor-supplied defaults for system passwords',
        description: 'Malicious individuals often use vendor default passwords and other vendor default settings.',
        status: 'fail' as const,
        evidence: undefined,
        remediation: 'Change all vendor default passwords and remove unnecessary default accounts'
      }
    ] as ComplianceCheck[]
  },
  [ComplianceFramework.SOC_2]: {
    framework: ComplianceFramework.SOC_2,
    name: 'SOC 2',
    description: 'Service Organization Control 2',
    overallScore: 91,
    trend: 'up' as const,
    lastAssessment: new Date('2024-01-19T09:15:00'),
    checks: [
      {
        id: '6',
        framework: ComplianceFramework.SOC_2,
        control: 'Security - Access Controls',
        description: 'Logical and physical access controls restrict access to confidential information.',
        status: 'pass' as const,
        evidence: 'Multi-factor authentication implemented for all users',
        remediation: undefined
      },
      {
        id: '7',
        framework: ComplianceFramework.SOC_2,
        control: 'Availability - System Monitoring',
        description: 'System performance is monitored and capacity is managed.',
        status: 'pass' as const,
        evidence: 'Comprehensive monitoring and alerting system in place',
        remediation: undefined
      }
    ] as ComplianceCheck[]
  },
  [ComplianceFramework.ISO_27001]: {
    framework: ComplianceFramework.ISO_27001,
    name: 'ISO 27001',
    description: 'Information Security Management System',
    overallScore: 68,
    trend: 'down' as const,
    lastAssessment: new Date('2024-01-17T16:45:00'),
    checks: [
      {
        id: '8',
        framework: ComplianceFramework.ISO_27001,
        control: 'A.9.1.1 Access control policy',
        description: 'An access control policy should be established, documented and reviewed.',
        status: 'warning' as const,
        evidence: 'Policy exists but requires updates',
        remediation: 'Update access control policy to reflect current organizational structure'
      }
    ] as ComplianceCheck[]
  }
};

export function ComplianceReporting() {
  const [selectedFramework, setSelectedFramework] = useState<ComplianceFramework>(ComplianceFramework.OWASP_TOP_10);
  const [timeRange, setTimeRange] = useState('30d');
  const { toast } = useToast();

  const currentData = mockComplianceData[selectedFramework];

  const getStatusIcon = (status: ComplianceCheck['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'not_applicable':
        return <Minus className="h-4 w-4 text-gray-500" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: ComplianceCheck['status']) => {
    switch (status) {
      case 'pass':
        return 'default';
      case 'fail':
        return 'destructive';
      case 'warning':
        return 'secondary';
      case 'not_applicable':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-gray-500" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const handleDownloadReport = (framework: ComplianceFramework) => {
    toast({
      title: "Report Downloaded",
      description: `${mockComplianceData[framework].name} compliance report has been downloaded.`,
    });
  };

  const getComplianceStats = () => {
    const allChecks = Object.values(mockComplianceData).flatMap(data => data.checks);
    return {
      total: allChecks.length,
      passed: allChecks.filter(check => check.status === 'pass').length,
      failed: allChecks.filter(check => check.status === 'fail').length,
      warnings: allChecks.filter(check => check.status === 'warning').length,
      notApplicable: allChecks.filter(check => check.status === 'not_applicable').length
    };
  };

  const stats = getComplianceStats();

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Compliance</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-muted-foreground">+5% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Passed Controls</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0}% of total controls
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Controls</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Frameworks</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(mockComplianceData).length}</div>
            <p className="text-xs text-muted-foreground">
              Active compliance frameworks
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Framework Selection and Overview */}
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <Select value={selectedFramework} onValueChange={(value) => setSelectedFramework(value as ComplianceFramework)}>
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(mockComplianceData).map(([key, data]) => (
              <SelectItem key={key} value={key}>
                {data.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={() => handleDownloadReport(selectedFramework)}>
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Framework Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    {currentData.name}
                  </CardTitle>
                  <CardDescription>{currentData.description}</CardDescription>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${getScoreColor(currentData.overallScore)}`}>
                    {getScoreGrade(currentData.overallScore)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {currentData.overallScore}/100
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Progress value={currentData.overallScore} className="h-3" />
                </div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(currentData.trend)}
                  <span className="text-sm text-muted-foreground">
                    {currentData.trend === 'up' ? 'Improving' : 
                     currentData.trend === 'down' ? 'Declining' : 'Stable'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Last Assessment:</span>
                  <div className="font-medium">{currentData.lastAssessment.toLocaleDateString()}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Controls:</span>
                  <div className="font-medium">{currentData.checks.length}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Pass Rate:</span>
                  <div className="font-medium">
                    {Math.round((currentData.checks.filter(c => c.status === 'pass').length / currentData.checks.length) * 100)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* All Frameworks Summary */}
          <Card>
            <CardHeader>
              <CardTitle>All Frameworks Summary</CardTitle>
              <CardDescription>
                Compliance status across all implemented frameworks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(mockComplianceData).map(([key, data]) => (
                  <div 
                    key={key}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedFramework === key ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedFramework(key as ComplianceFramework)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{data.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant={data.overallScore >= 80 ? 'default' : data.overallScore >= 60 ? 'secondary' : 'destructive'}>
                          {data.overallScore}%
                        </Badge>
                        {getTrendIcon(data.trend)}
                      </div>
                    </div>
                    <Progress value={data.overallScore} className="h-2 mb-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{data.checks.filter(c => c.status === 'pass').length} passed</span>
                      <span>{data.checks.filter(c => c.status === 'fail').length} failed</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="controls" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{currentData.name} Controls</CardTitle>
              <CardDescription>
                Detailed compliance control assessment results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentData.checks.map((check) => (
                  <div key={check.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusIcon(check.status)}
                          <h3 className="font-medium">{check.control}</h3>
                          <Badge variant={getStatusColor(check.status)}>
                            {check.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {check.description}
                        </p>
                      </div>
                    </div>

                    {check.evidence && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium mb-1">Evidence:</h4>
                        <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                          {check.evidence}
                        </p>
                      </div>
                    )}

                    {check.remediation && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Remediation:</h4>
                        <p className="text-sm text-muted-foreground bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded border-l-4 border-yellow-500">
                          {check.remediation}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Trends</CardTitle>
              <CardDescription>
                Historical compliance scores and improvement tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(mockComplianceData).map(([key, data]) => (
                  <div key={key} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{data.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${getScoreColor(data.overallScore)}`}>
                          {data.overallScore}%
                        </span>
                        {getTrendIcon(data.trend)}
                      </div>
                    </div>
                    <Progress value={data.overallScore} className="h-2" />
                    <div className="grid grid-cols-4 gap-4 text-xs">
                      <div className="text-center">
                        <div className="font-medium text-green-600">
                          {data.checks.filter(c => c.status === 'pass').length}
                        </div>
                        <div className="text-muted-foreground">Passed</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-red-600">
                          {data.checks.filter(c => c.status === 'fail').length}
                        </div>
                        <div className="text-muted-foreground">Failed</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-yellow-600">
                          {data.checks.filter(c => c.status === 'warning').length}
                        </div>
                        <div className="text-muted-foreground">Warnings</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-600">
                          {data.checks.filter(c => c.status === 'not_applicable').length}
                        </div>
                        <div className="text-muted-foreground">N/A</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}