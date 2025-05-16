import {Component, computed, inject, signal} from '@angular/core';
import {NgClass} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {TableComponent} from '../../shared/component/table/table.component';
import {Column} from '../../shared/component/table/model/column.type';
import {HoldingViewHelper} from '../invest/model/holdingView-helper';
import {SimulationModel} from './model/simulation-model';
import {SimulationService} from './service/simulation.service';
import {finalize} from 'rxjs';
import {StockHoldingModel} from '../invest/model/stockHolding-model';
import {UserService} from '../../core/service/user.service';
import {ClientListService} from '../client-list/service/client-list.service';
import {InvestService} from '../invest/service/invest.service';

@Component({
  selector: 'app-portfolio',
  imports: [
    NgClass,
    ReactiveFormsModule,
    TableComponent
  ],
  templateUrl: './portfolio.component.html'
})
export class PortfolioComponent {
  private fb         = inject(FormBuilder);
  private simulationSvc  = inject(SimulationService);
  private userSvc    = inject(UserService);
  private userApi    = inject(ClientListService);
  private investApi  = inject(InvestService);


  holdings  = signal<StockHoldingModel[]>([]);

  private loadHoldings() {
    // first look up the backend user by email
    const email = this.userSvc.getUserSignal()()?.email;
    if (!email) return;
    this.userApi.getClientByEmail(email).subscribe(user => {
      this.investApi.getPortfolio()
        .subscribe(p => this.holdings.set(p));
    });
  }

  constructor() {
    this.loadHoldings();
  }

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
    { label: '"Shares"',    attribute: 'sharesOwned' },
    { label: 'Celková hodnota',   attribute: 'totalValue' }
  ];

  simForm    = this.fb.group({
    months: [1, [Validators.required, Validators.min(1)]]
  });

  isLoading  = signal(false);
  errorMsg   = signal<string|null>(null);

  result     = signal<SimulationModel|null>(null);

  onSubmit() {
    if (this.simForm.invalid) {
      this.simForm.markAllAsTouched();
      return;
    }
    const months = this.simForm.value.months!;
    this.isLoading.set(true);
    this.errorMsg.set(null);
    this.result.set(null);

    this.simulationSvc.simulatePortfolio(months).pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: r => this.result.set(r),
      error: e => this.errorMsg.set(e.error?.message || 'Simulation failed')
    })
    this.loadHoldings();
  }

}
