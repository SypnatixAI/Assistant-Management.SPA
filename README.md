# AI Assistant Management

Backoffice operationnel pour gérer un client, diagnostiquer un problème,
relancer une indexation, rétablir un accès et inspecter l'état du système sans
SQL manuel, sans Azure Portal et sans Postman.

## Modules prévus

- Clients: recherche et fiche opérationnelle client.
- Diagnostics: contrôles guidés sur identité, connecteurs, permissions et index.
- Indexations: relance encadrée et traçable.
- Accès: préparation des actions de rétablissement avec justification.
- État système: lecture de santé API, base, recherche, files et fournisseurs.

## Structure

- `src/app/core`: configuration Angular, HTTP, interceptors et guards futurs.
- `src/app/domain`: modèles métier du backoffice.
- `src/app/services`: services API.
- `src/app/features`: écrans par capacité opérationnelle.

## Développement local

```bash
npm start
```

L'application Angular démarre par défaut sur `http://localhost:4200/`.
