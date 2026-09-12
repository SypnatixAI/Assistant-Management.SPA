import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { catchError, debounceTime, distinctUntilChanged, finalize, of } from 'rxjs';
import { BackofficeOrganizationListItem } from '../../domain/models/operations.models';
import { OperationsApiService } from '../../services/operations-api.service';

@Component({
  imports: [CommonModule, DatePipe, DecimalPipe, ReactiveFormsModule, RouterLink],
  selector: 'app-organization-list-page',
  styles: [
    `
      .toolbar {
        display: grid;
        gap: 12px;
        max-width: 1120px;
        margin-bottom: 18px;
      }

      .organization-table {
        width: 100%;
        min-width: 860px;
        border-collapse: collapse;
      }

      .table-shell {
        max-width: 1120px;
        overflow-x: auto;
        border: 1px solid #dce3ec;
        border-radius: 8px;
        background: #ffffff;
        box-shadow: 0 8px 24px rgb(23 32 51 / 0.04);
      }

      th,
      td {
        padding: 14px 16px;
        border-bottom: 1px solid #e6ecf3;
        text-align: left;
        vertical-align: middle;
      }

      th {
        color: #5b6b82;
        font-size: 0.78rem;
        font-weight: 800;
        text-transform: uppercase;
      }

      tr:last-child td {
        border-bottom: 0;
      }

      tbody tr {
        cursor: pointer;
      }

      tbody tr:hover {
        background: #f8fbff;
      }

      .name-cell {
        display: grid;
        gap: 2px;
      }

      .name-cell strong {
        color: #172033;
      }

      .name-cell small,
      .muted {
        color: #66758d;
      }

      .status-pill {
        display: inline-flex;
        min-width: 74px;
        justify-content: center;
        padding: 4px 8px;
        border-radius: 999px;
        font-size: 0.82rem;
        font-weight: 800;
      }

      .status-pill.active {
        background: #dafbe1;
        color: #116329;
      }

      .status-pill.disabled {
        background: #f0f3f6;
        color: #57606a;
      }

      .pager {
        display: flex;
        align-items: center;
        justify-content: space-between;
        max-width: 1120px;
        margin-top: 14px;
        gap: 12px;
        color: #5b6b82;
      }

      .pager-actions {
        display: flex;
        gap: 8px;
      }

      button[disabled] {
        opacity: 0.52;
        cursor: not-allowed;
      }
    `,
  ],
  template: `
    <section class="page-header">
      <p class="eyebrow">Organisations</p>
      <h1>Organisations clientes</h1>
    </section>

    <section class="toolbar">
      <label for="organization-search">Recherche</label>
      <div class="input-row">
        <input
          id="organization-search"
          type="search"
          [formControl]="search"
          placeholder="Nom, tenant id, email admin ou organization id"
        />
        <button type="button" (click)="reload()">Rechercher</button>
      </div>
    </section>

    @if (error()) {
      <section class="empty-state">
        <h2>Chargement impossible</h2>
        <p>{{ error() }}</p>
      </section>
    } @else if (isLoading()) {
      <section class="empty-state">
        <h2>Chargement</h2>
        <p>Les organisations arrivent.</p>
      </section>
    } @else if (items().length === 0) {
      <section class="empty-state">
        <h2>Aucune organisation</h2>
        <p>Aucun résultat pour cette recherche.</p>
      </section>
    } @else {
      <section class="table-shell" aria-label="Organisations clientes">
        <table class="organization-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Tenant ID</th>
              <th>Statut</th>
              <th>Users</th>
              <th>Sources</th>
              <th>Documents</th>
              <th>Dernier sync</th>
            </tr>
          </thead>
          <tbody>
            @for (organization of items(); track organization.id) {
              <tr [routerLink]="['/backoffice/organizations', organization.id]">
                <td>
                  <span class="name-cell">
                    <strong>{{ organization.name }}</strong>
                    <small>{{ organization.id }}</small>
                  </span>
                </td>
                <td>{{ organization.tenantId || '-' }}</td>
                <td>
                  <span class="status-pill" [class.active]="organization.status === 'Active'" [class.disabled]="organization.status === 'Disabled'">
                    {{ organization.status }}
                  </span>
                </td>
                <td>{{ organization.userCount | number }}</td>
                <td>{{ organization.connectorCount | number }}</td>
                <td>{{ organization.indexedDocumentCount | number }}</td>
                <td>{{ formatRelativeTime(organization.lastSyncAt) }}</td>
              </tr>
            }
          </tbody>
        </table>
      </section>

      <nav class="pager" aria-label="Pagination organisations">
        <span>Page {{ page() }} · {{ totalCount() | number }} organisations</span>
        <span class="pager-actions">
          <button type="button" [disabled]="page() === 1 || isLoading()" (click)="previousPage()">Précédent</button>
          <button type="button" [disabled]="!hasNextPage() || isLoading()" (click)="nextPage()">Suivant</button>
        </span>
      </nav>
    }
  `,
})
export class OrganizationListPage implements OnInit {
  private readonly api = inject(OperationsApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly pageSize = 25;

  protected readonly search = new FormControl('', { nonNullable: true });
  protected readonly items = signal<readonly BackofficeOrganizationListItem[]>([]);
  protected readonly page = signal(1);
  protected readonly totalCount = signal(0);
  protected readonly isLoading = signal(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.search.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.page.set(1);
        this.loadOrganizations();
      });

    this.loadOrganizations();
  }

  protected reload(): void {
    this.page.set(1);
    this.loadOrganizations();
  }

  protected previousPage(): void {
    if (this.page() === 1) {
      return;
    }

    this.page.update((page) => page - 1);
    this.loadOrganizations();
  }

  protected nextPage(): void {
    if (!this.hasNextPage()) {
      return;
    }

    this.page.update((page) => page + 1);
    this.loadOrganizations();
  }

  protected hasNextPage(): boolean {
    return this.page() * this.pageSize < this.totalCount();
  }

  protected formatRelativeTime(value?: string | null): string {
    if (!value) {
      return '-';
    }

    const elapsedMs = Date.now() - new Date(value).getTime();
    const minutes = Math.max(1, Math.floor(elapsedMs / 60000));
    if (minutes < 60) {
      return `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} h`;
    }

    const days = Math.floor(hours / 24);
    return `${days} j`;
  }

  private loadOrganizations(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.api
      .getOrganizations(this.page(), this.pageSize, this.search.value.trim())
      .pipe(
        catchError(() => {
          this.items.set([]);
          this.totalCount.set(0);
          this.error.set('Impossible de lire les organisations.');
          return of(null);
        }),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe((response) => {
        if (!response) {
          return;
        }

        this.items.set(response.items);
        this.page.set(response.page);
        this.totalCount.set(response.totalCount);
      });
  }
}
