import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { BackofficeOrganizationDetails } from '../../domain/models/operations.models';
import { OperationsApiService } from '../../services/operations-api.service';
import { OrganizationUsersComponent } from './organization-users/organization-users.component';

type OrganizationDetailsTab = 'overview' | 'users';

@Component({
  imports: [CommonModule, DatePipe, DecimalPipe, RouterLink, OrganizationUsersComponent],
  selector: 'app-organization-details-page',
  templateUrl: './organization-details.page.html',
  styleUrl: './organization-details.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationDetailsPage implements OnInit {
  private readonly api = inject(OperationsApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly details = signal<BackofficeOrganizationDetails | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly activeTab = signal<OrganizationDetailsTab>('overview');

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const organizationId = params.get('organizationId');
      if (!organizationId) {
        this.error.set('Identifiant organisation manquant.');
        return;
      }

      this.loadDetails(organizationId);
    });
  }

  protected formatRelativeTime(value?: string | null): string {
    if (!value) {
      return '-';
    }

    const elapsedMs = Date.now() - new Date(value).getTime();
    const minutes = Math.max(1, Math.floor(elapsedMs / 60000));
    if (minutes < 60) {
      return `${minutes} minutes ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hours ago`;
    }

    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  }

  private loadDetails(organizationId: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.api
      .getOrganizationDetails(organizationId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(() => {
          this.details.set(null);
          this.error.set('Impossible de lire cette organisation.');
          return of(null);
        }),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe((details) => {
        if (details) {
          this.details.set(details);
        }
      });
  }
}
