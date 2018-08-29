import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, from } from 'rxjs';

import { Injectable } from '@angular/core';
import { flatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PromiseInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const promise = Promise.resolve('abcd');

    return from(promise).pipe(
      flatMap(bearerToken => {
        if (bearerToken) {
          req = req.clone({
            setHeaders: { Authorization: `Bearer ${bearerToken}` },
          });
        }

        return next.handle(req);
      }),
    );
  }
}
