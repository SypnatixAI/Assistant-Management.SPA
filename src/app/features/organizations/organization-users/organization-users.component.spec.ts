import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, Subject, of, throwError } from 'rxjs';
import { BackofficeUsersApiService } from '../../../core/api/backoffice-users-api.service';
import { BackofficeUserDetails, BackofficeUserListResponse } from '../../../domain/models/backoffice-user-access.models';
import { OrganizationUsersComponent } from './organization-users.component';

describe('OrganizationUsersComponent', () => {
  let fixture: ComponentFixture<OrganizationUsersComponent>;
  let api: StubBackofficeUsersApiService;

  beforeEach(async () => {
    api = new StubBackofficeUsersApiService();

    await TestBed.configureTestingModule({
      imports: [OrganizationUsersComponent],
      providers: [{ provide: BackofficeUsersApiService, useValue: api }],
    }).compileComponents();

    fixture = TestBed.createComponent(OrganizationUsersComponent);
    fixture.componentRef.setInput('organizationId', 'organization-1');
  });

  it('Given_UsersRequestIsPending_When_ngOnInit_Then_DisplaysLoadingState', () => {
    // Given
    const pending = new Subject<BackofficeUserListResponse>();
    api.usersResponse = pending.asObservable();

    // When
    fixture.detectChanges();

    // Then
    expect(fixture.nativeElement.textContent).toContain('Chargement des utilisateurs');
  });

  it('Given_UsersExist_When_ngOnInit_Then_DisplaysUsers', () => {
    // Given
    api.usersResponse = of({ items: [createUserSummary()] });

    // When
    fixture.detectChanges();

    // Then
    expect(fixture.nativeElement.textContent).toContain('Ada Lovelace');
    expect(fixture.nativeElement.textContent).toContain('ada@example.test');
    expect(fixture.nativeElement.textContent).toContain('Autorisé');
  });

  it('Given_NoUsersExist_When_ngOnInit_Then_DisplaysEmptyState', () => {
    // Given
    api.usersResponse = of({ items: [] });

    // When
    fixture.detectChanges();

    // Then
    expect(fixture.nativeElement.textContent).toContain('Aucun utilisateur trouvé.');
  });

  it('Given_UsersRequestFails_When_ngOnInit_Then_DisplaysErrorState', () => {
    // Given
    api.usersResponse = throwError(() => new Error('network'));

    // When
    fixture.detectChanges();

    // Then
    expect(fixture.nativeElement.querySelector('[role="alert"]')?.textContent).toContain(
      'Impossible de charger les utilisateurs de cette organisation.',
    );
  });

  it('Given_SelectedUser_When_UserDetailsAreLoaded_Then_DoesNotDisplayAccessReevaluationAction', () => {
    // Given
    const user = createUserDetails();
    api.usersResponse = of({ items: [user] });
    api.userDetailsResponse = of(user);
    fixture.detectChanges();
    const detailsButton = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find((button) => button.textContent?.trim() === 'Voir le détail');
    if (!detailsButton) {
      throw new Error("Button 'Voir le détail' not found.");
    }
    detailsButton.click();
    fixture.detectChanges();

    // Then
    expect(fixture.nativeElement.textContent).not.toContain('Réévaluer l’accès');
  });
});

function createUserSummary() {
  return {
    id: 'user-1',
    name: 'Ada Lovelace',
    email: 'ada@example.test',
    role: 'User',
    accessStatus: 'Allowed' as const,
    onboardingStatus: 'Complete' as const,
    lastSuccessfulAuthenticationAt: '2026-09-12T18:30:00Z',
    diagnostic: {
      accessAllowed: true,
      code: 'AccessAllowed',
      message: 'Aucun blocage.',
      reasons: [] as readonly string[],
    },
  };
}

function createUserDetails(): BackofficeUserDetails {
  return {
    ...createUserSummary(),
    organizationId: 'organization-1',
    identityProvider: 'MicrosoftEntraId',
    externalUserId: '00000000-0000-0000-0000-000000000001',
  };
}

class StubBackofficeUsersApiService {
  usersResponse: Observable<BackofficeUserListResponse> = of({ items: [] });
  userDetailsResponse: Observable<BackofficeUserDetails> = of(createUserDetails());

  getUsers(): Observable<BackofficeUserListResponse> {
    return this.usersResponse;
  }

  getUserDetails(): Observable<BackofficeUserDetails> {
    return this.userDetailsResponse;
  }
}
