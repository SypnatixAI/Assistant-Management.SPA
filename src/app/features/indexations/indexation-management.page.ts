import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-indexation-management-page',
  template: `
    <section class="page-header">
      <p class="eyebrow">Indexations</p>
      <h1>Relancer une indexation de manière contrôlée</h1>
      <p>
        Prépare une relance traçable pour éviter les manipulations directes dans
        Azure Portal ou les appels Postman isolés.
      </p>
    </section>

    <section class="panel">
      <label for="indexation-client-id">Client concerné</label>
      <div class="input-row">
        <input
          id="indexation-client-id"
          type="text"
          [formControl]="clientId"
          placeholder="Client id"
        />
        <button type="button">Relancer l'indexation</button>
      </div>
      <p class="panel-note">
        L'action finale devra enregistrer qui l'a demandée, pourquoi, et le job
        créé côté backend.
      </p>
    </section>
  `,
})
export class IndexationManagementPage {
  protected readonly clientId = new FormControl('', { nonNullable: true });
}
