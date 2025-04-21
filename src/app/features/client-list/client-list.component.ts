import {Component, computed, effect, inject, OnInit, signal} from '@angular/core';
import {TableComponent} from '../../shared/component/table/table.component';
import {FormsModule} from '@angular/forms';
import {Column} from '../../shared/component/table/model/column.type';
import {ClientModel} from '../../core/model/client-type';
import {ClientListApiService} from './service/client-list-api.service';
import {catchError, finalize, of} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-client-list',
  imports: [
    TableComponent,
    FormsModule
  ],
  templateUrl: './client-list.component.html'
})
export class ClientListComponent {

  private router = inject(Router);
  private api = inject(ClientListApiService);

  clients    = signal<ClientModel[]|undefined>(undefined);

  error = signal<string | null>(null);
  // Loading computed: true if still `undefined`
  isLoading  = signal(true);
  isDeleting = signal(false);

  constructor() {
    // one‐time load effect
    effect(() => {
      this.isLoading.set(true);
      this.api.getAllClients().pipe(
        catchError(err => {
          console.error(err);
          this.error.set('Failed to load clients');
          return of([] as ClientModel[]);
        }),
        finalize(() => this.isLoading.set(false))
      ).subscribe(data => {
        this.clients.set(data);
      });
    });
  }
  // Search term signal
  search = signal('');
  filteredClients = computed(() => {
    const list = this.clients();
    if (!list || list.length === 0) return [];
    const term = this.search().trim().toLowerCase();
    return term
      ? list.filter(c => c.email.toLowerCase().includes(term))
      : list;
  });

  // Table columns
  clientsColumns: Column<ClientModel>[] = [
    { label: 'Meno',                 attribute: 'name' },
    { label: 'Email',                attribute: 'email' },
    { label: 'Role',                attribute: 'role' },
    { label: 'IBAN',                 attribute: 'iban' },
    { label: 'Bankový Zostatok',     attribute: 'bankAccountBalance' },
    { label: 'Investičný Zostatok',  attribute: 'investmentAccountBalance' },
    { label: 'Akcie',  text: 'Upraviť',   onClick: client => this.editClient(client) },
    { label: '',       text: 'Odstrániť', onClick: client => this.deleteClient(client) },
  ];

  deleteClient(client: ClientModel) {
    if (!confirm(`Prajete si zmazať klienta ${client.name}?`)) {
      return;
    }
    this.isDeleting.set(true);

    this.api.deleteClient(<number>client.id)
      .pipe(finalize(() => this.isDeleting.set(false)))
      .subscribe({
        next: () => {
          // Remove the client from the list so the UI updates
          const remaining = (this.clients() || []).filter(c => c.id !== client.id);
          this.clients.set(remaining);
          console.log("Deleted client", client);
          },
        error: err => {
          console.error(err);
          this.error.set('Failed to delete client');
        }
      });
  }

  private editClient(client: ClientModel) {
    this.router.navigate(['edit-client', client.id]).then();
    console.log('Edit', client);
  }

}
