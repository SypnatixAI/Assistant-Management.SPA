export type OperationSeverity = 'healthy' | 'warning' | 'critical';

export interface ClientSummary {
  readonly id: string;
  readonly name: string;
  readonly tenantId: string;
  readonly plan: string;
  readonly status: OperationSeverity;
  readonly lastActivityAt: string;
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
