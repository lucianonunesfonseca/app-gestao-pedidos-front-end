import { Component } from "@angular/core";
import { NavController, IonicPage, MenuController } from "ionic-angular";
@IonicPage()
@Component({
  selector: "page-home",
  templateUrl: "home.html",
})
export class HomePage {
  constructor(
    public navCtrl: NavController,
    public menuController: MenuController
  ) {}

  login() {
    this.navCtrl.setRoot("CategoriasPage");
  }

  ionViewWillEnter() {
    this.menuController.swipeEnable(false);
  }
  ionViewDidLeave() {
    this.menuController.swipeEnable(true);
  }
}
