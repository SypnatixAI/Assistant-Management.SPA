import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BackofficeAccessReevaluationResult,
  BackofficeUserDetails,
  BackofficeUserListResponse,
} from '../../domain/models/backoffice-user-access.models';

@Injectable({ providedIn: 'root' })
export class BackofficeUsersApiService {
  private readonly http = inject(HttpClient);

  getUsers(organizationId: string, search = '') {
    return this.http.get<BackofficeUserListResponse>(
      `/api/backoffice/organizations/${encodeURIComponent(organizationId)}/users`,
      { params: search ? { search } : {} },
    );
  }

  getUserDetails(organizationId: string, userId: string) {
    return this.http.get<BackofficeUserDetails>(
      `/api/backoffice/organizations/${encodeURIComponent(organizationId)}/users/${encodeURIComponent(userId)}`,
    );
  }

  reevaluateAccess(organizationId: string, userId: string) {
    return this.http.post<BackofficeAccessReevaluationResult>(
      `/api/backoffice/organizations/${encodeURIComponent(organizationId)}/users/${encodeURIComponent(userId)}/reevaluate-access`,
      {},
    );
  }
}
