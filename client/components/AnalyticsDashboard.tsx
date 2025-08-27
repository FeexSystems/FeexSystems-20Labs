import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { DateRangePicker } from './ui/date-range-picker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AIFeaturesPanel } from './AIFeaturesPanel';
import { SentimentPieChart, SentimentTrendLine, TagCloud } from './visualizations/SentimentAndTags';

interface AnalyticsDashboardProps {
  className?: string;
}

export function AnalyticsDashboard({ className }: AnalyticsDashboardProps) {
  const [dateRange, setDateRange] = React.useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    to: new Date(),
  });

  const { data: metrics, isLoading } = useQuery({
    queryKey: ['analytics', dateRange],
    queryFn: async () => {
      const response = await fetch(
        `/api/analytics/metrics?startDate=${dateRange.from.toISOString()}&endDate=${dateRange.to.toISOString()}`
      );
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    },
  });

  const { data: insights, isLoading: insightsLoading } = useQuery({
    queryKey: ['insights', metrics],
    queryFn: async () => {
      const response = await fetch('/api/analytics/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: JSON.stringify(metrics) }),
      });
      if (!response.ok) throw new Error('Failed to generate insights');
      return response.json();
    },
    enabled: !!metrics,
  });

  const downloadReport = async () => {
    try {
      const reportData = {
        metrics,
        insights,
        dateRange,
        generatedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report-${dateRange.from.toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Report downloaded successfully');
    } catch (error) {
      toast.error('Failed to download report');
    }
  };

  // Example: fetch sentiment and tag data (replace with real API calls as needed)
  const { data: sentimentData } = useQuery({
    queryKey: ['sentiment', dateRange],
    queryFn: async () => {
      // Replace with your backend endpoint
      const res = await fetch(`/api/analytics/sentiment-trends?startDate=${dateRange.from.toISOString()}&endDate=${dateRange.to.toISOString()}`);
      if (!res.ok) return [
        { sentiment: 'positive', value: 60 },
        { sentiment: 'neutral', value: 30 },
        { sentiment: 'negative', value: 10 },
      ];
      return res.json();
    },
  });
  const { data: sentimentTrend } = useQuery({
    queryKey: ['sentimentTrend', dateRange],
    queryFn: async () => {
      // Replace with your backend endpoint
      const res = await fetch(`/api/analytics/sentiment-trend-line?startDate=${dateRange.from.toISOString()}&endDate=${dateRange.to.toISOString()}`);
      if (!res.ok) return [
        { date: '2025-08-01', positive: 10, neutral: 5, negative: 2 },
        { date: '2025-08-02', positive: 12, neutral: 4, negative: 3 },
        { date: '2025-08-03', positive: 15, neutral: 6, negative: 1 },
      ];
      return res.json();
    },
  });
  const { data: tagCloud } = useQuery({
    queryKey: ['tagCloud', dateRange],
    queryFn: async () => {
      // Replace with your backend endpoint
      const res = await fetch(`/api/analytics/tag-cloud?startDate=${dateRange.from.toISOString()}&endDate=${dateRange.to.toISOString()}`);
      if (!res.ok) return [
        { tag: 'ai', count: 10 },
        { tag: 'analytics', count: 7 },
        { tag: 'insights', count: 5 },
      ];
      return res.json();
    },
  });

  return (
    <div className={className}>
      <AIFeaturesPanel />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
        <div className="flex gap-4">
          <DateRangePicker
            from={dateRange.from}
            to={dateRange.to}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                setDateRange({ from: range.from, to: range.to });
              }
            }}
          />
          <Button onClick={downloadReport}>Download Report</Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Users"
              value={metrics?.totalUsers}
              description="Total registered users"
              loading={isLoading}
            />
            <MetricCard
              title="Active Users"
              value={metrics?.activeUsers}
              description="Users active in selected period"
              loading={isLoading}
            />
            <MetricCard
              title="Conversion Rate"
              value={`${metrics?.conversionRate.toFixed(1)}%`}
              description="User conversion rate"
              loading={isLoading}
            />
            <MetricCard
              title="Avg. Session"
              value={`${(metrics?.averageSessionDuration / 60).toFixed(1)}m`}
              description="Average session duration"
              loading={isLoading}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics?.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <SentimentPieChart data={sentimentData || []} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <SentimentTrendLine data={sentimentTrend || []} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tags" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tag Cloud</CardTitle>
            </CardHeader>
            <CardContent>
              <TagCloud tags={tagCloud || []} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Usage</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics?.topFeatures}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="feature" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="usage" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          {insights?.insights.map((insight: string, index: number) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>Insight {index + 1}</CardTitle>
                <CardDescription>
                  Confidence: {insights.confidence.toFixed(1)}%
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>{insight}</p>
                {insights.recommendations[index] && (
                  <div className="mt-4">
                    <strong>Recommendation:</strong>
                    <p>{insights.recommendations[index]}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: number | string;
  description: string;
  loading?: boolean;
}

function MetricCard({ title, value, description, loading }: MetricCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">
          {loading ? "Loading..." : value}
        </p>
      </CardContent>
    </Card>
  );
}
