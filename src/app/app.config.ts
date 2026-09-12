import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  Provider,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
  MsalBroadcastService,
  MsalGuard,
  MsalInterceptor,
  MsalService,
} from '@azure/msal-angular';
import { routes } from './app.routes';
import {
  createMsalGuardConfig,
  createMsalInstance,
  createMsalInterceptorConfig,
} from './core/auth/msal-config.factory';
import {
  DEFAULT_MANAGEMENT_AUTH_CONFIG,
  MANAGEMENT_AUTH_CONFIG,
  ManagementAuthenticationMode,
  ManagementAuthConfig,
} from './core/auth/management-auth.config';
import { ManagementAuthService } from './core/auth/management-auth.service';
import { OPERATIONS_API_CONFIG } from './core/config/operations-api.config';
import { LocalJwtInterceptor } from './core/auth/local-jwt.interceptor';

const managementAuthConfig = DEFAULT_MANAGEMENT_AUTH_CONFIG;

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: MANAGEMENT_AUTH_CONFIG, useValue: managementAuthConfig },
    ...createAuthenticationProviders(managementAuthConfig),
    provideAppInitializer(() => inject(ManagementAuthService).initialize()),
  ],
};

function createAuthenticationProviders(config: ManagementAuthConfig): Provider[] {
  if (config.authenticationMode === ManagementAuthenticationMode.Disabled) {
    return [];
  }

  if (config.authenticationMode === ManagementAuthenticationMode.LocalJwt) {
    return [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: LocalJwtInterceptor,
        multi: true,
      },
    ];
  }

  return [
    {
      provide: MSAL_INSTANCE,
      useFactory: createMsalInstance,
      deps: [MANAGEMENT_AUTH_CONFIG],
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: createMsalGuardConfig,
      deps: [MANAGEMENT_AUTH_CONFIG],
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: createMsalInterceptorConfig,
      deps: [MANAGEMENT_AUTH_CONFIG, OPERATIONS_API_CONFIG],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
  ];
}
