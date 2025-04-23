import {Component, inject} from '@angular/core';
import {MENU_ITEMS} from '../../../core/configuration/menu-cofig';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';
import {UserService} from '../../../core/service/user.service';
import {NgbDropdown, NgbDropdownMenu, NgbDropdownToggle} from '@ng-bootstrap/ng-bootstrap';
import {ThemeService} from '../../../core/service/theme.service';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    NgOptimizedImage,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  brand = 'StocksByMarek';
  menuItems = MENU_ITEMS;

  userService = inject(UserService);
  themeService = inject(ThemeService);

  user = this.userService.getUserSignal();

  login() {
    this.userService.login();
  }

  logout() {
    this.userService.logout();
  }

}
