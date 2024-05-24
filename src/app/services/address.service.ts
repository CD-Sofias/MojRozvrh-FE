import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Address} from "../types/address";

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  url = environment.backendUrl + '/addresses';

  constructor(private http: HttpClient) {
  }

  getAllAddress() {
    return this.http.get<Address[]>(this.url)
  }

  getAddressById(id: string) {
    return this.http.get<Address>(`${this.url}/${id}`)
  }

  updateAddress(address: Address) {
    return this.http.put<Address>(`${this.url}/${address.id}`, address)
  }

  createAddress(address: Address) {
    return this.http.post<Address>(this.url, address)
  }

  deleteAddress(id: string) {
    return this.http.delete(`${this.url}/${id}`)
  }
}
