import { AuthService } from "./../../services/auth.service";
import { CredenciaisDTO } from "./../../models/credenciais.dto";
import { Component } from "@angular/core";
import { NavController, IonicPage, MenuController } from "ionic-angular";
@IonicPage()
@Component({
  selector: "page-home",
  templateUrl: "home.html",
})
export class HomePage {
  creds: CredenciaisDTO = {
    email: "",
    senha: "",
  };

  constructor(
    public navCtrl: NavController,
    public menuController: MenuController,
    public authService: AuthService
  ) {}

  ionViewWillEnter() {
    this.menuController.swipeEnable(false);
  }
  ionViewDidLeave() {
    this.menuController.swipeEnable(true);
  }

  login() {
    this.authService.authenticate(this.creds).subscribe(
      (response) => {
        this.authService.successfullLogin(
          response.headers.get("Authorization")
        );
        this.navCtrl.setRoot("CategoriasPage");
      },
      (error) => {}
    );
  }
}
