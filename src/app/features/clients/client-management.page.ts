import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-client-management-page',
  template: `
    <section class="page-header">
      <p class="eyebrow">Clients</p>
      <h1>Retrouver un client et comprendre son état</h1>
      <p>
        Recherche par nom, tenant, domaine ou identifiant interne pour ouvrir une
        fiche opérationnelle sans requête SQL.
      </p>
    </section>

    <section class="panel">
      <label for="client-search">Recherche client</label>
      <div class="input-row">
        <input
          id="client-search"
          type="search"
          [formControl]="query"
          placeholder="Nom, tenant id, domaine..."
        />
        <button type="button">Rechercher</button>
      </div>
    </section>

    <section class="empty-state">
      <h2>Aucun client sélectionné</h2>
      <p>
        La fiche client affichera le statut du tenant, les connecteurs actifs,
        les incidents récents, les indexations et les actions disponibles.
      </p>
    </section>
  `,
})
export class ClientManagementPage {
  protected readonly query = new FormControl('', { nonNullable: true });
}
