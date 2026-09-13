import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, Subject, of, throwError } from 'rxjs';
import { BackofficeUsersApiService } from '../../../core/api/backoffice-users-api.service';
import {
  BackofficeAccessReevaluationResult,
  BackofficeUserDetails,
  BackofficeUserListResponse,
} from '../../../domain/models/backoffice-user-access.models';
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

  it('Given_SelectedUser_When_reevaluateAccess_Then_DisplaysCorrelationIdAndUpdatedDiagnostic', () => {
    // Given
    const user = createUserDetails();
    api.usersResponse = of({ items: [user] });
    api.userDetailsResponse = of(user);
    api.reevaluationResponse = of({
      userId: user.id,
      diagnostic: {
        accessAllowed: false,
        code: 'OnboardingIncomplete',
        message: 'Accès refusé.',
        reasons: ['Consentement administrateur manquant.'],
      },
      correlationId: 'correlation-123',
      evaluatedAt: '2026-09-13T04:00:00Z',
    });
    fixture.detectChanges();
    const detailsButton = findButton('Voir le détail');
    detailsButton.click();
    fixture.detectChanges();

    // When
    const reevaluateButton = findButton('Réévaluer l’accès');
    reevaluateButton.click();
    fixture.detectChanges();

    // Then
    expect(fixture.nativeElement.textContent).toContain('correlation-123');
    expect(fixture.nativeElement.textContent).toContain('OnboardingIncomplete');
    expect(fixture.nativeElement.textContent).toContain('Refusé');
  });

  function findButton(label: string): HTMLButtonElement {
    const button = Array.from(
      fixture.nativeElement.querySelectorAll<HTMLButtonElement>('button'),
    ).find((candidate) => candidate.textContent?.trim() === label);

    if (!button) {
      throw new Error(`Button '${label}' not found.`);
    }

    return button;
  }
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
      reasons: [],
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
  reevaluationResponse: Observable<BackofficeAccessReevaluationResult> = of({
    userId: 'user-1',
    diagnostic: createUserSummary().diagnostic,
    correlationId: 'correlation-default',
    evaluatedAt: '2026-09-13T04:00:00Z',
  });

  getUsers(): Observable<BackofficeUserListResponse> {
    return this.usersResponse;
  }

  getUserDetails(): Observable<BackofficeUserDetails> {
    return this.userDetailsResponse;
  }

  reevaluateAccess(): Observable<BackofficeAccessReevaluationResult> {
    return this.reevaluationResponse;
  }
}
