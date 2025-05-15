import {CanMatchFn, Routes, UrlSegment} from '@angular/router';
import {canActivate} from './core/service/user.service';

export const routeHasIdAsInteger: CanMatchFn = (_, segments: UrlSegment[]) => {
  const idParam = segments[0];
  const id = Number(idParam);
  return !isNaN(id) && Number.isInteger(id);
}

export const routeHasActiveChildren: CanMatchFn = (_, segments: UrlSegment[]) => {
  return segments.length > 1;
}

export const routes: Routes = [
  {
    path: 'home', loadComponent: () => import('./features/home/home.component')
      .then(m => m.HomeComponent),
  },
  {
    path: 'client-list',
    loadComponent: () => import('./features/client-list/client-list.component')
      .then(m => m.ClientListComponent),
    canActivate: [canActivate]
  },
  {
    path: 'add-client',
    loadComponent: () => import('./features/add-client/add-client.component')
      .then(m => m.AddClientComponent),
    canActivate: [canActivate]
  },
  {
    path: 'edit-client',
    canMatch: [routeHasActiveChildren],
    children: [
      {
        path: ':id',
        canMatch: [routeHasIdAsInteger],
        loadComponent: () => import('./features/add-client/add-client.component')
          .then(m => m.AddClientComponent),
      }
    ]
  },
  {
    path: 'accounts',
    loadComponent: () => import('./features/accounts/accounts.component')
      .then(m => m.AccountsComponent),
    canActivate: [canActivate]
  },
  {
    path: 'portfolio',
    loadComponent: () => import('./features/portfolio/portfolio.component')
      .then(m => m.PortfolioComponent)
  },
  {
    path: 'investing', loadComponent: () => import('./features/invest/invest.component')
      .then(m => m.InvestComponent)
  },
  {
    path: 'create-stock',
    loadComponent: () => import('./features/create-stock/create-stock.component')
      .then(m => m.CreateStockComponent)
  },
  {
    path: 'transactions',
    loadComponent: () => import('./features/transactions/transactions.component')
      .then(m => m.TransactionsComponent),
    canActivate: [canActivate]
  },
  {
    path: '', redirectTo: 'home', pathMatch: 'full'
  },
  {
    path: '**', loadComponent: () => import('./features/not-found/not-found.component')
      .then(m => m.NotFoundComponent)
  },

];
