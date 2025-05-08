import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment.prod';
import {StockHoldingModel} from '../model/stockHolding-model';

@Injectable({
  providedIn: 'root'
})
export class InvestService {

  private http = inject(HttpClient);
  private base = environment.beUrl + '/investment';

  buyInvestment(investment: { symbol: string; amount: number }) {
    return this.http.post<any>(this.base + '/buy', investment);
  }

  sellInvestment(investment: { symbol: string; shares: number }) {
    return this.http.post<any>(this.base + '/sell', investment);
  }

  getPortfolio() {
    return this.http.get<StockHoldingModel[]>(this.base + '/holdings');
  }

}
