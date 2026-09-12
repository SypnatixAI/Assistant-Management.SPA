import { Routes } from '@angular/router';
import { managementAuthGuard } from './core/auth/management-auth.guard';

export const routes: Routes = [
  {
    path: 'backoffice/dashboard',
    canActivate: [managementAuthGuard],
    loadComponent: () =>
      import('./features/dashboard/operations-dashboard.page').then(
        (page) => page.OperationsDashboardPage,
      ),
  },
  {
    path: 'backoffice/organizations',
    canActivate: [managementAuthGuard],
    loadComponent: () =>
      import('./features/organizations/organization-list.page').then(
        (page) => page.OrganizationListPage,
      ),
  },
  {
    path: 'backoffice/organizations/:organizationId',
    canActivate: [managementAuthGuard],
    loadComponent: () =>
      import('./features/organizations/organization-details.page').then(
        (page) => page.OrganizationDetailsPage,
      ),
  },
  {
    path: 'backoffice/diagnostics',
    canActivate: [managementAuthGuard],
    loadComponent: () =>
      import('./features/diagnostics/diagnostics.page').then((page) => page.DiagnosticsPage),
  },
  {
    path: 'backoffice/indexations',
    canActivate: [managementAuthGuard],
    loadComponent: () =>
      import('./features/indexations/indexation-management.page').then(
        (page) => page.IndexationManagementPage,
      ),
  },
  {
    path: 'backoffice/access',
    canActivate: [managementAuthGuard],
    loadComponent: () =>
      import('./features/access/access-recovery.page').then((page) => page.AccessRecoveryPage),
  },
  {
    path: 'backoffice/system',
    canActivate: [managementAuthGuard],
    loadComponent: () =>
      import('./features/system/system-state.page').then((page) => page.SystemStatePage),
  },
  {
    path: 'dashboard',
    redirectTo: 'backoffice/dashboard',
  },
  {
    path: 'clients',
    redirectTo: 'backoffice/organizations',
  },
  {
    path: 'diagnostics',
    redirectTo: 'backoffice/diagnostics',
  },
  {
    path: 'indexations',
    redirectTo: 'backoffice/indexations',
  },
  {
    path: 'access',
    redirectTo: 'backoffice/access',
  },
  {
    path: 'system',
    redirectTo: 'backoffice/system',
  },
  {
    path: 'backoffice',
    pathMatch: 'full',
    redirectTo: 'backoffice/dashboard',
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'backoffice/dashboard',
  },
  {
    path: '**',
    redirectTo: 'backoffice/dashboard',
  },
];
