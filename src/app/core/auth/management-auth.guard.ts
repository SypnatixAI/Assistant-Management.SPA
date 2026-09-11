import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { ManagementAuthService } from './management-auth.service';

export const managementAuthGuard: CanActivateFn = () =>
  inject(ManagementAuthService).ensureAuthenticated();
