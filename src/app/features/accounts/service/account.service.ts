import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment-prod';
import {TransactionModel} from '../model/transaction-model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private http = inject(HttpClient);
  private baseB = environment.beUrl + '/bank';
  private baseI = environment.beUrl + '/investment';

  depositToBank(id: number, amount: number) {
    return this.http.post<TransactionModel>(`${this.baseB}/deposit`, {amount});
  }

  withdrawFromBank(id: number, amount: number) {
    return this.http.post<TransactionModel>(`${this.baseB}/withdraw`, {amount});
  }

  depositToInvestment(id: number, amount: number) {
    return this.http.post<TransactionModel>(`${this.baseI}/deposit`, {amount});
  }

  withdrawFromInvestment(id: number, amount: number) {
    return this.http.post<TransactionModel>(`${this.baseI}/withdraw`, {amount});
  }

}
