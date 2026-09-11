import { inject, Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AccountInfo, AuthenticationResult } from '@azure/msal-browser';
import { defaultIfEmpty, firstValueFrom } from 'rxjs';
import { MANAGEMENT_AUTH_CONFIG } from './management-auth.config';

@Injectable({
  providedIn: 'root',
})
export class ManagementAuthService {
  private readonly config = inject(MANAGEMENT_AUTH_CONFIG);
  private readonly msalService = inject(MsalService);

  async initialize(): Promise<void> {
    const result = await firstValueFrom(
      this.msalService.handleRedirectObservable().pipe(defaultIfEmpty(null)),
    );
    this.ensureActiveAccount(result);
  }

  ensureAuthenticated(): boolean | Promise<boolean> {
    if (this.ensureActiveAccount()) {
      return true;
    }

    return this.redirectToMicrosoftLogin();
  }

  private ensureActiveAccount(result?: AuthenticationResult | null): AccountInfo | null {
    const account =
      result?.account ??
      this.msalService.instance.getActiveAccount() ??
      this.msalService.instance.getAllAccounts()[0] ??
      null;

    if (account) {
      this.msalService.instance.setActiveAccount(account);
    }

    return account;
  }

  private async redirectToMicrosoftLogin(): Promise<boolean> {
    await firstValueFrom(
      this.msalService.loginRedirect({
        scopes: [this.config.apiScope],
      }),
    );

    return false;
  }
}
