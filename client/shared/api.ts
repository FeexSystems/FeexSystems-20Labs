// DevOps Types
export enum GitProvider {
    GITHUB = 'github',
    GITLAB = 'gitlab',
    BITBUCKET = 'bitbucket'
}

export interface Repository {
    id: string;
    name: string;
    fullName: string;
    provider: GitProvider;
    url: string;
    defaultBranch: string;
    isPrivate: boolean;
    lastSync?: string;
    createdAt: string;
    updatedAt: string;
}

export enum PipelineStatus {
    PENDING = 'pending',
    RUNNING = 'running',
    SUCCESS = 'success',
    FAILED = 'failed',
    CANCELLED = 'cancelled'
}

export interface PipelineStage {
    id: string;
    name: string;
    status: PipelineStatus;
    duration?: number;
    startedAt?: string;
    finishedAt?: string;
}

export interface PipelineTrigger {
    type: 'push' | 'pull_request' | 'tag' | 'schedule' | 'manual';
    branch?: string;
    schedule?: string;
}

export interface Pipeline {
    id: string;
    name: string;
    repositoryId: string;
    status: PipelineStatus;
    stages: PipelineStage[];
    triggers: PipelineTrigger[];
    branch: string;
    commit: string;
    duration?: number;
    startedAt?: string;
    finishedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export enum DeploymentStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    SUCCESS = 'success',
    FAILED = 'failed',
    ROLLED_BACK = 'rolled_back'
}

export interface Deployment {
    id: string;
    pipelineId: string;
    environment: string;
    version: string;
    status: DeploymentStatus;
    url?: string;
    startedAt: string;
    finishedAt?: string;
    createdAt: string;
    createdBy: string;
}

export interface DeploymentAnalytics {
    totalDeployments: number;
    successRate: number;
    averageDuration: number;
    deploymentsByEnvironment: Record<string, number>;
    deploymentsByStatus: Record<DeploymentStatus, number>;
    recentDeployments: Deployment[];
}

// Security Types
export enum VulnerabilitySeverity {
    CRITICAL = 'critical',
    HIGH = 'high',
    MEDIUM = 'medium',
    LOW = 'low',
    INFO = 'info'
}

export interface Vulnerability {
    id: string;
    title: string;
    description: string;
    severity: VulnerabilitySeverity;
    cveId?: string;
    cweId?: string;
    affectedComponent: string;
    affectedVersion?: string;
    fixedVersion?: string;
    recommendation: string;
    status: 'open' | 'in_progress' | 'resolved' | 'false_positive';
    discoveredAt: string;
    resolvedAt?: string;
}

export enum SecurityScanType {
    SAST = 'sast',
    DAST = 'dast',
    DEPENDENCY = 'dependency',
    CONTAINER = 'container',
    SECRET = 'secret',
    IaC = 'iac'
}

export enum ScanStatus {
    QUEUED = 'queued',
    RUNNING = 'running',
    COMPLETED = 'completed',
    FAILED = 'failed',
    CANCELLED = 'cancelled'
}

export interface ScanTarget {
    type: 'repository' | 'container' | 'infrastructure' | 'url';
    identifier: string;
    branch?: string;
}

export interface SecurityScan {
    id: string;
    type: SecurityScanType;
    target: ScanTarget;
    status: ScanStatus;
    vulnerabilities: Vulnerability[];
    startedAt: string;
    finishedAt?: string;
    duration?: number;
    createdAt: string;
    createdBy: string;
}

export enum ComplianceFramework {
    SOC2 = 'soc2',
    HIPAA = 'hipaa',
    PCI_DSS = 'pci_dss',
    GDPR = 'gdpr',
    ISO_27001 = 'iso_27001',
    NIST = 'nist'
}

export interface ComplianceCheck {
    id: string;
    framework: ComplianceFramework;
    control: string;
    description: string;
    status: 'passed' | 'failed' | 'not_applicable' | 'pending';
    lastChecked: string;
    evidence?: string;
    remediation?: string;
}

export interface SecurityAnalytics {
    totalScans: number;
    totalVulnerabilities: number;
    vulnerabilitiesBySeverity: Record<VulnerabilitySeverity, number>;
    vulnerabilitiesByStatus: Record<string, number>;
    complianceScores: Record<ComplianceFramework, number>;
    recentScans: SecurityScan[];
    trendData: {
        date: string;
        vulnerabilities: number;
        resolved: number;
    }[];
}

// AI Types
export enum AIRequestType {
    CODE_REVIEW = 'code_review',
    CODE_GENERATION = 'code_generation',
    DOCUMENTATION = 'documentation',
    DEBUGGING = 'debugging',
    OPTIMIZATION = 'optimization',
    SECURITY = 'security',
    TESTING = 'testing'
}

export enum AIRequestStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed'
}

export interface AIRequest {
    id: string;
    type: AIRequestType;
    status: AIRequestStatus;
    input: string;
    output?: string;
    model: string;
    tokens: {
        input: number;
        output: number;
        total: number;
    };
    duration?: number;
    createdAt: string;
    completedAt?: string;
    createdBy: string;
}

// User and Team Types
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
    profileImageUrl?: string;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Team {
    id: string;
    name: string;
    description?: string;
    members: TeamMember[];
    createdAt: string;
    updatedAt: string;
}

export interface TeamMember {
    id: string;
    userId: string;
    teamId: string;
    role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
    user: User;
    joinedAt: string;
}

// Billing Types
export interface Plan {
    id: string;
    name: string;
    description: string;
    price: number;
    interval: 'month' | 'year';
    limits: {
        aiRequests: number;
        deployments: number;
        securityScans: number;
        teamMembers: number;
        storage: number;
    };
    features: string[];
}

export interface Subscription {
    id: string;
    planId: string;
    plan: Plan;
    status: 'active' | 'cancelled' | 'past_due' | 'trialing';
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    createdAt: string;
}

export interface Invoice {
    id: string;
    amount: number;
    currency: string;
    status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
    invoiceUrl?: string;
    pdfUrl?: string;
    createdAt: string;
    dueDate?: string;
    paidAt?: string;
}

export interface Usage {
    aiRequests: number;
    deployments: number;
    securityScans: number;
    storage: number;
    periodStart: string;
    periodEnd: string;
}
