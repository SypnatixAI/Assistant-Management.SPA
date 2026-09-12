import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  MANAGEMENT_AUTH_CONFIG,
  ManagementAuthenticationMode,
  ManagementAuthConfig,
} from './management-auth.config';
import { ManagementAuthService } from './management-auth.service';

describe('ManagementAuthService', () => {
  const baseConfig: ManagementAuthConfig = {
    authenticationMode: ManagementAuthenticationMode.Disabled,
    authenticationUrl: '/local-auth/token',
    authority: 'https://login.microsoftonline.com/common',
    clientId: 'client-id',
    apiScope: 'api://scope/access_as_user',
  };

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
    sessionStorage.clear();
  });

  it('Given_AuthenticationIsDisabled_When_Initialize_Then_DoesNotRequestALocalToken', async () => {
    // Given
    const service = configureService({
      ...baseConfig,
      authenticationMode: ManagementAuthenticationMode.Disabled,
    });
    const http = TestBed.inject(HttpTestingController);

    // When
    await service.initialize();

    // Then
    http.expectNone('/local-auth/token');
  });

  it('Given_AuthenticationIsDisabled_When_EnsureAuthenticated_Then_ReturnsTrue', async () => {
    // Given
    const service = configureService({
      ...baseConfig,
      authenticationMode: ManagementAuthenticationMode.Disabled,
    });

    // When
    const result = await Promise.resolve(service.ensureAuthenticated());

    // Then
    expect(result).toBe(true);
  });

  it('Given_LocalJwtModeWithoutStoredToken_When_Initialize_Then_RequestsAndStoresALocalToken', async () => {
    // Given
    const service = configureService({
      ...baseConfig,
      authenticationMode: ManagementAuthenticationMode.LocalJwt,
    });
    const http = TestBed.inject(HttpTestingController);

    // When
    const initialization = service.initialize();
    const request = http.expectOne('/local-auth/token');
    request.flush({ access_token: 'local-token' });
    await initialization;

    // Then
    expect(sessionStorage.getItem('assistantCore.management.localAccessToken')).toBe('local-token');
  });

  it('Given_LocalJwtModeWithStoredToken_When_Initialize_Then_DoesNotRequestANewLocalToken', async () => {
    // Given
    sessionStorage.setItem('assistantCore.management.localAccessToken', 'existing-token');
    const service = configureService({
      ...baseConfig,
      authenticationMode: ManagementAuthenticationMode.LocalJwt,
    });
    const http = TestBed.inject(HttpTestingController);

    // When
    await service.initialize();

    // Then
    http.expectNone('/local-auth/token');
  });

  function configureService(config: ManagementAuthConfig): ManagementAuthService {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MANAGEMENT_AUTH_CONFIG, useValue: config },
      ],
    });

    return TestBed.inject(ManagementAuthService);
  }
});
