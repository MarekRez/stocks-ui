import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment-dev';
import {ClientModel} from '../model/client-type';

@Injectable({
  providedIn: 'root'
})
export class ClientListApiService {

  private http = inject(HttpClient);
  private base = environment.Url + '/users';

  getAllClients() {
    return this.http.get<ClientModel[]>(this.base);
  }

  deleteClient(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

}
