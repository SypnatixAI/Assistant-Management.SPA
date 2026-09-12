import { InjectionToken } from '@angular/core';

export enum ManagementAuthenticationMode {
  Disabled = 'Disabled',
  LocalJwt = 'LocalJwt',
  MicrosoftEntra = 'MicrosoftEntra',
}

export interface ManagementAuthConfig {
  readonly authenticationMode: ManagementAuthenticationMode;
  readonly authenticationUrl: string;
  readonly authority: string;
  readonly clientId: string;
  readonly apiScope: string;
}

export const DEFAULT_MANAGEMENT_AUTH_CONFIG: ManagementAuthConfig = {
  authenticationMode: ManagementAuthenticationMode.Disabled,
  authenticationUrl: '/local-auth/token',
  authority: 'https://login.microsoftonline.com/common',
  clientId: '97fda345-b54e-4243-b05a-31623871df18',
  apiScope: 'api://f70fb50b-52d5-4346-b769-1121cb3ab3e2/access_as_user',
};

export const MANAGEMENT_AUTH_CONFIG = new InjectionToken<ManagementAuthConfig>(
  'MANAGEMENT_AUTH_CONFIG',
  {
    factory: () => DEFAULT_MANAGEMENT_AUTH_CONFIG,
  },
);
