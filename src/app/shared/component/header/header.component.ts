import { Component } from '@angular/core';
import {MENU_ITEMS} from '../../../core/configuration/menu.cofig';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    NgOptimizedImage
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  brand = 'StocksByMarek';
  menuItems = MENU_ITEMS;

}
