import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
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
import { MANAGEMENT_AUTH_CONFIG } from './core/auth/management-auth.config';
import { ManagementAuthService } from './core/auth/management-auth.service';
import { OPERATIONS_API_CONFIG } from './core/config/operations-api.config';
import { operationsApiInterceptor } from './core/http/operations-api.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([operationsApiInterceptor]), withInterceptorsFromDi()),
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
    provideAppInitializer(() => inject(ManagementAuthService).initialize()),
  ],
};
