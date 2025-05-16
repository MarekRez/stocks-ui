import {Component, inject, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {StockService} from './service/stock.service';
import {StockModel} from './model/stock-model';
import {finalize} from 'rxjs';
import {StockSymbol} from './model/stockSymbol-enum';

@Component({
  selector: 'app-create-stock',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './create-stock.component.html'
})
export class CreateStockComponent {

  private formBuilder = inject(FormBuilder);
  private stockService = inject(StockService);

// Signals for loading / success / error
  isSending = signal(false);
  success   = signal<string|null>(null);
  error     = signal<string|null>(null);

  // Turn the TS enum into an array of strings:
  symbols = Object.values(StockSymbol) as StockSymbol[];

  stockForm: FormGroup = this.formBuilder.group({
    symbol: ['AAPL', Validators.required],
    currency: ['EUR', Validators.required],
    currentPrice: [250, [Validators.required]],
    volatility: [0.80, [Validators.min(0), Validators.max(1)]],
    dividendYield: [0.03, [Validators.min(0), Validators.max(1)]],
    expectedReturn: [0.4206, [Validators.min(0), Validators.max(1)]],
  },{ updateOn: 'blur' });

  createStock() {
    if (this.stockForm.invalid) {
      // mark touched so inline errors display
      this.stockForm.markAllAsTouched();
      this.error.set('Please fix the errors in the form.');
      return;
    }

    this.error.set(null);
    this.success.set(null);
    this.isSending.set(true);

    const payload: StockModel = {
      ...this.stockForm.value // hopefully this works
    };

    this.stockService.createStock(payload).pipe(
      finalize(() => this.isSending.set(false))
    ).subscribe({
      next: stock => {
        this.success.set(`Stock ${stock.symbol} created successfully!`);
        this.stockForm.reset({
          symbol: 'GOOGL', currency: 'USD', currentPrice: 500, volatility: 0.80, dividendYield: 0.03, expectedReturn: 0.4206
        });
      },
      error: err => {
        this.error.set(err.error?.message || 'Failed to create stock.');
      }
    });
  }

}
