import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment.prod';
import {TransactionModel} from '../model/transaction-model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private http = inject(HttpClient);
  private base = environment.beUrl + '/transactions';

  listTransactions() {
    return this.http.get<TransactionModel[]>(this.base);
  }
}
