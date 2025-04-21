import {Component, computed, inject, signal, effect} from '@angular/core';
import {AbstractControl, FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {ClientCreateEditService} from './service/client-create-edit.service';
import {ClientModel} from '../../core/model/client-type';
import {ClientListApiService} from '../client-list/service/client-list-api.service';
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
  private listApi = inject(ClientListApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // 1) Route ID signal (null = create mode; number = edit mode)
  private idSignal = toSignal(
    this.route.paramMap.pipe(map(pm => pm.get('id') ? Number(pm.get('id')) : null)),
    {initialValue: null}
  );
  isEdit = computed(() => this.idSignal() !== null);

  // 2) Loading & error signals for the “fetch existing client” step
  isLoading = signal(false);
  error = signal<string | null>(null);

  // 3) Client signal: holds the fetched client when editing
  client = signal<ClientModel | null>(null);

  // 4) Kick off a fetch if in edit mode
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

    effect(() => {
      const c = this.client();
      if (c) {
        this.form.patchValue({
          name: c.name,
          email: c.email,
          role: c.role
        });
      }
    })
  }

  // 5) Build the reactive form, patching in the client’s data when available
  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email], [this.emailTakenValidator.bind(this)]],
    role: ['', Validators.required]
  });

  // 6) Async validator for email uniqueness
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

// 7) Sending flag for the create/update call
  isSending = signal(false);

// 8) Submit handler
  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: ClientModel = {
      id:               this.idSignal() ?? undefined,
      name:             this.form.value.name!,
      email:            this.form.value.email!,
      role:             this.form.value.role!,
    };

    this.isSending.set(true);
    const call = this.isEdit()
      ? this.api.updateClient(payload)
      : this.api.createClient(payload);

    call.pipe(finalize(() => this.isSending.set(false)))
      .subscribe(() => this.router.navigate(['/client-list']));
  }

}
