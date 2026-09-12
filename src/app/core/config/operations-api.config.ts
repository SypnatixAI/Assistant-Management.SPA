import { InjectionToken } from '@angular/core';

export interface OperationsApiConfig {
  readonly apiBaseUrl: string;
}

export const OPERATIONS_API_CONFIG = new InjectionToken<OperationsApiConfig>(
  'OPERATIONS_API_CONFIG',
  {
    factory: () => ({
      apiBaseUrl: '/',
    }),
  },
);
