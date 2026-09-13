export type BackofficeAccessStatus = 'Allowed' | 'Denied';
export type BackofficeOnboardingStatus = 'Complete' | 'Incomplete';
export type BackofficeUserRole = 'PlatformAdmin' | 'TenantAdmin' | 'User' | string;

export interface BackofficeAccessDiagnostic {
  readonly accessAllowed: boolean;
  readonly code: string;
  readonly message: string;
  readonly reasons: readonly string[];
}

export interface BackofficeUserSummary {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: BackofficeUserRole;
  readonly accessStatus: BackofficeAccessStatus;
  readonly onboardingStatus: BackofficeOnboardingStatus;
  readonly lastSuccessfulAuthenticationAt?: string | null;
  readonly diagnostic: BackofficeAccessDiagnostic;
}

export interface BackofficeUserListResponse {
  readonly items: readonly BackofficeUserSummary[];
}

export interface BackofficeUserDetails extends BackofficeUserSummary {
  readonly organizationId: string;
  readonly identityProvider: string;
  readonly externalUserId: string;
}

export interface BackofficeAccessReevaluationResult {
  readonly userId: string;
  readonly diagnostic: BackofficeAccessDiagnostic;
  readonly correlationId: string;
  readonly evaluatedAt: string;
}
