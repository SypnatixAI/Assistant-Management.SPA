import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-operations-dashboard-page',
  template: `
    <section class="action-grid" aria-label="Actions principales">
      <a routerLink="/backoffice/organizations" class="action-card">
        <strong>Organisations</strong>
        <span>Retrouver le tenant, son état et ses dernières activités.</span>
      </a>
      <a routerLink="/backoffice/diagnostics" class="action-card">
        <strong>Diagnostiquer</strong>
        <span>Identifier les erreurs d'identité, connecteurs, droits ou index.</span>
      </a>
      <a routerLink="/backoffice/indexations" class="action-card">
        <strong>Relancer une indexation</strong>
        <span>Demander une réindexation encadrée et traçable.</span>
      </a>
      <a routerLink="/backoffice/access" class="action-card">
        <strong>Rétablir un accès</strong>
        <span>Préparer une action contrôlée avec une justification claire.</span>
      </a>
      <a routerLink="/backoffice/system" class="action-card">
        <strong>Inspecter le système</strong>
        <span>Vérifier API, base, recherche, files et fournisseurs externes.</span>
      </a>
    </section>
  `,
})
export class OperationsDashboardPage {}
