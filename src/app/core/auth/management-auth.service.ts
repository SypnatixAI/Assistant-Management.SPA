import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MsalService } from '@azure/msal-angular';
import { AccountInfo, AuthenticationResult } from '@azure/msal-browser';
import { defaultIfEmpty, firstValueFrom } from 'rxjs';
import { MANAGEMENT_AUTH_CONFIG, ManagementAuthenticationMode } from './management-auth.config';
import { LocalAccessTokenService } from './local-access-token.service';

interface LocalAccessTokenResponse {
  readonly access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class ManagementAuthService {
  private readonly config = inject(MANAGEMENT_AUTH_CONFIG);
  private readonly http = inject(HttpClient);
  private readonly localAccessTokenService = inject(LocalAccessTokenService);
  private readonly msalService = inject(MsalService, { optional: true });

  async initialize(): Promise<void> {
    if (this.config.authenticationMode === ManagementAuthenticationMode.Disabled) {
      return;
    }

    if (this.config.authenticationMode === ManagementAuthenticationMode.LocalJwt) {
      await this.ensureLocalAccessToken();
      return;
    }

    const msalService = this.getMsalService();
    const result = await firstValueFrom(
      msalService.handleRedirectObservable().pipe(defaultIfEmpty(null)),
    );
    this.ensureActiveAccount(result);
  }

  ensureAuthenticated(): boolean | Promise<boolean> {
    if (this.config.authenticationMode === ManagementAuthenticationMode.Disabled) {
      return true;
    }

    if (this.config.authenticationMode === ManagementAuthenticationMode.LocalJwt) {
      return this.ensureLocalAccessToken().then(() => true);
    }

    if (this.ensureActiveAccount()) {
      return true;
    }

    return this.redirectToMicrosoftLogin();
  }

  private ensureActiveAccount(result?: AuthenticationResult | null): AccountInfo | null {
    const account =
      result?.account ??
      this.getMsalService().instance.getActiveAccount() ??
      this.getMsalService().instance.getAllAccounts()[0] ??
      null;

    if (account) {
      this.getMsalService().instance.setActiveAccount(account);
    }

    return account;
  }

  private async redirectToMicrosoftLogin(): Promise<boolean> {
    await firstValueFrom(
      this.getMsalService().loginRedirect({
        scopes: [this.config.apiScope],
      }),
    );

    return false;
  }

  private async ensureLocalAccessToken(): Promise<void> {
    if (this.localAccessTokenService.get() !== null) {
      return;
    }

    const response = await firstValueFrom(
      this.http.get<LocalAccessTokenResponse>(this.config.authenticationUrl),
    );
    this.localAccessTokenService.set(response.access_token);
  }

  private getMsalService(): MsalService {
    if (this.msalService === null) {
      throw new Error('MSAL is not configured for the current authentication mode.');
    }

    return this.msalService;
  }
}
