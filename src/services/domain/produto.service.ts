import { ProdutoDto } from "./../../models/produto.dto";
import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";

@Injectable()
export class ProdutoService {
  constructor(public httpClient: HttpClient) {}

  findById(produto_id: string) {
    return this.httpClient.get<ProdutoDto>(
      `${API_CONFIG.baseUrl}/produtos/${produto_id}`
    );
  }

  findByCategoria(categoria_id: string) {
    return this.httpClient.get(
      `${API_CONFIG.baseUrl}/produtos/?categorias=${categoria_id}`
    );
  }

  getSmallImageFromBucket(id: string): Observable<any> {
    let url = `${API_CONFIG.bucketBaseUrl}/prod${id}-small.jpg`;
    return this.httpClient.get(url, { responseType: "blob" });
  }
  getImageFromBucket(id: string): Observable<any> {
    let url = `${API_CONFIG.bucketBaseUrl}/prod${id}.jpg`;
    return this.httpClient.get(url, { responseType: "blob" });
  }
}
