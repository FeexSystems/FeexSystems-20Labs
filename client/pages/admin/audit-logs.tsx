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
  FileText, 
  Search, 
  Filter, 
  Calendar,
  User,
  Activity,
  Shield,
  Eye,
  RefreshCw,
  Download,
  Clock,
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle
} from "lucide-react";

interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  metadata?: Record<string, any>;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

interface AuditLogFilters {
  search: string;
  action: string;
  resource: string;
  userId: string;
  severity: string;
  dateFrom: string;
  dateTo: string;
}

interface AuditLogStats {
  totalLogs: number;
  todayLogs: number;
  successfulActions: number;
  failedActions: number;
  topActions: Array<{
    action: string;
    count: number;
  }>;
  topUsers: Array<{
    userId: string;
    userEmail: string;
    count: number;
  }>;
}

export default function AdminAuditLogsPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AuditLogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showLogDialog, setShowLogDialog] = useState(false);
  const [filters, setFilters] = useState<AuditLogFilters>({
    search: '',
    action: 'all',
    resource: 'all',
    userId: 'all',
    severity: 'all',
    dateFrom: '',
    dateTo: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchAuditLogs();
  }, [filters, currentPage]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      // In real app, these would be API calls
      // const [logsRes, statsRes] = await Promise.all([
      //   fetch(`/api/admin/audit-logs?${new URLSearchParams({
      //     page: currentPage.toString(),
      //     limit: '20',
      //     ...filters
      //   })}`),
      //   fetch('/api/admin/audit-logs/stats')
      // ]);
      
      // Mock data
      const mockLogs: AuditLog[] = [
        {
          id: '1',
          userId: 'user1',
          userEmail: 'john.doe@example.com',
          userName: 'John Doe',
          action: 'USER_LOGIN',
          resource: 'authentication',
          resourceId: 'auth_session_123',
          metadata: { loginMethod: 'email', twoFactorUsed: false },
          timestamp: '2024-02-11T14:30:00Z',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          success: true,
          severity: 'LOW'
        },
        {
          id: '2',
          userId: 'admin1',
          userEmail: 'admin@example.com',
          userName: 'Admin User',
          action: 'USER_ROLE_CHANGED',
          resource: 'user_management',
          resourceId: 'user_456',
          metadata: { oldRole: 'USER', newRole: 'ADMIN', targetUser: 'jane.smith@example.com' },
          timestamp: '2024-02-11T13:45:00Z',
          ipAddress: '10.0.0.50',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          success: true,
          severity: 'HIGH'
        },
        {
          id: '3',
          userId: 'user2',
          userEmail: 'suspicious@example.com',
          userName: 'Suspicious User',
          action: 'FAILED_LOGIN_ATTEMPT',
          resource: 'authentication',
          resourceId: 'failed_auth_789',
          metadata: { reason: 'invalid_password', attemptCount: 5 },
          timestamp: '2024-02-11T12:15:00Z',
          ipAddress: '203.0.113.45',
          userAgent: 'curl/7.68.0',
          success: false,
          severity: 'MEDIUM'
        },
        {
          id: '4',
          userId: 'admin2',
          userEmail: 'superadmin@example.com',
          userName: 'Super Admin',
          action: 'SECURITY_SCAN_INITIATED',
          resource: 'security',
          resourceId: 'scan_101',
          metadata: { scanType: 'VULNERABILITY', target: 'production_api' },
          timestamp: '2024-02-11T11:00:00Z',
          ipAddress: '10.0.0.25',
          userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
          success: true,
          severity: 'MEDIUM'
        },
        {
          id: '5',
          userId: 'user3',
          userEmail: 'attacker@malicious.com',
          userName: 'Unknown User',
          action: 'UNAUTHORIZED_ACCESS_ATTEMPT',
          resource: 'admin_panel',
          resourceId: 'admin_access_denied',
          metadata: { attemptedEndpoint: '/api/admin/users', blockedReason: 'insufficient_permissions' },
          timestamp: '2024-02-11T10:30:00Z',
          ipAddress: '198.51.100.123',
          userAgent: 'Python-requests/2.28.1',
          success: false,
          severity: 'CRITICAL'
        },
        {
          id: '6',
          userId: 'user1',
          userEmail: 'john.doe@example.com',
          userName: 'John Doe',
          action: 'SUBSCRIPTION_CREATED',
          resource: 'billing',
          resourceId: 'sub_1234567890',
          metadata: { planName: 'Professional', amount: 49.99, currency: 'USD' },
          timestamp: '2024-02-11T09:15:00Z',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          success: true,
          severity: 'LOW'
        }
      ];

      const mockStats: AuditLogStats = {
        totalLogs: 15420,
        todayLogs: 234,
        successfulActions: 14567,
        failedActions: 853,
        topActions: [
          { action: 'USER_LOGIN', count: 3456 },
          { action: 'API_REQUEST', count: 2890 },
          { action: 'DATA_ACCESS', count: 1234 },
          { action: 'SUBSCRIPTION_UPDATED', count: 567 },
          { action: 'SECURITY_SCAN_INITIATED', count: 234 }
        ],
        topUsers: [
          { userId: 'user1', userEmail: 'john.doe@example.com', count: 456 },
          { userId: 'user2', userEmail: 'jane.smith@example.com', count: 234 },
          { userId: 'admin1', userEmail: 'admin@example.com', count: 189 }
        ]
      };

      setAuditLogs(mockLogs);
      setStats(mockStats);
      setTotalPages(10); // Mock pagination
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'HIGH':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'MEDIUM':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'LOW':
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'destructive';
      case 'HIGH':
        return 'destructive';
      case 'MEDIUM':
        return 'secondary';
      case 'LOW':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getSuccessIcon = (success: boolean) => {
    return success ? 
      <CheckCircle className="w-4 h-4 text-green-500" /> : 
      <XCircle className="w-4 h-4 text-red-500" />;
  };

  const formatAction = (action: string) => {
    return action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading && !stats) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading audit logs...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
            <p className="text-muted-foreground">
              Monitor system activity and user actions
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={fetchAuditLogs}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalLogs.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.todayLogs} logged today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {((stats.successfulActions / stats.totalLogs) * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.successfulActions.toLocaleString()} successful actions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Failed Actions</CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.failedActions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Require investigation
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.topUsers.length}</div>
                <p className="text-xs text-muted-foreground">
                  Most active users
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Top Actions and Users */}
        {stats && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Top Actions
                </CardTitle>
                <CardDescription>
                  Most frequently performed actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.topActions.map((action, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{formatAction(action.action)}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-secondary rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(action.count / stats.topActions[0].count) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12 text-right">
                          {action.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Most Active Users
                </CardTitle>
                <CardDescription>
                  Users with the most logged actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.topUsers.map((user, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{user.userEmail}</div>
                        <div className="text-xs text-muted-foreground">User ID: {user.userId}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-secondary rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(user.count / stats.topUsers[0].count) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12 text-right">
                          {user.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
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
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search logs..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Action</label>
                <Select value={filters.action} onValueChange={(value) => setFilters({ ...filters, action: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="USER_LOGIN">User Login</SelectItem>
                    <SelectItem value="USER_ROLE_CHANGED">Role Changed</SelectItem>
                    <SelectItem value="SECURITY_SCAN_INITIATED">Security Scan</SelectItem>
                    <SelectItem value="SUBSCRIPTION_CREATED">Subscription Created</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Resource</label>
                <Select value={filters.resource} onValueChange={(value) => setFilters({ ...filters, resource: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Resources</SelectItem>
                    <SelectItem value="authentication">Authentication</SelectItem>
                    <SelectItem value="user_management">User Management</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Severity</label>
                <Select value={filters.severity} onValueChange={(value) => setFilters({ ...filters, severity: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date From</label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date To</label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Audit Logs ({auditLogs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm">{log.userName}</div>
                        <div className="text-xs text-muted-foreground">{log.userEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{formatAction(log.action)}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm capitalize">{log.resource.replace('_', ' ')}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {getSuccessIcon(log.success)}
                        <Badge variant={log.success ? 'default' : 'destructive'}>
                          {log.success ? 'Success' : 'Failed'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getSeverityBadgeVariant(log.severity)} className="flex items-center w-fit">
                        {getSeverityIcon(log.severity)}
                        <span className="ml-1">{log.severity}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedLog(log);
                          setShowLogDialog(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {auditLogs.length} of {auditLogs.length * totalPages} logs
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Log Details Dialog */}
        <Dialog open={showLogDialog} onOpenChange={setShowLogDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Audit Log Details</DialogTitle>
              <DialogDescription>
                Detailed information about the selected audit log entry
              </DialogDescription>
            </DialogHeader>
            {selectedLog && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Timestamp</label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedLog.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">User</label>
                    <p className="text-sm text-muted-foreground">
                      {selectedLog.userName} ({selectedLog.userEmail})
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Action</label>
                    <Badge variant="outline">{formatAction(selectedLog.action)}</Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Resource</label>
                    <p className="text-sm text-muted-foreground capitalize">
                      {selectedLog.resource.replace('_', ' ')}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Resource ID</label>
                    <p className="text-sm text-muted-foreground font-mono">
                      {selectedLog.resourceId}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <div className="flex items-center space-x-1">
                      {getSuccessIcon(selectedLog.success)}
                      <Badge variant={selectedLog.success ? 'default' : 'destructive'}>
                        {selectedLog.success ? 'Success' : 'Failed'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Severity</label>
                    <Badge variant={getSeverityBadgeVariant(selectedLog.severity)} className="flex items-center w-fit">
                      {getSeverityIcon(selectedLog.severity)}
                      <span className="ml-1">{selectedLog.severity}</span>
                    </Badge>
                  </div>
                  {selectedLog.ipAddress && (
                    <div>
                      <label className="text-sm font-medium">IP Address</label>
                      <p className="text-sm text-muted-foreground font-mono">
                        {selectedLog.ipAddress}
                      </p>
                    </div>
                  )}
                </div>
                
                {selectedLog.userAgent && (
                  <div>
                    <label className="text-sm font-medium">User Agent</label>
                    <p className="text-sm text-muted-foreground font-mono break-all">
                      {selectedLog.userAgent}
                    </p>
                  </div>
                )}

                {selectedLog.metadata && (
                  <div>
                    <label className="text-sm font-medium">Metadata</label>
                    <pre className="text-sm text-muted-foreground bg-secondary p-3 rounded-md overflow-auto">
                      {JSON.stringify(selectedLog.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowLogDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}