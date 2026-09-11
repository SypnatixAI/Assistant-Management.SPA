import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  AccessRecoveryRequest,
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
    return this.http.get<readonly ClientSummary[]>('/clients', {
      params: { query },
    });
  }

  getClientDiagnostic(clientId: string) {
    return this.http.get<ClientDiagnostic>(`/clients/${clientId}/diagnostic`);
  }

  rerunIndexation(clientId: string) {
    return this.http.post<IndexationJob>(`/clients/${clientId}/indexations`, {});
  }

  recoverAccess(request: AccessRecoveryRequest) {
    return this.http.post<void>('/access/recoveries', request);
  }

  getSystemHealth() {
    return this.http.get<SystemHealthSnapshot>('/system/health');
  }
}
