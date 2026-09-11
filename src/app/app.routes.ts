import { Routes } from '@angular/router';
import { managementAuthGuard } from './core/auth/management-auth.guard';

export const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [managementAuthGuard],
    loadComponent: () =>
      import('./features/dashboard/operations-dashboard.page').then(
        (page) => page.OperationsDashboardPage,
      ),
  },
  {
    path: 'clients',
    canActivate: [managementAuthGuard],
    loadComponent: () =>
      import('./features/clients/client-management.page').then((page) => page.ClientManagementPage),
  },
  {
    path: 'diagnostics',
    canActivate: [managementAuthGuard],
    loadComponent: () =>
      import('./features/diagnostics/diagnostics.page').then((page) => page.DiagnosticsPage),
  },
  {
    path: 'indexations',
    canActivate: [managementAuthGuard],
    loadComponent: () =>
      import('./features/indexations/indexation-management.page').then(
        (page) => page.IndexationManagementPage,
      ),
  },
  {
    path: 'access',
    canActivate: [managementAuthGuard],
    loadComponent: () =>
      import('./features/access/access-recovery.page').then((page) => page.AccessRecoveryPage),
  },
  {
    path: 'system',
    canActivate: [managementAuthGuard],
    loadComponent: () =>
      import('./features/system/system-state.page').then((page) => page.SystemStatePage),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
