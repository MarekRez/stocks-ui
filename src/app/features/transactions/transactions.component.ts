import {Component, computed, inject, signal} from '@angular/core';
import {TableComponent} from '../../shared/component/table/table.component';
import {TransactionService} from './service/transaction.service';
import {TransactionModel} from './model/transaction-model';
import {TransactionViewHelper} from './model/transactionView-helper';
import {Column} from '../../shared/component/table/model/column.type';

@Component({
  selector: 'app-transactions',
  imports: [
    TableComponent
  ],
  templateUrl: './transactions.component.html'
})
export class TransactionsComponent {

  private transactionsApi = inject(TransactionService);

  transactions = signal<TransactionModel[]>([]);
  isLoading  = signal(true);

  pageSize    = signal(12);
  currentPage = signal(1);

  /** flat, display-ready view model */
  transactionView = computed<TransactionViewHelper[]>(() =>
    this.transactions().map(tx => ({
      id:          tx.id!,
      type:        tx.type!,
      amount:      tx.amount!,
      timestamp:   new Date(tx.timestamp!).toLocaleString(),
      stockSymbol: tx.stock?.symbol || '—'
    }))
  );

  /** slice out just the current page */
  pagedTransactions = computed(() => {
    const all = this.transactionView();
    const size = this.pageSize();
    const start = (this.currentPage() - 1) * size;
    return all.slice(start, start + size);
  });

  /** how many pages total? */
  totalPages = computed(() => {
    const total = this.transactionView().length;
    return Math.max(1, Math.ceil(total / this.pageSize()));
  });

  cols: Column<TransactionViewHelper>[] = [
    { label: 'ID',         attribute: 'id' },
    { label: 'Type',       attribute: 'type' },
    { label: 'Amount',     attribute: 'amount' },
    { label: 'Time',       attribute: 'timestamp' },
    { label: 'Stock',      attribute: 'stockSymbol' },
  ];

  constructor() {
    this.load();
  }

  private load() {
    this.isLoading.set(true);
    this.transactionsApi.listTransactions()
      .subscribe(list => this.transactions.set(list || []));
    this.isLoading.set(false);
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(n => n + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(n => n - 1);
    }
  }

}
