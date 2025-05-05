import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {StockService} from './service/stock.service';

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

  stockForm: FormGroup = this.formBuilder.group({
    symbol: ['', Validators.required],
    currency: ['EUR', Validators.required],
    stockPrice: [1, [Validators.required]],
    volatility: [0, [Validators.min(0), Validators.max(1)]],
    dividendYield: [0, [Validators.min(0), Validators.max(1)]],
    expectedReturn: [0, [Validators.min(0), Validators.max(1)]],
  });

  createStock(): void {
    if (this.stockForm.valid) {
      const stockData = this.stockForm.value;
      this.stockForm.reset({
          stockSymbol: '',
          currency: 'EUR',
          stockPrice: '',
          dividendYield: this.stockForm.value.dividendYield,
          volatility: this.stockForm.value.volatility,
          expectedReturn: this.stockForm.value.expectedReturn,
        }
      );
      this.stockService.createStock(stockData).subscribe({
        next: () => {
          console.log('Stock created successfully');
        },
        error: (err) => console.error('Error creating stock', err),
      });
    }
  }

}
