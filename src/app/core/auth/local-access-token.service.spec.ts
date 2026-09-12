import { TestBed } from '@angular/core/testing';
import { LocalAccessTokenService } from './local-access-token.service';

describe('LocalAccessTokenService', () => {
  let service: LocalAccessTokenService;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalAccessTokenService);
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('Given_AStoredToken_When_Get_Then_ReturnsTheToken', () => {
    // Given
    service.set('local-token');

    // When
    const token = service.get();

    // Then
    expect(token).toBe('local-token');
  });

  it('Given_AnEmptyToken_When_Set_Then_Throws', () => {
    // Given
    const token = '';

    // When
    const action = () => service.set(token);

    // Then
    expect(action).toThrow('The local access token cannot be empty.');
  });

  it('Given_AStoredToken_When_Clear_Then_RemovesTheToken', () => {
    // Given
    service.set('local-token');

    // When
    service.clear();

    // Then
    expect(service.get()).toBeNull();
  });
});
