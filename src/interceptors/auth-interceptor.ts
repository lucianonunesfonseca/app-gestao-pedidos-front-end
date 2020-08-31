import { API_CONFIG } from "./../config/api.config";
import { StorageService } from "./../services/storage.service";
import { Observable } from "rxjs/Rx";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(public storage: StorageService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let localUser = this.storage.getLocalUser();
    let N = API_CONFIG.baseUrl.length;
    let requesttoAPI = req.url.substring(0, N) == API_CONFIG.baseUrl;
    if (localUser && requesttoAPI) {
      const authReq = req.clone({
        headers: req.headers.set("Authorization", "Bearer " + localUser.token),
      });
      return next.handle(authReq);
    }
    return next.handle(req);
  }
}
export const AuthInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true,
};
