import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-access-recovery-page',
  template: `
    <section class="page-header">
      <p class="eyebrow">Accès</p>
      <h1>Rétablir un accès utilisateur</h1>
      <p>
        Encadre les actions sensibles avec un client, un utilisateur et une
        justification lisible dans l'historique d'exploitation.
      </p>
    </section>

    <section class="panel form-stack">
      <label>
        Client id
        <input type="text" [formControl]="clientId" />
      </label>

      <label>
        Courriel utilisateur
        <input type="email" [formControl]="userEmail" />
      </label>

      <label>
        Justification
        <textarea rows="5" [formControl]="reason"></textarea>
      </label>

      <button type="button">Préparer le rétablissement</button>
    </section>
  `,
})
export class AccessRecoveryPage {
  protected readonly clientId = new FormControl('', { nonNullable: true });
  protected readonly userEmail = new FormControl('', { nonNullable: true });
  protected readonly reason = new FormControl('', { nonNullable: true });
}
