import {Component, computed, inject, signal} from '@angular/core';
import { StockService } from '../create-stock/service/stock.service';
import { ClientListService } from '../client-list/service/client-list.service';
import { UserService } from '../../core/service/user.service';
import { finalize } from 'rxjs';
import {StockModel} from '../create-stock/model/stock-model';
import {StockHoldingModel} from './model/stockHolding-model';
import {Column} from '../../shared/component/table/model/column.type';
import {TableComponent} from '../../shared/component/table/table.component';
import {HoldingViewHelper} from './model/holdingView-helper';
import {InvestService} from './service/invest.service';

@Component({
  selector: 'app-invest',
  imports: [
    TableComponent
  ],
  templateUrl: './invest.component.html'
})
export class InvestComponent {
  private stockApi   = inject(StockService);
  private investApi  = inject(InvestService);
  private userApi    = inject(ClientListService);
  private userSvc    = inject(UserService);

  /** raw signals */
  stocks    = signal<StockModel[]>([]);
  holdings  = signal<StockHoldingModel[]>([]);

  /** transaction state */
  isTxLoading = signal(true);
  txError     = signal<string|null>(null);
  txSuccess   = signal<string|null>(null);

  /** fetch both lists */
  private loadAll() {
    this.stockApi.listStocks()
      .subscribe(list => this.stocks.set(list));

    // first look up the backend user by email
    const email = this.userSvc.getUserSignal()()?.email;
    if (!email) return;
    this.userApi.getClientByEmail(email).subscribe(user => {
      this.investApi.getPortfolio()
        .subscribe(p => this.holdings.set(p));
    });
  }

  constructor() {
    this.loadAll();
    this.isTxLoading.set(false);
  }

  /** ask quantity via prompt */
  private promptQty(symbol: string): number|null {
    const raw = window.prompt(`How many shares of ${symbol}?`, '1');
    const n   = parseFloat(raw||'');
    return isFinite(n) && n > 0 ? n : null;
  }

  /** generic runner for buy/sell */
  private runTx(
    call: () => any,
    successMsg: string
  ) {
    this.isTxLoading.set(true);
    this.txError.set(null);
    this.txSuccess.set(null);

    call().pipe(finalize(() => this.isTxLoading.set(false)))
      .subscribe({
        next: () => {
          this.txSuccess.set(successMsg);
          this.loadAll();
        },
        error: (err: { error: { message: any; }; }) => {
          this.txError.set(err.error?.message || 'Transaction failed');
        }
      });
  }

  /** buy shares of a stock */
  onBuy(stock: StockModel) {
    const qty = this.promptQty(stock.symbol);
    if (qty === null) {
      this.txError.set('Cancelled or invalid quantity');
      return;
    }
    const amount = qty * stock.currentPrice;
    this.runTx(
      () => this.investApi.buyInvestment({ symbol: stock.symbol, amount }),
      `Bought ${qty}×${stock.symbol} for €${amount.toFixed(2)}`
    );
  }

  /** sell by holding */
  onSellHolding(h: HoldingViewHelper) {
    const qty = this.promptQty(h.symbol);
    if (qty === null || qty > h.sharesOwned) {
      this.txError.set('Cancelled or too many shares to sell');
      return;
    }
    this.runTx(
      () => this.investApi.sellInvestment({ symbol: h.symbol, shares: qty }),
      `Sold ${qty}×${h.symbol}`
    );
  }

  stockCols: Column<StockModel>[] = [
    { label: 'Akcia',       attribute: 'symbol' },
    { label: 'Cena',        attribute: 'currentPrice' },
    { label: 'Kúpiť', width: '100px',   text: 'Kúpiť',  onClick: s => this.onBuy(s)
    }
  ];

  // toto potrebujem, lebo moj table component momentalne necita nested properties
  holdingsView = computed<HoldingViewHelper[]>(() =>
    this.holdings().map(h => ({
      symbol:     h.stock.symbol,
      sharesOwned:     +h.sharesOwned,
      totalValue: +(h.stock.currentPrice * h.sharesOwned) // I use + to convert to number
    }))
  );
  //

  holdingCols: Column<HoldingViewHelper>[] = [
    { label: 'Akcia',     attribute: 'symbol' },
    { label: '"Shares"',     attribute: 'sharesOwned' },
    { label: 'Celková hodnota',      attribute: 'totalValue' },
    { label: 'Predať', width: '100px', text: 'Predať', onClick: h => this.onSellHolding(h) }
  ];

}
