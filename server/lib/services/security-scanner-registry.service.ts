import { SecurityScanner, SecurityScanType, ScanTargetType } from '../types/security';

/**
 * Security Scanner Registry - Manages available security scanners
 */
export class SecurityScannerRegistry {
  private scanners: Map<string, SecurityScanner> = new Map();

  constructor() {
    this.initializeDefaultScanners();
  }

  /**
   * Initialize default security scanners
   */
  private initializeDefaultScanners(): void {
    // OWASP ZAP Scanner
    this.registerScanner({
      id: 'owasp-zap',
      name: 'OWASP ZAP',
      description: 'Open-source web application security scanner',
      scanTypes: ['vulnerability', 'penetration'],
      targetTypes: ['url', 'domain'],
      isActive: true,
      configuration: {
        executable: 'zap-baseline.py',
        timeout: 300,
        maxConcurrency: 2,
        defaultParameters: {
          '-t': '', // target URL
          '-J': '', // JSON report
          '-r': '', // HTML report
          '-x': '', // XML report
        }
      },
      limits: {
        maxScansPerHour: 10,
        maxScansPerDay: 50,
        maxTargetsPerScan: 1,
        maxScanDuration: 1800 // 30 minutes
      }
    });

    // Nmap Scanner
    this.registerScanner({
      id: 'nmap',
      name: 'Nmap',
      description: 'Network discovery and security auditing tool',
      scanTypes: ['vulnerability'],
      targetTypes: ['ip', 'domain'],
      isActive: true,
      configuration: {
        executable: 'nmap',
        timeout: 600,
        maxConcurrency: 3,
        defaultParameters: {
          '-sV': '', // Version detection
          '-sC': '', // Default scripts
          '--script': 'vuln', // Vulnerability scripts
          '-oX': '', // XML output
        }
      },
      limits: {
        maxScansPerHour: 20,
        maxScansPerDay: 100,
        maxTargetsPerScan: 5,
        maxScanDuration: 3600 // 1 hour
      }
    });

    // Nikto Scanner
    this.registerScanner({
      id: 'nikto',
      name: 'Nikto',
      description: 'Web server scanner for vulnerabilities',
      scanTypes: ['vulnerability'],
      targetTypes: ['url', 'domain', 'ip'],
      isActive: true,
      configuration: {
        executable: 'nikto',
        timeout: 900,
        maxConcurrency: 2,
        defaultParameters: {
          '-h': '', // target host
          '-Format': 'json',
          '-output': '',
        }
      },
      limits: {
        maxScansPerHour: 15,
        maxScansPerDay: 75,
        maxTargetsPerScan: 1,
        maxScanDuration: 2700 // 45 minutes
      }
    });

    // Custom Compliance Scanner
    this.registerScanner({
      id: 'compliance-checker',
      name: 'Compliance Checker',
      description: 'Security compliance verification tool',
      scanTypes: ['compliance'],
      targetTypes: ['url', 'domain', 'repository'],
      isActive: true,
      configuration: {
        timeout: 180,
        maxConcurrency: 5,
        defaultParameters: {
          standards: ['OWASP-Top-10', 'CIS-Controls', 'NIST-CSF'],
          depth: 'medium'
        }
      },
      limits: {
        maxScansPerHour: 25,
        maxScansPerDay: 150,
        maxTargetsPerScan: 3,
        maxScanDuration: 900 // 15 minutes
      }
    });
  }

  /**
   * Register a new scanner
   */
  registerScanner(scanner: SecurityScanner): void {
    this.scanners.set(scanner.id, scanner);
    console.log(`✅ Registered security scanner: ${scanner.name}`);
  }

  /**
   * Get all available scanners
   */
  getScanners(): SecurityScanner[] {
    return Array.from(this.scanners.values());
  }

  /**
   * Get active scanners only
   */
  getActiveScanners(): SecurityScanner[] {
    return Array.from(this.scanners.values()).filter(scanner => scanner.isActive);
  }

  /**
   * Get scanner by ID
   */
  getScanner(scannerId: string): SecurityScanner | undefined {
    return this.scanners.get(scannerId);
  }

  /**
   * Get scanners by scan type
   */
  getScannersByScanType(scanType: SecurityScanType): SecurityScanner[] {
    return Array.from(this.scanners.values())
      .filter(scanner => scanner.scanTypes.includes(scanType) && scanner.isActive);
  }

  /**
   * Get scanners by target type
   */
  getScannersByTargetType(targetType: ScanTargetType): SecurityScanner[] {
    return Array.from(this.scanners.values())
      .filter(scanner => scanner.targetTypes.includes(targetType) && scanner.isActive);
  }

  /**
   * Get compatible scanners for scan type and target type
   */
  getCompatibleScanners(scanType: SecurityScanType, targetType: ScanTargetType): SecurityScanner[] {
    return Array.from(this.scanners.values())
      .filter(scanner => 
        scanner.scanTypes.includes(scanType) && 
        scanner.targetTypes.includes(targetType) && 
        scanner.isActive
      );
  }

  /**
   * Update scanner configuration
   */
  updateScanner(scannerId: string, updates: Partial<SecurityScanner>): boolean {
    const scanner = this.scanners.get(scannerId);
    if (!scanner) {
      return false;
    }

    const updatedScanner = { ...scanner, ...updates };
    this.scanners.set(scannerId, updatedScanner);
    return true;
  }

  /**
   * Enable/disable scanner
   */
  toggleScanner(scannerId: string, isActive: boolean): boolean {
    const scanner = this.scanners.get(scannerId);
    if (!scanner) {
      return false;
    }

    scanner.isActive = isActive;
    this.scanners.set(scannerId, scanner);
    return true;
  }

  /**
   * Remove scanner
   */
  removeScanner(scannerId: string): boolean {
    return this.scanners.delete(scannerId);
  }

  /**
   * Get scanner statistics
   */
  getScannerStats(): {
    total: number;
    active: number;
    inactive: number;
    byType: Record<SecurityScanType, number>;
  } {
    const scanners = Array.from(this.scanners.values());
    const stats = {
      total: scanners.length,
      active: scanners.filter(s => s.isActive).length,
      inactive: scanners.filter(s => !s.isActive).length,
      byType: {
        vulnerability: 0,
        penetration: 0,
        compliance: 0
      } as Record<SecurityScanType, number>
    };

    scanners.forEach(scanner => {
      scanner.scanTypes.forEach(type => {
        stats.byType[type]++;
      });
    });

    return stats;
  }
}

// Singleton instance
export const securityScannerRegistry = new SecurityScannerRegistry();