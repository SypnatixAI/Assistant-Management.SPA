import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { BackofficeOrganizationListItem } from '../../domain/models/operations.models';
import { OperationsApiService } from '../../services/operations-api.service';

@Component({
  imports: [CommonModule, DecimalPipe, RouterLink],
  selector: 'app-operations-dashboard-page',
  styles: [`
    .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; margin-bottom: 22px; }
    .summary-grid article { display: grid; gap: 6px; padding: 18px; border: 1px solid #dce3ec; border-radius: 8px; background: #fff; }
    .summary-grid span, .organization-card span, .organization-card small, .quick-links span { color: #66758d; }
    .summary-grid strong { color: #172033; font-size: 1.8rem; }
    .section-heading { display: flex; align-items: start; justify-content: space-between; gap: 16px; }
    .section-heading h2 { margin: 0; color: #172033; }
    .organization-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin-top: 18px; }
    .organization-card, .quick-links a { display: grid; gap: 6px; padding: 16px; border: 1px solid #dce3ec; border-radius: 8px; color: inherit; text-decoration: none; }
    .organization-card:hover, .quick-links a:hover { border-color: #9bbcf3; }
    .organization-card strong, .quick-links strong { color: #172033; }
    .quick-links { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; margin-top: 16px; }
    @media (max-width: 620px) { .section-heading { display: grid; } }
  `],
  template: `
    <section class="page-header">
      <p class="eyebrow">Vue opérationnelle</p>
      <h1>Que se passe-t-il aujourd’hui ?</h1>
      <p>Les organisations sont le point de départ. Ouvre une fiche pour consulter ses utilisateurs, ses sources et son indexation.</p>
    </section>

    @if (error()) {
      <section class="empty-state"><h2>Vue indisponible</h2><p>{{ error() }}</p></section>
    } @else if (isLoading()) {
      <section class="empty-state"><h2>Chargement</h2><p>Analyse des organisations en cours…</p></section>
    } @else {
      <section class="summary-grid" aria-label="Résumé opérationnel">
        <article><span>Organisations</span><strong>{{ organizations().length | number }}</strong></article>
        <article><span>À surveiller</span><strong>{{ attentionCount() | number }}</strong></article>
        <article><span>Documents indexés</span><strong>{{ documentCount() | number }}</strong></article>
      </section>

      <section class="panel">
        <div class="section-heading"><div><p class="eyebrow">Priorités</p><h2>Organisations à regarder</h2></div><a routerLink="/backoffice/organizations">Voir toutes les organisations</a></div>
        @if (attentionOrganizations().length === 0) {
          <p>Aucune anomalie signalée dans les données disponibles.</p>
        } @else {
          <div class="organization-cards">
            @for (organization of attentionOrganizations(); track organization.id) {
              <a class="organization-card" [routerLink]="['/backoffice/organizations', organization.id]">
                <strong>{{ organization.name }}</strong><span>{{ organization.indexedDocumentCount | number }} documents indexés</span><small>{{ organization.lastSyncAt ? 'Dernière synchronisation récente' : 'Aucune synchronisation connue' }}</small>
              </a>
            }
          </div>
        }
      </section>

      <section class="panel quick-links"><a routerLink="/backoffice/diagnostics"><strong>Ouvrir le centre de diagnostic</strong><span>Filtrer les organisations nécessitant une vérification.</span></a><a routerLink="/backoffice/system"><strong>État système</strong><span>Consulter les dépendances de la plateforme.</span></a></section>
    }
  `,
})
export class OperationsDashboardPage implements OnInit {
  private readonly api = inject(OperationsApiService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly organizations = signal<readonly BackofficeOrganizationListItem[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly error = signal<string | null>(null);

  protected attentionCount(): number {
    return this.organizations().filter((organization) => organization.status !== 'Active' || !organization.lastSyncAt).length;
  }

  protected documentCount(): number {
    return this.organizations().reduce((total, organization) => total + organization.indexedDocumentCount, 0);
  }

  protected attentionOrganizations(): readonly BackofficeOrganizationListItem[] {
    return this.organizations().filter((organization) => organization.status !== 'Active' || !organization.lastSyncAt).slice(0, 6);
  }

  ngOnInit(): void {
    this.isLoading.set(true);
    this.api.getOrganizations(1, 100, '').pipe(takeUntilDestroyed(this.destroyRef), catchError(() => { this.error.set('Impossible de charger les organisations.'); return of(null); }), finalize(() => this.isLoading.set(false))).subscribe((response) => { if (response) this.organizations.set(response.items); });
  }
}
