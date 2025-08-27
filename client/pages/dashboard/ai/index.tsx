import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Zap, 
  Brain, 
  Image, 
  MessageSquare, 
  FileText, 
  Mic,
  Search,
  Filter,
  Plus,
  Clock,
  TrendingUp,
  Star,
  Play
} from 'lucide-react';
import { 
  AIServiceCategory, 
  AIRequestStatus,
  type AIService, 
  type AIRequest,
  type AIUsageAnalytics 
} from '@shared/api';
import { AIServiceCatalog } from '@/components/ai/AIServiceCatalog';
import { AIRequestForm } from '@/components/ai/AIRequestForm';
import { AIRequestHistory } from '@/components/ai/AIRequestHistory';
import { AIUsageAnalytics as AIUsageDashboard } from '@/components/ai/AIUsageAnalytics';
import { useAIServices } from '@/hooks/use-ai-services';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function AIServicesPage() {
  const {
    services,
    requests,
    analytics,
    templates,
    isLoading,
    error,
    createRequest,
    cancelRequest,
    retryRequest,
    createTemplate
  } = useAIServices();

  const [selectedService, setSelectedService] = useState<AIService | null>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);

  const handleServiceSelect = (service: AIService) => {
    setSelectedService(service);
    setShowRequestForm(true);
  };

  const handleCreateRequest = async (data: any) => {
    if (selectedService) {
      await createRequest({
        serviceId: selectedService.id,
        ...data
      });
      setShowRequestForm(false);
      setSelectedService(null);
    }
  };

  if (isLoading && !services.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">AI Services</h1>
          <p className="text-muted-foreground">
            Access powerful AI tools and services for your projects
          </p>
        </div>
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">AI Services</h1>
          <p className="text-muted-foreground">
            Access powerful AI tools and services for your projects
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Star className="w-4 h-4 mr-2" />
            Templates
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </div>
      </div>

      <Tabs defaultValue="services" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-6">
          <AIServiceCatalog 
            services={services}
            onServiceSelect={handleServiceSelect}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <AIRequestHistory 
            requests={requests}
            onCancelRequest={cancelRequest}
            onRetryRequest={retryRequest}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {analytics && (
            <AIUsageDashboard 
              analytics={analytics}
              services={services}
            />
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Templates Coming Soon</h3>
            <p>Save and reuse your AI request configurations</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* AI Request Form Modal */}
      {showRequestForm && selectedService && (
        <AIRequestForm 
          service={selectedService}
          onSubmit={handleCreateRequest}
          onCancel={() => {
            setShowRequestForm(false);
            setSelectedService(null);
          }}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}