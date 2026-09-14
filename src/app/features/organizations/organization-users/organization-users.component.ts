import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, of } from 'rxjs';
import { BackofficeUsersApiService } from '../../../core/api/backoffice-users-api.service';
import { BackofficeUserDetails, BackofficeUserSummary } from '../../../domain/models/backoffice-user-access.models';

@Component({
  selector: 'app-organization-users',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './organization-users.component.html',
  styleUrl: './organization-users.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationUsersComponent implements OnInit {
  private readonly api = inject(BackofficeUsersApiService);
  private readonly destroyRef = inject(DestroyRef);

  readonly organizationId = input.required<string>();

  protected readonly users = signal<readonly BackofficeUserSummary[]>([]);
  protected readonly selectedUser = signal<BackofficeUserDetails | null>(null);
  protected readonly search = signal('');
  protected readonly isLoading = signal(false);
  protected readonly isLoadingDetails = signal(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadUsers();
  }

  protected loadUsers(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.api
      .getUsers(this.organizationId(), this.search().trim())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(() => {
          this.users.set([]);
          this.error.set('Impossible de charger les utilisateurs de cette organisation.');
          return of(null);
        }),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe((response) => {
        if (response) {
          this.users.set(response.items);
        }
      });
  }

  protected updateSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  protected openUser(userId: string): void {
    this.isLoadingDetails.set(true);
    this.error.set(null);
    this.api
      .getUserDetails(this.organizationId(), userId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(() => {
          this.selectedUser.set(null);
          this.error.set('Impossible de charger le détail de cet utilisateur.');
          return of(null);
        }),
        finalize(() => this.isLoadingDetails.set(false)),
      )
      .subscribe((user) => {
        if (user) {
          this.selectedUser.set(user);
        }
      });
  }

  protected closeUser(): void {
    this.selectedUser.set(null);
  }

}
