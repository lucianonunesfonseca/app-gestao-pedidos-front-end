import { StorageService } from "./../storage.service";
import { API_CONFIG } from "./../../config/api.config";
import { ClienteDTO } from "./../../models/cliente.dto";
import { Observable } from "rxjs/Rx";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class ClienteService {
  constructor(public httpClient: HttpClient, public storage: StorageService) {}
  findByEmail(email: string) {
    return this.httpClient.get(
      `${API_CONFIG.baseUrl}/clientes/email?value=${email}`
    );
  }
  getImageFromBucket(id: string): Observable<any> {
    let url = `${API_CONFIG.bucketBaseUrl}/cp${id}.jpg`;
    return this.httpClient.get(url, { responseType: "blob" });
  }
  insert(obj: ClienteDTO) {
    return this.httpClient.post(`${API_CONFIG.baseUrl}/clientes`, obj, {
      observe: "response",
      responseType: "text",
    });
  }
}
