import {Component, input} from '@angular/core';
import {Column} from './model/column.type';

@Component({
  selector: 'app-table',
  imports: [],
  templateUrl: './table.component.html'
})
export class TableComponent<T> {
  columns = input.required<Column<T>[]>();
  rows = input.required<T[]>();
}
