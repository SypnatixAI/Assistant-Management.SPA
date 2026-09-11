import { InjectionToken } from '@angular/core';

export interface ManagementAuthConfig {
  readonly authority: string;
  readonly clientId: string;
  readonly apiScope: string;
}

export const MANAGEMENT_AUTH_CONFIG = new InjectionToken<ManagementAuthConfig>(
  'MANAGEMENT_AUTH_CONFIG',
  {
    factory: () => ({
      authority: 'https://login.microsoftonline.com/c8fc3c23-8569-4caa-9b52-7e03dbd71a6e',
      clientId: 'cc8b79e3-f7f5-40ab-b894-a815f1d2bd8f',
      apiScope: 'api://f70fb50b-52d5-4346-b769-1121cb3ab3e2/access_as_user',
    }),
  },
);
