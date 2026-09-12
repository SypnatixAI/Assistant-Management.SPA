import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BackofficeOrganizationListResponse } from '../domain/models/operations.models';
import { OperationsApiService } from './operations-api.service';

describe('OperationsApiService', () => {
  let service: OperationsApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(OperationsApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('Given_PaginationAndSearch_When_GetOrganizations_Then_CallsBackofficeOrganizationsEndpoint', () => {
    // Given
    const response: BackofficeOrganizationListResponse = {
      items: [],
      page: 1,
      pageSize: 25,
      totalCount: 0,
    };
    let receivedResponse: BackofficeOrganizationListResponse | undefined;

    // When
    service.getOrganizations(1, 25, 'metal').subscribe((result) => {
      receivedResponse = result;
    });

    // Then
    const request = http.expectOne((candidate) =>
      candidate.method === 'GET'
      && candidate.url === '/api/backoffice/organizations'
      && candidate.params.get('page') === '1'
      && candidate.params.get('pageSize') === '25'
      && candidate.params.get('search') === 'metal',
    );
    request.flush(response);
    expect(receivedResponse).toBe(response);
  });

  it('Given_AnOrganizationId_When_GetOrganizationDetails_Then_CallsBackofficeOrganizationDetailsEndpoint', () => {
    // Given
    const organizationId = 'organization-id';

    // When
    service.getOrganizationDetails(organizationId).subscribe();

    // Then
    const request = http.expectOne(`/api/backoffice/organizations/${organizationId}`);
    expect(request.request.method).toBe('GET');
    request.flush({
      organization: {
        id: organizationId,
        name: 'MetalPro',
        status: 'Active',
        createdAt: '2026-09-10T20:00:00Z',
      },
      users: { total: 0, active: 0 },
      microsoft: { connected: false, adminConsentGranted: false },
      sources: { sharePointSiteCount: 0, oneDriveCount: 0 },
      indexing: { documentCount: 0, status: 'NotConfigured' },
    });
  });
});
