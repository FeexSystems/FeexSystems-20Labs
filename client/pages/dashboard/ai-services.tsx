import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  Plus, 
  Search, 
  Filter,
  History,
  BarChart3,
  Bookmark,
  Settings
} from 'lucide-react';
import { AIServiceCatalog } from '@/components/ai/AIServiceCatalog';
import { AIRequestForm } from '@/components/ai/AIRequestForm';
import { AIResponseDisplay } from '@/components/ai/AIResponseDisplay';
import { AIRequestHistory } from '@/components/ai/AIRequestHistory';
import { AIUsageAnalytics } from '@/components/ai/AIUsageAnalytics';
import { AITemplateManager } from '@/components/ai/AITemplateManager';
import { 
  AIService, 
  AIRequest,
  CreateAIRequestRequest,
  GetAIServicesResponse,
  CreateAIRequestResponse,
  GetAIRequestsResponse,
  GetAIUsageAnalyticsResponse,
  GetAITemplatesResponse
} from '../../../shared/api';
import { RealtimeStatusIndicator } from '@/components/realtime/RealtimeStatusIndicator';
import { RealtimeProgress } from '@/components/realtime/RealtimeProgress';
import { useAIRequestStatus } from '@/hooks/use-realtime-status';

export default function AIServicesPage() {
  const [activeTab, setActiveTab] = useState('catalog');
  const [selectedService, setSelectedService] = useState<AIService | null>(null);
  const [currentRequest, setCurrentRequest] = useState<AIRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const queryClient = useQueryClient();

  // Fetch AI services
  const { data: servicesData, isLoading: servicesLoading } = useQuery({
    queryKey: ['ai-services'],
    queryFn: async (): Promise<GetAIServicesResponse> => {
      const response = await fetch('/api/ai/services');
      if (!response.ok) throw new Error('Failed to fetch AI services');
      return response.json();
    }
  });

  // Fetch AI requests history
  const { data: requestsData, isLoading: requestsLoading } = useQuery({
    queryKey: ['ai-requests'],
    queryFn: async (): Promise<GetAIRequestsResponse> => {
      const response = await fetch('/api/ai/requests');
      if (!response.ok) throw new Error('Failed to fetch AI requests');
      return response.json();
    }
  });

  // Fetch usage analytics
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['ai-analytics'],
    queryFn: async (): Promise<GetAIUsageAnalyticsResponse> => {
      const response = await fetch('/api/ai/analytics');
      if (!response.ok) throw new Error('Failed to fetch AI analytics');
      return response.json();
    }
  });

  // Fetch templates
  const { data: templatesData, isLoading: templatesLoading } = useQuery({
    queryKey: ['ai-templates'],
    queryFn: async (): Promise<GetAITemplatesResponse> => {
      const response = await fetch('/api/ai/templates');
      if (!response.ok) throw new Error('Failed to fetch AI templates');
      return response.json();
    }
  });

  // Create AI request mutation
  const createRequestMutation = useMutation({
    mutationFn: async (request: CreateAIRequestRequest): Promise<CreateAIRequestResponse> => {
      const response = await fetch('/api/ai/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });
      if (!response.ok) throw new Error('Failed to create AI request');
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentRequest(data.request);
      setActiveTab('response');
      queryClient.invalidateQueries({ queryKey: ['ai-requests'] });
      queryClient.invalidateQueries({ queryKey: ['ai-analytics'] });
    }
  });

  const handleServiceSelect = (service: AIService) => {
    setSelectedService(service);
    setActiveTab('request');
  };

  const handleRequestSubmit = async (request: CreateAIRequestRequest) => {
    const result = await createRequestMutation.mutateAsync(request);
    return result.request;
  };

  const handleRequestSelect = (request: AIRequest) => {
    setCurrentRequest(request);
    setActiveTab('response');
  };

  const handleCopyResponse = (content: string) => {
    // Handle copy functionality
    console.log('Copied:', content);
  };

  const handleDownloadResponse = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFeedback = (requestId: string, rating: 'positive' | 'negative') => {
    // Handle feedback submission
    console.log('Feedback:', requestId, rating);
  };

  const services = servicesData?.services || [];
  const requests = requestsData?.requests || [];
  const analytics = analyticsData?.analytics;
  const templates = templatesData?.templates || [];

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">AI Services</h1>
          <p className="text-muted-foreground">
            Access powerful AI tools and services for your projects
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Total Requests</p>
                  <p className="text-2xl font-bold">{analytics.totalRequests}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Success Rate</p>
                  <p className="text-2xl font-bold">
                    {((analytics.successfulRequests / analytics.totalRequests) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 text-purple-600">$</div>
                <div>
                  <p className="text-sm font-medium">Total Cost</p>
                  <p className="text-2xl font-bold">${analytics.totalCost.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 text-orange-600">⚡</div>
                <div>
                  <p className="text-sm font-medium">Avg. Time</p>
                  <p className="text-2xl font-bold">
                    {(analytics.averageProcessingTime / 1000).toFixed(1)}s
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="catalog" className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>Services</span>
          </TabsTrigger>
          <TabsTrigger value="request" className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Request</span>
          </TabsTrigger>
          <TabsTrigger value="response" className="flex items-center space-x-2">
            <span>Response</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center space-x-2">
            <History className="w-4 h-4" />
            <span>History</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center space-x-2">
            <Bookmark className="w-4 h-4" />
            <span>Templates</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="space-y-6">
          <AIServiceCatalog
            services={services}
            onServiceSelect={handleServiceSelect}
            isLoading={servicesLoading}
          />
        </TabsContent>

        <TabsContent value="request" className="space-y-6">
          {selectedService ? (
            <AIRequestForm
              service={selectedService}
              onSubmit={handleRequestSubmit}
              isLoading={createRequestMutation.isPending}
              templates={templates.filter(t => t.serviceId === selectedService.id)}
            />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Brain className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Select a Service</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Choose an AI service from the catalog to create a new request
                </p>
                <Button onClick={() => setActiveTab('catalog')}>
                  Browse Services
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="response" className="space-y-6">
          {currentRequest ? (
            <AIResponseDisplay
              request={currentRequest}
              onCopy={handleCopyResponse}
              onDownload={handleDownloadResponse}
              onFeedback={handleFeedback}
              isLoading={createRequestMutation.isPending}
            />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 text-muted-foreground mb-4 opacity-50">📄</div>
                <h3 className="text-lg font-medium mb-2">No Response Selected</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Submit a request or select one from your history to view the response
                </p>
                <div className="flex space-x-2">
                  <Button onClick={() => setActiveTab('request')}>
                    New Request
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab('history')}>
                    View History
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <AIRequestHistory
            requests={requests}
            onRequestSelect={handleRequestSelect}
            isLoading={requestsLoading}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {analytics ? (
            <AIUsageAnalytics
              analytics={analytics}
              isLoading={analyticsLoading}
            />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BarChart3 className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Analytics Data</h3>
                <p className="text-muted-foreground text-center">
                  Analytics will appear here once you start using AI services
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <AITemplateManager
            templates={templates}
            services={services}
            isLoading={templatesLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}