export interface Repository {
  id: string;
  userId: string;
  provider: 'github' | 'gitlab' | 'bitbucket';
  repoUrl: string;
  branch: string;
  accessTokenEncrypted?: string;
  webhookUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Pipeline {
  id: string;
  repositoryId: string;
  name: string;
  stages: PipelineStage[];
  triggers: PipelineTrigger[];
  environment: Record<string, string>;
  status: 'active' | 'paused' | 'disabled';
  createdAt: Date;
  updatedAt: Date;
}

export interface PipelineStage {
  id: string;
  name: string;
  type: 'build' | 'test' | 'deploy' | 'custom';
  commands: string[];
  environment?: Record<string, string>;
  dependsOn?: string[];
  timeout?: number;
}

export interface PipelineTrigger {
  id: string;
  type: 'push' | 'pull_request' | 'schedule' | 'manual';
  branches?: string[];
  schedule?: string; // cron expression
  conditions?: Record<string, any>;
}

export interface Deployment {
  id: string;
  repositoryId: string;
  pipelineId?: string;
  commit: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'canceled';
  logs?: DeploymentLog[];
  startedAt: Date;
  completedAt?: Date;
}

export interface DeploymentLog {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  stage?: string;
}

export interface GitProviderConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

export interface OAuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  tokenType: string;
}

export interface RepositoryInfo {
  id: string;
  name: string;
  fullName: string;
  description?: string;
  url: string;
  defaultBranch: string;
  isPrivate: boolean;
  language?: string;
  updatedAt: Date;
}

export interface WebhookPayload {
  event: string;
  repository: {
    id: string;
    name: string;
    fullName: string;
    url: string;
  };
  commit?: {
    id: string;
    message: string;
    author: {
      name: string;
      email: string;
    };
    timestamp: Date;
  };
  branch?: string;
  pullRequest?: {
    id: string;
    title: string;
    state: string;
    sourceBranch: string;
    targetBranch: string;
  };
}

export interface GitProvider {
  name: string;
  getAuthUrl(state: string): string;
  exchangeCodeForTokens(code: string): Promise<OAuthTokens>;
  refreshTokens(refreshToken: string): Promise<OAuthTokens>;
  getUserRepositories(accessToken: string): Promise<RepositoryInfo[]>;
  getRepository(accessToken: string, repoId: string): Promise<RepositoryInfo>;
  createWebhook(accessToken: string, repoId: string, webhookUrl: string): Promise<string>;
  deleteWebhook(accessToken: string, repoId: string, webhookId: string): Promise<void>;
  validateWebhookSignature(payload: string, signature: string, secret: string): boolean;
}