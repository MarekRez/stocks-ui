import {ClientModel} from '../../../core/model/client-type';

export interface TransactionModel {
  id: number;
  type: string;
  amount: number;
  timestamp: string;
  user: ClientModel;
  stock?: string; // Optional, only for stock transactions
}
