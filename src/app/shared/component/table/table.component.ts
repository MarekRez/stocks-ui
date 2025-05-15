import {Component, input} from '@angular/core';
import {Column} from './model/column.type';
import {DecimalPipe} from '@angular/common';

@Component({
  selector: 'app-table',
  imports: [
    DecimalPipe
  ],
  templateUrl: './table.component.html'
})
export class TableComponent<T> {
  columns = input.required<Column<T>[]>();
  rows = input.required<T[]>();
  protected readonly Number = Number;
}
