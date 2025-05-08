import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment.prod';
import {ClientModel} from '../../../core/model/client-type';

@Injectable({
  providedIn: 'root'
})
export class ClientListService {

  private http = inject(HttpClient);
  private base = environment.beUrl + '/users';

  getAllClients() {
    return this.http.get<ClientModel[]>(this.base);
  }

  deleteClient(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  getClientByEmail(email: string) {
    return this.http.get<ClientModel>(`${this.base}/by-email/${encodeURIComponent(email)}`);
  }

}
