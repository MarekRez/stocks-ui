import {Component, computed, inject, signal, effect} from '@angular/core';
import {AbstractControl, FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ClientCreateEditService} from './service/client-create-edit.service';
import {ClientModel} from '../../core/model/client-type';
import {ClientListService} from '../client-list/service/client-list.service';
import {toSignal} from '@angular/core/rxjs-interop';
import {catchError, finalize, map, of, take} from 'rxjs';

@Component({
  selector: 'app-add-client',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './add-client.component.html'
})
export class AddClientComponent {
  private fb = inject(FormBuilder);
  private api = inject(ClientCreateEditService);
  private listApi = inject(ClientListService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Route ID signal (null = create mode; number = edit mode)
  private idSignal = toSignal(
    this.route.paramMap.pipe(map(pm => pm.get('id') ? Number(pm.get('id')) : null)),
    {initialValue: null}
  );

  isEdit = computed(() => this.idSignal() !== null);

  isLoading = signal(false);
  isSending = signal(false);
  error = signal<string | null>(null);

  // holds the fetched client when editing
  client = signal<ClientModel | null>(null);

  // fetch client if in edit mode
  constructor() {
    effect(() => {
      const id = this.idSignal();
      if (id !== null) {
        this.isLoading.set(true);
        this.api.getClientById(id).pipe(
          catchError(err => {
            this.error.set('Failed to load client');
            return of(null);
          }),
          finalize(() => this.isLoading.set(false))
        ).subscribe(c => this.client.set(c));
      } else {
        this.client.set(null);
      }
    });

  // Patch the form with the client data when available
    effect(() => {
      const c = this.client();
      if (c) {
        this.form.patchValue({
          username: c.username,
          email: c.email,
          role: c.role,
          bankAccountBalance: c.bankAccountBalance
        });
      }
    })
  }

  // Build the reactive form
  form = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email], [this.emailTakenValidator.bind(this)]],
    role: ['', Validators.required],
    bankAccountBalance: [10000, Validators.required],
  });

  // Async validator for email uniqueness
  private emailTakenValidator(ctrl: AbstractControl) {
    const val = ctrl.value as string;
    return this.listApi.getAllClients().pipe(
      map(list =>
        list.some(u => u.email === val && (!this.isEdit() || u.id !== this.idSignal()))
          ? { emailTaken: true }
          : null
      ),
      take(1)
    );
  }

// Submit
  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: ClientModel = {
      id:                   this.idSignal() ?? undefined,
      username:                 this.form.value.username!,
      email:                this.form.value.email!,
      role:                 this.form.value.role!,
      bankAccountBalance:   this.form.value.bankAccountBalance!,
      investmentAccountBalance: 0,
    };

    this.isSending.set(true);
    const call = this.isEdit()
      ? this.api.updateClient(payload)
      : this.api.createClient(payload);

    call.pipe(finalize(() => this.isSending.set(false)))
      .subscribe(() => this.router.navigate(['/client-list']));
  }

}
