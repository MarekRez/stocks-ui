export interface TransactionViewHelper {
  id:         number;
  type:       string;
  amount:     number;
  timestamp:  string;    // formatted date/time
  stockSymbol: string;
}
