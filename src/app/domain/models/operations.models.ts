export type OperationSeverity = 'healthy' | 'warning' | 'critical';

export interface ClientSummary {
  readonly id: string;
  readonly name: string;
  readonly tenantId: string;
  readonly plan: string;
  readonly status: OperationSeverity;
  readonly lastActivityAt: string;
}

export interface BackofficeOrganizationListResponse {
  readonly items: readonly BackofficeOrganizationListItem[];
  readonly page: number;
  readonly pageSize: number;
  readonly totalCount: number;
}

export interface BackofficeOrganizationListItem {
  readonly id: string;
  readonly name: string;
  readonly tenantId?: string | null;
  readonly status: 'Active' | 'Disabled';
  readonly userCount: number;
  readonly connectorCount: number;
  readonly indexedDocumentCount: number;
  readonly lastSyncAt?: string | null;
}

export interface BackofficeOrganizationDetails {
  readonly organization: BackofficeOrganization;
  readonly users: BackofficeOrganizationUsers;
  readonly microsoft: BackofficeOrganizationMicrosoft;
  readonly sources: BackofficeOrganizationSources;
  readonly indexing: BackofficeOrganizationIndexing;
}

export interface BackofficeOrganization {
  readonly id: string;
  readonly name: string;
  readonly tenantId?: string | null;
  readonly status: 'Active' | 'Disabled';
  readonly createdAt: string;
}

export interface BackofficeOrganizationUsers {
  readonly total: number;
  readonly active: number;
}

export interface BackofficeOrganizationMicrosoft {
  readonly connected: boolean;
  readonly adminConsentGranted: boolean;
}

export interface BackofficeOrganizationSources {
  readonly sharePointSiteCount: number;
  readonly oneDriveCount: number;
}

export interface BackofficeOrganizationIndexing {
  readonly documentCount: number;
  readonly lastSyncAt?: string | null;
  readonly status: 'Healthy' | 'Error' | 'NotConfigured';
}

export interface ClientDiagnostic {
  readonly clientId: string;
  readonly identityStatus: OperationSeverity;
  readonly connectorStatus: OperationSeverity;
  readonly indexingStatus: OperationSeverity;
  readonly permissionStatus: OperationSeverity;
  readonly findings: readonly DiagnosticFinding[];
}

export interface DiagnosticFinding {
  readonly title: string;
  readonly detail: string;
  readonly severity: OperationSeverity;
  readonly recommendedAction: string;
}

export interface IndexationJob {
  readonly id: string;
  readonly clientId: string;
  readonly source: string;
  readonly status: 'queued' | 'running' | 'failed' | 'completed';
  readonly requestedAt: string;
  readonly completedAt?: string;
}

export interface AccessRecoveryRequest {
  readonly clientId: string;
  readonly userEmail: string;
  readonly reason: string;
}

export interface SystemHealthSnapshot {
  readonly checkedAt: string;
  readonly api: OperationSeverity;
  readonly database: OperationSeverity;
  readonly search: OperationSeverity;
  readonly queue: OperationSeverity;
  readonly externalProviders: readonly ExternalProviderHealth[];
}

export interface ExternalProviderHealth {
  readonly name: string;
  readonly status: OperationSeverity;
  readonly detail: string;
}
