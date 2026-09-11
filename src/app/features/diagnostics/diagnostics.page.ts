import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-diagnostics-page',
  template: `
    <section class="page-header">
      <p class="eyebrow">Diagnostic</p>
      <h1>Diagnostiquer un problème client</h1>
      <p>
        Vérifie les points critiques dans un flow guidé: identité, abonnement,
        connecteurs, permissions, index et files de traitement.
      </p>
    </section>

    <section class="panel">
      <label for="diagnostic-client-id">Client à diagnostiquer</label>
      <div class="input-row">
        <input
          id="diagnostic-client-id"
          type="text"
          [formControl]="clientId"
          placeholder="Client id ou tenant id"
        />
        <button type="button">Lancer le diagnostic</button>
      </div>
    </section>

    <section class="checklist">
      <article>
        <strong>Identité</strong>
        <span>Valide le tenant, les utilisateurs et les droits applicatifs.</span>
      </article>
      <article>
        <strong>Sources</strong>
        <span>Contrôle Microsoft 365, SharePoint, fichiers et connecteurs.</span>
      </article>
      <article>
        <strong>Index</strong>
        <span>Compare l'état métier attendu avec la recherche disponible.</span>
      </article>
    </section>
  `,
})
export class DiagnosticsPage {
  protected readonly clientId = new FormControl('', { nonNullable: true });
}
