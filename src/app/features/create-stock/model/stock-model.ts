export interface StockModel {

  id?: number;
  symbol: string;
  currency: string;
  currentPrice: number;
  volatility: number;
  dividendYield: number;
  expectedReturn: number;
}
