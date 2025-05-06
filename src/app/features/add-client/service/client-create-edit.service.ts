import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment-prod';
import {ClientModel} from '../../../core/model/client-type';

@Injectable({
  providedIn: 'root'
})
export class ClientCreateEditService {

  private http = inject(HttpClient);
  private base = environment.beUrl + '/users';

  createClient(client: ClientModel) {
    return this.http.post<ClientModel>(this.base, client);
  }

  //fixme: this resets the investment account balance to 0
  updateClient(client: ClientModel) {
    return this.http.put<ClientModel>(`${this.base}/${client.id}`, client);
  }

  getClientById(id: number) {
    return this.http.get<ClientModel>(`${this.base}/${id}`);
  }

}
