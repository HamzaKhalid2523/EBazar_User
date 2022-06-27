import { HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {

  queryItems = [];

  constructor() {}

  intercept(req: HttpRequest<string>, next) {
    let tokenizedReq = req.clone({
      setHeaders: {
      },
      setParams: {
        endUser: 'true'
      }
    });

    return next.handle(tokenizedReq);
  }
}
