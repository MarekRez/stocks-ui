import {Component, inject} from '@angular/core';
import {TableComponent} from '../../shared/component/table/table.component';
import {FormBuilder} from '@angular/forms';
import {Column} from '../../shared/component/table/model/column.type';
import {Client} from './model/client-type';

@Component({
  selector: 'app-client-list',
  imports: [
    TableComponent
  ],
  templateUrl: './client-list.component.html'
})
export class ClientListComponent {

  private formBuilder = inject(FormBuilder); // kvoli modalu
  // private clientService = inject(ApiClientsService);

  isLoading: boolean = false;
  isDeleting: boolean = false;

  clients: Client[] = [];
  // filteredClients: Client[] = [];
  search: string = '';
  clientsColumns: Column<Client>[] = [
    { label: 'Meno', attribute: 'name' },
    { label: 'Email', attribute: 'email' },
    { label: 'IBAN', attribute: 'iban' },
    { label: 'Bankový Zostatok', attribute: 'bankAccountBalance' },
    { label: 'Investičný Zostatok', attribute: 'investmentAccountBalance' },
    { label: 'Akcie:', text: 'Upraviť', onClick: (client: Client) => this.editClient(client)},
    { label: '', text: 'Odstrániť', onClick: (client: Client) => this.deleteClient(client)},
  ]

  private editClient(client: Client) {

  }

  private deleteClient(client: Client) {

  }
}
