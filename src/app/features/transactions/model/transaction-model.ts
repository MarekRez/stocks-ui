import {ClientModel} from '../../../core/model/client-type';
import {StockModel} from '../../create-stock/model/stock-model';
import {TransactionTypeEnum} from './transaction-type-enum';

export interface TransactionModel {
  id: number;
  type: TransactionTypeEnum;
  amount: number;
  timestamp: string;
  user: ClientModel;
  stock?: StockModel;
}
