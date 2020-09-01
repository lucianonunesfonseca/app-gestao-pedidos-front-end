import { FieldMessage } from "./../models/fieldmessage";
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
import { AlertController } from "ionic-angular";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    public storage: StorageService,
    public alertController: AlertController
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).catch((error, caught) => {
      let errorObj = error;
      if (errorObj.error) {
        errorObj = errorObj.error;
      }
      if (!errorObj.status) {
        errorObj = JSON.parse(errorObj);
      }
      console.log("Erro detectado pelo interceptor:");
      console.log(errorObj);

      switch (errorObj.status) {
        case 401:
          this.handle401();
          break;

        case 403:
          this.handle403();
          break;
        case 422:
          this.handle422(errorObj);
          break;

        default:
          this.handlerDefaltErrors(errorObj);
      }
      return Observable.throw(errorObj);
    }) as any;
  }
  handle401() {
    let alert = this.alertController.create({
      title: "Erro 401 falha de autenticação",
      message: "Email ou senha invalidos",
      enableBackdropDismiss: false,
      buttons: [
        {
          text: "Ok",
        },
      ],
    });
    alert.present();
  }
  handle403() {
    this.storage.setLocalUser(null);
  }

  handlerDefaltErrors(errorObj) {
    let alert = this.alertController.create({
      title: "Erro " + errorObj.status + ":" + errorObj.error,
      message: errorObj.message,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: "Ok",
        },
      ],
    });
    alert.present();
  }
  handle422(errorObj) {
    let alert = this.alertController.create({
      title: "Erro 422: validação ",
      message: this.listErrors(errorObj.errors),
      enableBackdropDismiss: false,
      buttons: [
        {
          text: "Ok",
        },
      ],
    });
    alert.present();
  }
  private listErrors(messages: FieldMessage[]): string {
    let s: string = "";
    for (let i = 0; i < messages.length; i++) {
      s =
        s +
        " <p><strong> " +
        messages[i].fieldMessag +
        " </strong>:" +
        messages[i].message +
        "</p>";
    }
    return s;
  }
}

export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true,
};
