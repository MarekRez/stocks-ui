import {Component, effect, inject, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AccountService} from './service/account.service';
import {UserService} from '../../core/service/user.service';
import {ClientListApiService} from '../client-list/service/client-list-api.service';
import {ClientModel} from '../../core/model/client-type';
import {finalize} from 'rxjs';

@Component({
  selector: 'app-accounts',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './accounts.component.html'
})
export class AccountsComponent {

  private userService   = inject(UserService);
  private clientApi     = inject(ClientListApiService);
  private accountService = inject(AccountService);
  private formBuilder = inject(FormBuilder);

  /** The Keycloak identity claims signal */
  user = this.userService.getUserSignal();

  /** The real backend user record & loading flag */
  backendUser     = signal<ClientModel|null>(null);
  isLoadingUser   = signal(false);
  backendUserError= signal<string|null>(null);

  /** Signals for loading / success / error */
  isBankLoading   = signal(false);
  bankError       = signal<string|null>(null);
  bankSuccess     = signal<string|null>(null);

  isInvestLoading = signal(false);
  investError     = signal<string|null>(null);
  investSuccess   = signal<string|null>(null);

  constructor() {
    // Whenever Keycloak user changes, fetch the backend user by email:
    effect(() => {
      const u = this.user();
      if (!u?.email) {
        this.backendUser.set(null);
        return;
      }
      this.isLoadingUser.set(true);
      this.clientApi.getClientByEmail(u.email).pipe(
        finalize(() => this.isLoadingUser.set(false))
      ).subscribe({
        next: bu => this.backendUser.set(bu),
        error: ()  => this.backendUserError.set('Could not load account info')
      });
    });
  }

  bankAccountForm = this.formBuilder.group({
    amount: [0, [Validators.required, Validators.min(1)]]
  });

  investmentAccountForm = this.formBuilder.group({
    amount: [0, [Validators.required, Validators.min(1)]]
  });

  depositToBank(): void {
    if (this.bankAccountForm.invalid) {
      this.bankError.set('Zadajte platnú sumu.');
      return;
    }

    this.bankError.set(null);
    this.bankSuccess.set(null);

    const bu = this.backendUser();
    if (!bu?.id) return;
    const amount = this.bankAccountForm.value.amount!;

    this.isBankLoading.set(true);

    this.accountService.depositToBank(bu.id, amount).pipe(
      finalize(() => this.isBankLoading.set(false))
    ).subscribe({
      next: tx => {
        this.bankSuccess.set(`Vklad €${amount} prebehol úspešne.`);
        this.bankAccountForm.reset({ amount: 0 });
      },
      error: err => {
        this.bankError.set('Vklad sa nepodaril.');
      }
    });
  }

  withdrawFromBank(): void {
    if (this.bankAccountForm.invalid) return;

    const bu = this.backendUser();
    if (!bu?.id) return;
    const amount = this.bankAccountForm.get('amount')!.value as number;

    this.isBankLoading.set(true);
    this.bankError.set(null);
    this.bankSuccess.set(null);

    this.accountService.withdrawFromBank(bu.id, amount).pipe(
      finalize(() => this.isBankLoading.set(false))
    ).subscribe({
      next: tx => {this.bankSuccess.set(`Výber €${amount} prebehol úspešne.`);
      this.bankAccountForm.reset();
      },
      error: err => this.bankError.set('Výber sa nepodaril.')
    });
  }

  depositToInvestment(): void {
    if (this.investmentAccountForm.invalid) return;

    const bu = this.backendUser();
    if (!bu?.id) return;
    const amount = this.investmentAccountForm.get('amount')!.value as number;

    this.isInvestLoading.set(true);
    this.investError.set(null);
    this.investSuccess.set(null);

    this.accountService.depositToInvestment(bu.id, amount).pipe(
      finalize(() => this.isInvestLoading.set(false))
    ).subscribe({
      next: tx => {this.investSuccess.set(`Vklad €${amount} prebehol úspešne.`)
      this.investmentAccountForm.reset();
        },
      error: err => {
        const msg = err.error?.message || 'Výber sa nepodaril';
        this.investError.set(msg);
      }
    });
  }

  withdrawFromInvestment(): void {
    if (this.investmentAccountForm.invalid) return;

    const bu = this.backendUser();
    if (!bu?.id) return;
    const amount = this.investmentAccountForm.get('amount')!.value as number;

    this.isInvestLoading.set(true);
    this.investError.set(null);
    this.investSuccess.set(null);

    this.accountService.withdrawFromInvestment(bu.id, amount).pipe(
      finalize(() => this.isInvestLoading.set(false))
    ).subscribe({
      next: tx => {this.investSuccess.set(`Výber €${amount} prebehol úspešne.`)
        this.investmentAccountForm.reset();
      },
      error: err => this.investError.set('Výber sa nepodaril.')
    });
  }
}
