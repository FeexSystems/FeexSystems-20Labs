export interface AIService {
  id: string;
  name: string;
  description: string;
  category: 'chat' | 'analysis' | 'generation' | 'processing';
  pricing: ServicePricing;
  limits: UsageLimits;
  isActive: boolean;
  provider: string;
  endpoint?: string;
  parameters?: Record<string, AIServiceParameter>;
}

export interface ServicePricing {
  type: 'per_request' | 'per_token' | 'per_minute';
  cost: number; // Cost in cents
  currency: string;
}

export interface UsageLimits {
  maxRequestsPerHour: number;
  maxRequestsPerDay: number;
  maxTokensPerRequest?: number;
  maxRequestSize?: number; // in bytes
}

export interface AIServiceParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  default?: any;
  min?: number;
  max?: number;
  options?: string[];
  description: string;
}

export interface AIRequest {
  id: string;
  userId: string;
  serviceId: string;
  input: any;
  parameters?: Record<string, any>;
  priority: 'low' | 'normal' | 'high';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export interface AIResponse {
  id: string;
  requestId: string;
  result: any;
  metadata: {
    processingTime: number;
    tokensUsed?: number;
    citations?: string[];
    confidence?: number;
    provider: string;
    model?: string;
  };
  status: 'completed' | 'failed';
  error?: string;
  createdAt: Date;
}

export interface AIRequestJob {
  requestId: string;
  userId: string;
  serviceId: string;
  input: any;
  parameters?: Record<string, any>;
  priority: 'low' | 'normal' | 'high';
}

export interface AIServiceConfig {
  services: Record<string, AIService>;
  providers: Record<string, AIProviderConfig>;
}

export interface AIProviderConfig {
  name: string;
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  retries?: number;
}

export type AIServiceCategory = 'chat' | 'analysis' | 'generation' | 'processing';
export type AIRequestStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type AIRequestPriority = 'low' | 'normal' | 'high';