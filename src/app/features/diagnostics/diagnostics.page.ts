import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { BackofficeOrganizationListItem } from '../../domain/models/operations.models';
import { OperationsApiService } from '../../services/operations-api.service';

type DiagnosticFilter = 'all' | 'attention' | 'healthy';

@Component({
  imports: [CommonModule, DecimalPipe, RouterLink],
  selector: 'app-diagnostics-page',
  styles: [`
    .filters { display: flex; flex-wrap: wrap; gap: 8px; margin: 24px 0 16px; }
    .filters button.active { background: #172033; color: #fff; }
    .diagnostic-table { width: 100%; border-collapse: collapse; }
    .diagnostic-table th, .diagnostic-table td { padding: 14px 16px; border-bottom: 1px solid #e6ecf3; text-align: left; }
    .diagnostic-table th { color: #5b6b82; font-size: .78rem; text-transform: uppercase; }
    .diagnostic-table tr:last-child td { border-bottom: 0; }
    .name-cell { display: grid; gap: 3px; }
    .name-cell small, .muted { color: #66758d; }
    .status { display: inline-flex; padding: 4px 9px; border-radius: 999px; font-weight: 800; font-size: .82rem; }
    .status.healthy { background: #dafbe1; color: #116329; }
    .status.attention { background: #fff1c7; color: #795600; }
    .table-shell { overflow-x: auto; border: 1px solid #dce3ec; border-radius: 8px; background: #fff; }
  `],
  template: `
    <section class="page-header">
      <p class="eyebrow">Centre opérationnel</p>
      <h1>Diagnostics des organisations</h1>
      <p>Repère les organisations à surveiller et ouvre directement leur fiche. Aucun identifiant technique n’est nécessaire.</p>
    </section>

    @if (error()) {
      <section class="empty-state"><h2>Diagnostic indisponible</h2><p>{{ error() }}</p></section>
    } @else if (isLoading()) {
      <section class="empty-state"><h2>Analyse en cours</h2><p>Chargement des organisations…</p></section>
    } @else {
      <section class="summary-grid" aria-label="Résumé des diagnostics">
        <article><span>Total</span><strong>{{ organizations().length | number }}</strong></article>
        <article><span>À surveiller</span><strong>{{ attentionOrganizations().length | number }}</strong></article>
        <article><span>Saines</span><strong>{{ healthyOrganizations().length | number }}</strong></article>
      </section>

      <div class="filters" aria-label="Filtrer les diagnostics">
        <button type="button" [class.active]="filter() === 'all'" (click)="filter.set('all')">Toutes</button>
        <button type="button" [class.active]="filter() === 'attention'" (click)="filter.set('attention')">À surveiller</button>
        <button type="button" [class.active]="filter() === 'healthy'" (click)="filter.set('healthy')">Saines</button>
      </div>

      @if (filteredOrganizations().length === 0) {
        <section class="empty-state"><h2>Aucun résultat</h2><p>Aucune organisation ne correspond à ce filtre.</p></section>
      } @else {
        <section class="table-shell">
          <table class="diagnostic-table">
            <thead><tr><th>Organisation</th><th>État</th><th>Documents</th><th>Synchronisation</th><th></th></tr></thead>
            <tbody>
              @for (organization of filteredOrganizations(); track organization.id) {
                <tr>
                  <td><span class="name-cell"><strong>{{ organization.name }}</strong><small>{{ organization.userCount | number }} utilisateurs · {{ organization.connectorCount | number }} connecteurs</small></span></td>
                  <td><span class="status" [class.healthy]="isHealthy(organization)" [class.attention]="!isHealthy(organization)">{{ isHealthy(organization) ? 'Saine' : 'À surveiller' }}</span></td>
                  <td>{{ organization.indexedDocumentCount | number }}</td>
                  <td class="muted">{{ organization.lastSyncAt ? 'Synchronisée' : 'Jamais synchronisée' }}</td>
                  <td><a [routerLink]="['/backoffice/organizations', organization.id]">Ouvrir la fiche</a></td>
                </tr>
              }
            </tbody>
          </table>
        </section>
      }
    }
  `,
})
export class DiagnosticsPage implements OnInit {
  private readonly api = inject(OperationsApiService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly organizations = signal<readonly BackofficeOrganizationListItem[]>([]);
  protected readonly filter = signal<DiagnosticFilter>('all');
  protected readonly isLoading = signal(false);
  protected readonly error = signal<string | null>(null);

  protected isHealthy(organization: BackofficeOrganizationListItem): boolean {
    return organization.status === 'Active' && organization.lastSyncAt != null;
  }

  protected attentionOrganizations(): readonly BackofficeOrganizationListItem[] {
    return this.organizations().filter((organization) => !this.isHealthy(organization));
  }

  protected healthyOrganizations(): readonly BackofficeOrganizationListItem[] {
    return this.organizations().filter((organization) => this.isHealthy(organization));
  }

  protected filteredOrganizations(): readonly BackofficeOrganizationListItem[] {
    switch (this.filter()) {
      case 'attention': return this.attentionOrganizations();
      case 'healthy': return this.healthyOrganizations();
      default: return this.organizations();
    }
  }

  ngOnInit(): void {
    this.isLoading.set(true);
    this.api.getOrganizations(1, 100, '')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(() => {
          this.error.set('Impossible de charger les organisations.');
          return of(null);
        }),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe((response) => {
        if (response) this.organizations.set(response.items);
      });
  }
}
