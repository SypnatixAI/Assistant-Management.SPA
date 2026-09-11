import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { OPERATIONS_API_CONFIG } from '../config/operations-api.config';

export const operationsApiInterceptor: HttpInterceptorFn = (request, next) => {
  const config = inject(OPERATIONS_API_CONFIG);

  if (/^https?:\/\//.test(request.url) || !request.url.startsWith('/')) {
    return next(request);
  }

  const apiBaseUrl = config.baseUrl.replace(/\/$/, '');
  const apiUrl = new URL(`${apiBaseUrl}${request.url}`, window.location.origin).toString();

  return next(
    request.clone({
      url: apiUrl,
    }),
  );
};
