import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';

import { PromiseInterceptor } from './promise.interceptor';

fdescribe('PromiseInterceptor', () => {
  let client: HttpClient;
  let controller: HttpTestingController;

  const bearerToken = 'acbd';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: PromiseInterceptor,
          multi: true,
        }
      ],
    });
  });

  beforeEach(inject(
    [HttpClient, HttpTestingController],
    (httpClient: HttpClient, httpTestingController: HttpTestingController) => {
      client = httpClient;
      controller = httpTestingController;
    },
  ));

  afterEach(() => {
    controller.verify();
  });

  it('should set authorization headers with a bearer token', (done: DoneFn) => {
    client.get<{ test: boolean }>('/').subscribe(done);

    const testRequest = controller.expectOne('/');
    const request = testRequest.request;

    expect(request.headers.has('Authorization'));
    expect(request.headers.get('Authorization')).toBe(`Bearer ${bearerToken}`);

    testRequest.flush({ test: true });
  });
});
