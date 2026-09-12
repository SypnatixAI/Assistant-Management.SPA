import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  AccessRecoveryRequest,
  BackofficeOrganizationDetails,
  BackofficeOrganizationListResponse,
  ClientDiagnostic,
  ClientSummary,
  IndexationJob,
  SystemHealthSnapshot,
} from '../domain/models/operations.models';

@Injectable({
  providedIn: 'root',
})
export class OperationsApiService {
  private readonly http = inject(HttpClient);

  searchClients(query: string) {
    return this.http.get<readonly ClientSummary[]>('/api/clients', {
      params: { query },
    });
  }

  getOrganizations(page: number, pageSize: number, search: string) {
    return this.http.get<BackofficeOrganizationListResponse>('/api/backoffice/organizations', {
      params: {
        page,
        pageSize,
        search,
      },
    });
  }

  getOrganizationDetails(organizationId: string) {
    return this.http.get<BackofficeOrganizationDetails>(
      `/api/backoffice/organizations/${organizationId}`,
    );
  }

  getClientDiagnostic(clientId: string) {
    return this.http.get<ClientDiagnostic>(`/api/clients/${clientId}/diagnostic`);
  }

  rerunIndexation(clientId: string) {
    return this.http.post<IndexationJob>(`/api/clients/${clientId}/indexations`, {});
  }

  recoverAccess(request: AccessRecoveryRequest) {
    return this.http.post<void>('/api/access/recoveries', request);
  }

  getSystemHealth() {
    return this.http.get<SystemHealthSnapshot>('/api/system/health');
  }
}
