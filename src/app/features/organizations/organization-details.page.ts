import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { BackofficeOrganizationDetails } from '../../domain/models/operations.models';
import { OperationsApiService } from '../../services/operations-api.service';

@Component({
  imports: [CommonModule, DatePipe, DecimalPipe, RouterLink],
  selector: 'app-organization-details-page',
  styles: [
    `
      .details-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 18px;
        max-width: 1120px;
        margin-bottom: 22px;
      }

      .details-header h1 {
        margin: 4px 0 8px;
        font-size: 2.3rem;
        line-height: 1.1;
      }

      .back-link {
        color: #1f6feb;
        font-weight: 800;
        text-decoration: none;
      }

      .meta-grid,
      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 14px;
        max-width: 1120px;
      }

      .metric,
      .meta-card {
        display: grid;
        gap: 8px;
        min-height: 112px;
        padding: 18px;
        border: 1px solid #dce3ec;
        border-radius: 8px;
        background: #ffffff;
        box-shadow: 0 8px 24px rgb(23 32 51 / 0.04);
      }

      .metric span,
      .meta-card span {
        color: #66758d;
        font-weight: 700;
      }

      .metric strong,
      .meta-card strong {
        color: #172033;
        font-size: 1.6rem;
        line-height: 1.1;
      }

      .meta-card strong {
        font-size: 1.05rem;
        overflow-wrap: anywhere;
      }

      .section-title {
        max-width: 1120px;
        margin: 28px 0 12px;
        color: #29374d;
        font-size: 1.1rem;
      }

      .status-pill {
        display: inline-flex;
        width: max-content;
        min-width: 84px;
        justify-content: center;
        padding: 4px 8px;
        border-radius: 999px;
        font-size: 0.82rem;
        font-weight: 800;
      }

      .status-pill.active,
      .status-pill.healthy {
        background: #dafbe1;
        color: #116329;
      }

      .status-pill.disabled,
      .status-pill.not-configured {
        background: #f0f3f6;
        color: #57606a;
      }

      .status-pill.error {
        background: #ffebe9;
        color: #cf222e;
      }
    `,
  ],
  template: `
    @if (error()) {
      <section class="empty-state">
        <h2>Organisation introuvable</h2>
        <p>{{ error() }}</p>
      </section>
    } @else if (isLoading()) {
      <section class="empty-state">
        <h2>Chargement</h2>
        <p>La fiche arrive.</p>
      </section>
    } @else if (details(); as details) {
      <section class="details-header">
        <div>
          <a class="back-link" routerLink="/backoffice/organizations">Organisations</a>
          <h1>{{ details.organization.name }}</h1>
          <span class="status-pill" [class.active]="details.organization.status === 'Active'" [class.disabled]="details.organization.status === 'Disabled'">
            {{ details.organization.status }}
          </span>
        </div>
      </section>

      <section class="meta-grid" aria-label="Identité organisation">
        <article class="meta-card">
          <span>Tenant ID</span>
          <strong>{{ details.organization.tenantId || '-' }}</strong>
        </article>
        <article class="meta-card">
          <span>Organization ID</span>
          <strong>{{ details.organization.id }}</strong>
        </article>
        <article class="meta-card">
          <span>Created</span>
          <strong>{{ details.organization.createdAt | date: 'yyyy-MM-dd' }}</strong>
        </article>
      </section>

      <h2 class="section-title">État général</h2>
      <section class="metrics-grid" aria-label="État général">
        <article class="metric">
          <span>Users</span>
          <strong>{{ details.users.total | number }}</strong>
          <small>{{ details.users.active | number }} actifs</small>
        </article>
        <article class="metric">
          <span>Microsoft 365</span>
          <strong>{{ details.microsoft.connected ? 'Connected' : 'Not connected' }}</strong>
          <small>{{ details.microsoft.adminConsentGranted ? 'Consent granted' : 'No consent' }}</small>
        </article>
        <article class="metric">
          <span>SharePoint</span>
          <strong>{{ details.sources.sharePointSiteCount | number }} sites</strong>
        </article>
        <article class="metric">
          <span>OneDrive</span>
          <strong>{{ details.sources.oneDriveCount | number }} drives</strong>
        </article>
        <article class="metric">
          <span>Indexed documents</span>
          <strong>{{ details.indexing.documentCount | number }}</strong>
        </article>
        <article class="metric">
          <span>Indexing</span>
          <strong>
            <span class="status-pill" [class.healthy]="details.indexing.status === 'Healthy'" [class.error]="details.indexing.status === 'Error'" [class.not-configured]="details.indexing.status === 'NotConfigured'">
              {{ details.indexing.status }}
            </span>
          </strong>
          <small>Last synchronization {{ formatRelativeTime(details.indexing.lastSyncAt) }}</small>
        </article>
      </section>
    }
  `,
})
export class OrganizationDetailsPage implements OnInit {
  private readonly api = inject(OperationsApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly details = signal<BackofficeOrganizationDetails | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly error = signal<string | null>(null);

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
