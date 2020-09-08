import { API_CONFIG } from "./../../config/api.config";
import { ProdutoService } from "./../../services/domain/produto.service";
import { CategoriaService } from "./../../services/domain/categoria.service";
import { ProdutoDto } from "./../../models/produto.dto";
import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
} from "ionic-angular";

/**
 * Generated class for the ProdutosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-produtos",
  templateUrl: "produtos.html",
})
export class ProdutosPage {
  items: ProdutoDto[] = [];
  page: number = 0;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public produtoService: ProdutoService,
    public categoriaService: CategoriaService,
    public loadingCtrl: LoadingController
  ) {}

  ionViewDidLoad() {
    this.loadData();
  }
  loadData() {
    let categoria_id = this.navParams.get("categoria_id");
    let loading = this.presentLoading();
    this.produtoService.findByCategoria(categoria_id, this.page, 10).subscribe(
      (response) => {
        let start = this.items.length;
        this.items = this.items.concat(response["content"]);
        let end = this.items.length - 1;
        loading.dismiss();
        console.log(this.page);
        console.log(this.items);
        this.loadImageUrls(start, end);
      },
      (error) => {
        loading.dismiss();
      }
    );
  }
  loadImageUrls(start: number, end: number) {
    for (var i = start; i <= end; i++) {
      let item = this.items[i];
      this.produtoService.getSmallImageFromBucket(item.id).subscribe(
        (response) => {
          item.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.id}-small.jpg`;
        },
        (error) => {}
      );
    }
  }
  showDetails(produto_id: string) {
    this.navCtrl.push("ProdutoDetailPage", { produto_id: produto_id });
  }
  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: " Favor aguarde ...",
    });
    loader.present();
    return loader;
  }
  doRefresh(refresher) {
    this.page = 0;
    this.items = [];
    this.loadData();
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
  doInfinite(infiniteScroll) {
    this.page++;
    this.loadData();
    setTimeout(() => {
      infiniteScroll.complete();
    }, 1000);
  }
}
