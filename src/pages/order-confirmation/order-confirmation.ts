import { HomePage } from "./../home/home";
import { PedidoService } from "./../../services/domain/pedido.service";
import { EnderecoDTO } from "./../../models/endereco.dto";
import { ClienteDTO } from "./../../models/cliente.dto";
import { ClienteService } from "./../../services/domain/cliente.service";
import { CartItem } from "./../../models/cart-item";
import { PedidoDTO } from "./../../models/pedido.dto";
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { CartService } from "../../services/domain/cart.service";

/**
 * Generated class for the OrderConfirmationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-order-confirmation",
  templateUrl: "order-confirmation.html",
})
export class OrderConfirmationPage {
  pedido: PedidoDTO;
  cartItems: CartItem[];
  cliente: ClienteDTO;
  endereco: EnderecoDTO;
  codPedido: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public clienteService: ClienteService,
    public cartService: CartService,
    public pedidoService: PedidoService
  ) {
    this.pedido = this.navParams.get("pedido");
  }

  ionViewDidLoad() {
    this.cartItems = this.cartService.getCart().items;

    this.clienteService.findById(this.pedido.cliente.id).subscribe(
      (response) => {
        this.cliente = response as ClienteDTO;
        this.endereco = this.findEndereco(
          this.pedido.enderecoDeEntrega.id,
          response["enderecos"]
        );
      },
      (error) => {
        this.navCtrl.setRoot("HomePage");
      }
    );
  }

  private findEndereco(id: string, list: EnderecoDTO[]): EnderecoDTO {
    let position = list.findIndex((x) => x.id == id);
    return list[position];
  }

  total(): number {
    return this.cartService.total();
  }
  checkOut() {
    this.pedidoService.insert(this.pedido).subscribe(
      (response) => {
        this.cartService.createOrClearCart();
        this.codPedido = this.extractId(response.headers.get("location"));
      },
      (error) => {
        if (error.status == 403) {
          this.navCtrl.setRoot("HomePage");
        }
      }
    );
  }
  back() {
    this.navCtrl.setRoot("CartPage");
  }
  home() {
    this.navCtrl.setRoot("CategoriasPage");
  }
  private extractId(location: string): string {
    let position = location.lastIndexOf("/");
    return location.substring(position + 1, location.length);
  }
}
