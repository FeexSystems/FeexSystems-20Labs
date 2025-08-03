export interface SecurityScan {
  id: string;
  userId: string;
  target: ScanTarget;
  scanType: 'vulnerability' | 'penetration' | 'compliance';
  status: 'queued' | 'running' | 'completed' | 'failed';
  results?: ScanResults;
  scheduledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
}

export interface ScanTarget {
  type: 'url' | 'ip' | 'domain' | 'repository' | 'file';
  value: string;
  port?: number;
  credentials?: {
    username?: string;
    password?: string;
    apiKey?: string;
  };
  metadata?: Record<string, any>;
}

export interface Vulnerability {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  cve?: string;
  cvss?: number;
  remediation: string;
  affectedComponents: string[];
  references: string[];
  discoveredAt: Date;
}

export interface ScanResults {
  summary: {
    totalVulnerabilities: number;
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
    infoCount: number;
    scanDuration: number;
    targetInfo: {
      type: string;
      value: string;
      resolved?: string;
    };
  };
  vulnerabilities: Vulnerability[];
  recommendations: string[];
  metadata: {
    scannerVersion: string;
    scannerType: string;
    timestamp: Date;
    configuration: Record<string, any>;
  };
}e
xport interface SecurityScanJob {
  scanId: string;
  userId: string;
  target: ScanTarget;
  scanType: 'vulnerability' | 'penetration' | 'compliance';
  configuration?: ScanConfiguration;
  priority: 'low' | 'normal' | 'high';
}

export interface ScanConfiguration {
  depth?: 'shallow' | 'medium' | 'deep';
  timeout?: number;
  maxConcurrency?: number;
  excludePatterns?: string[];
  includePatterns?: string[];
  customRules?: string[];
  reportFormat?: 'json' | 'xml' | 'html' | 'pdf';
}

export interface SecurityScanner {
  id: string;
  name: string;
  description: string;
  scanTypes: ('vulnerability' | 'penetration' | 'compliance')[];
  targetTypes: ('url' | 'ip' | 'domain' | 'repository' | 'file')[];
  isActive: boolean;
  configuration: ScannerConfiguration;
  limits: ScannerLimits;
}

export interface ScannerConfiguration {
  executable?: string;
  apiEndpoint?: string;
  apiKey?: string;
  timeout: number;
  maxConcurrency: number;
  defaultParameters: Record<string, any>;
}

export interface ScannerLimits {
  maxScansPerHour: number;
  maxScansPerDay: number;
  maxTargetsPerScan: number;
  maxScanDuration: number;
}

export interface CVEDatabase {
  id: string;
  cveId: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  cvss: number;
  publishedDate: Date;
  modifiedDate: Date;
  references: string[];
  affectedProducts: string[];
  vectorString?: string;
}

export interface ScanQueueStats {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  totalProcessed: number;
  averageProcessingTime: number;
}

export interface UserScanStats {
  totalScans: number;
  completedScans: number;
  failedScans: number;
  pendingScans: number;
  runningScans: number;
  vulnerabilitiesFound: number;
  criticalVulnerabilities: number;
  lastScanDate?: Date;
}

export type SecurityScanType = 'vulnerability' | 'penetration' | 'compliance';
export type ScanStatus = 'queued' | 'running' | 'completed' | 'failed';
export type VulnerabilitySeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type ScanTargetType = 'url' | 'ip' | 'domain' | 'repository' | 'file';
export type ScanPriority = 'low' | 'normal' | 'high';