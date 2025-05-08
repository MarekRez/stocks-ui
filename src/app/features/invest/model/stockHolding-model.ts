import {StockModel} from '../../create-stock/model/stock-model';

export interface StockHoldingModel {
  stock: StockModel;
  sharesOwned: number;
}
