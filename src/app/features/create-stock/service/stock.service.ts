import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment.prod';
import {StockModel} from '../model/stock-model';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private http = inject(HttpClient);
  private base = environment.beUrl + '/stocks';

  createStock(stock: StockModel) {
    return this.http.post<StockModel>(this.base, stock);
  }

  listStocks() {
    return this.http.get<StockModel[]>(this.base);
  }

}

