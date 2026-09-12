import { MsalGuardConfiguration, MsalInterceptorConfiguration } from '@azure/msal-angular';
import {
  BrowserCacheLocation,
  InteractionType,
  IPublicClientApplication,
  PublicClientApplication,
} from '@azure/msal-browser';
import { OperationsApiConfig } from '../config/operations-api.config';
import { ManagementAuthConfig } from './management-auth.config';

export function createMsalInstance(config: ManagementAuthConfig): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      authority: config.authority,
      clientId: config.clientId,
      postLogoutRedirectUri: window.location.origin,
      redirectUri: window.location.origin,
    },
    cache: {
      cacheLocation: BrowserCacheLocation.SessionStorage,
    },
  });
}

export function createMsalGuardConfig(config: ManagementAuthConfig): MsalGuardConfiguration {
  return {
    authRequest: {
      scopes: [config.apiScope],
    },
    interactionType: InteractionType.Redirect,
  };
}

export function createMsalInterceptorConfig(
  authConfig: ManagementAuthConfig,
  apiConfig: OperationsApiConfig,
): MsalInterceptorConfiguration {
  const apiBaseUrl = new URL(apiConfig.apiBaseUrl, window.location.origin).toString();
  const protectedResourceMap = new Map<string, string[]>([
    [`${apiBaseUrl.replace(/\/$/, '')}/api/*`, [authConfig.apiScope]],
  ]);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}
