import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-operations-dashboard-page',
  template: `
    <section class="page-header">
      <p class="eyebrow">Backoffice operationnel</p>
      <h1>Intervenir sans SQL manuel, Azure Portal ni Postman</h1>
      <p>
        Centralise les actions de support: trouver un client, diagnostiquer un
        incident, relancer une indexation, rétablir un accès et vérifier l'état
        du système.
      </p>
    </section>

    <section class="action-grid" aria-label="Actions principales">
      <a routerLink="/clients" class="action-card">
        <strong>Gérer un client</strong>
        <span>Retrouver le tenant, son état et ses dernières activités.</span>
      </a>
      <a routerLink="/diagnostics" class="action-card">
        <strong>Diagnostiquer</strong>
        <span>Identifier les erreurs d'identité, connecteurs, droits ou index.</span>
      </a>
      <a routerLink="/indexations" class="action-card">
        <strong>Relancer une indexation</strong>
        <span>Demander une réindexation encadrée et traçable.</span>
      </a>
      <a routerLink="/access" class="action-card">
        <strong>Rétablir un accès</strong>
        <span>Préparer une action contrôlée avec une justification claire.</span>
      </a>
      <a routerLink="/system" class="action-card">
        <strong>Inspecter le système</strong>
        <span>Vérifier API, base, recherche, files et fournisseurs externes.</span>
      </a>
    </section>
  `,
})
export class OperationsDashboardPage {}
