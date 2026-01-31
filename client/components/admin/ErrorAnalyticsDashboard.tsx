import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface ErrorAnalytics {
  totalErrors: number;
  errorsByType: {
    type: string;
    count: number;
  }[];
  errorsByEndpoint: {
    endpoint: string;
    count: number;
  }[];
  errorTimeline: {
    timestamp: string;
    count: number;
  }[];
  recentErrors: {
    id: string;
    type: string;
    message: string;
    timestamp: string;
    endpoint: string;
    userId?: string;
  }[];
}

export function ErrorAnalyticsDashboard() {
  const [dateRange, setDateRange] = React.useState<[Date, Date]>([
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    new Date()
  ]);
  const [errorType, setErrorType] = React.useState<string>('all');

  const { data: analytics, isLoading } = useQuery<ErrorAnalytics>({
    queryKey: ['errorAnalytics', dateRange, errorType],
    queryFn: async () => {
      const response = await fetch('/api/admin/analytics/errors?' + new URLSearchParams({
        startDate: dateRange[0].toISOString(),
        endDate: dateRange[1].toISOString(),
        type: errorType
      }));
      
      if (!response.ok) throw new Error('Failed to fetch error analytics');
      return response.json();
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (!analytics) return <div>No data available</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Error Analytics</h1>
        <div className="flex items-center gap-4">
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
          <Select
            value={errorType}
            onValueChange={setErrorType}
            options={[
              { value: 'all', label: 'All Errors' },
              { value: 'validation', label: 'Validation Errors' },
              { value: 'authentication', label: 'Authentication Errors' },
              { value: 'authorization', label: 'Authorization Errors' },
              { value: 'internal', label: 'Internal Server Errors' }
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Error Count Card */}
        <Card>
          <CardHeader>
            <CardTitle>Total Errors</CardTitle>
            <CardDescription>In selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{analytics.totalErrors}</div>
          </CardContent>
        </Card>

        {/* Error Timeline */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Error Timeline</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.errorTimeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#8884d8"
                  name="Error Count"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Errors by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Errors by Type</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.errorsByType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Errors by Endpoint */}
        <Card>
          <CardHeader>
            <CardTitle>Errors by Endpoint</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.errorsByEndpoint}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="endpoint" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Errors */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Recent Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.recentErrors.map((error) => (
                <div
                  key={error.id}
                  className="p-4 border rounded-lg flex items-start justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        error.type === 'validation' ? 'default' :
                        error.type === 'authentication' ? 'destructive' :
                        error.type === 'authorization' ? 'warning' :
                        'secondary'
                      }>
                        {error.type}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {error.endpoint}
                      </span>
                    </div>
                    <p className="text-sm">{error.message}</p>
                    {error.userId && (
                      <p className="text-xs text-muted-foreground">
                        User ID: {error.userId}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(error.timestamp), { addSuffix: true })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
