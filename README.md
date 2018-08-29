# NgPromiseInterceptorTestBug

If an interceptor uses a promise in an Observable pipeline like so...

```typescript
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
```

And you use the `HttpTestingController` to test the interceptor like so...

```typescript
it('should set authorization headers with a bearer token', (done: DoneFn) => {
  client.get<{ test: boolean }>('/').subscribe(done);

  const testRequest = controller.expectOne('/');
  const request = testRequest.request;

  expect(request.headers.has('Authorization'));
  expect(request.headers.get('Authorization')).toBe(`Bearer ${bearerToken}`);

  testRequest.flush({ test: true });
});
```

Then the `controller.expectOne('/')` call will fail the test stating no request was made.

`Error: Expected one matching request for criteria "Match URL: /", found none.`

Even though the `HttpClient` made the request.

----

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.1.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
