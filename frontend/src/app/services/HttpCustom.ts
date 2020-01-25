import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpXsrfTokenExtractor
} from '@angular/common/http';
import {Observable} from 'rxjs';

export class HttpCustom implements HttpInterceptor {
  constructor() {

  }

  getCookie(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length >= 2) return parts.pop().split(";").shift();
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this.getCookie('XSRF-TOKEN');
    if (!token) {
      return next.handle(req);
    } else {
      const header = 'X-XSRF-TOKEN';
      const clonedRequest = req.clone({headers: req.headers.set(header, token)});
      return next.handle(clonedRequest);
    }
  }
}
