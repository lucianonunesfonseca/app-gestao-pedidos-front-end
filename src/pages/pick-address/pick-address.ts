import { CartService } from "./../../services/domain/cart.service";
import { PedidoDTO } from "./../../models/pedido.dto";
import { ClienteService } from "./../../services/domain/cliente.service";
import { StorageService } from "./../../services/storage.service";
import { EnderecoDTO } from "./../../models/endereco.dto";
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

/**
 * Generated class for the PickAddressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-pick-address",
  templateUrl: "pick-address.html",
})
export class PickAddressPage {
  items: EnderecoDTO[];
  pedido: PedidoDTO;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storageService: StorageService,
    public clienteService: ClienteService,
    public cartService: CartService
  ) {}

  ionViewDidLoad() {
    let localUser = this.storageService.getLocalUser();
    if (localUser && localUser.email) {
      this.clienteService.findByEmail(localUser.email).subscribe(
        (response) => {
          this.items = response["enderecos"];

          let cart = this.cartService.getCart();

          this.pedido = {
            cliente: { id: response["id"] },
            endereco: null,
            pagamento: null,
            items: cart.items.map((x) => {
              return {
                quantidade: x.quantidade,
                produto: { id: x.produto.id },
              };
            }),
          };
        },
        (error) => {
          if (error.status == 403) {
            this.navCtrl.setRoot("HomePage");
          }
        }
      );
    } else {
      this.navCtrl.setRoot("HomePage");
    }
  }
  nextPage(item: EnderecoDTO) {
    this.pedido.endereco = { id: item.id };
    this.navCtrl.push("PaymentPage", { pedido: this.pedido });
  }
}
