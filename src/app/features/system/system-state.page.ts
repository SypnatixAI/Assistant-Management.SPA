import { Component } from '@angular/core';

@Component({
  selector: 'app-system-state-page',
  template: `
    <section class="page-header">
      <p class="eyebrow">État système</p>
      <h1>Inspecter la santé opérationnelle</h1>
      <p>
        Donne une vue directe sur les dépendances critiques avant d'escalader un
        incident ou d'exécuter une action de correction.
      </p>
    </section>

    <section class="status-grid" aria-label="Santé système">
      <article>
        <span class="status-dot healthy"></span>
        <strong>API</strong>
        <small>En attente du endpoint santé</small>
      </article>
      <article>
        <span class="status-dot warning"></span>
        <strong>Base de données</strong>
        <small>Contrôle à brancher</small>
      </article>
      <article>
        <span class="status-dot warning"></span>
        <strong>Azure AI Search</strong>
        <small>Contrôle à brancher</small>
      </article>
      <article>
        <span class="status-dot warning"></span>
        <strong>Files de traitement</strong>
        <small>Contrôle à brancher</small>
      </article>
    </section>
  `,
})
export class SystemStatePage {}
