import { Routes } from '@angular/router';
import {canActivateHome} from './core/service/user.service';

export const routes: Routes = [
  { path: 'home', loadComponent: () => import('./features/home/home.component').
    then(m => m.HomeComponent),
  },
  { path: 'client-list', loadComponent: () => import('./features/client-list/client-list.component').
    then(m => m.ClientListComponent),
    canActivate:[canActivateHome]
  },
  { path: 'add-client', loadComponent: () => import('./features/add-client/add-client.component').
    then(m => m.AddClientComponent)
  },
  { path: 'accounts', loadComponent: () => import('./features/accounts/accounts.component').
    then(m => m.AccountsComponent)
  },
  { path: 'portfolio', loadComponent: () => import('./features/portfolio/portfolio.component').
    then(m => m.PortfolioComponent)
  },
  { path: 'investing', loadComponent: () => import('./features/invest/invest.component').
    then(m => m.InvestComponent)
  },
  { path: 'create-stock', loadComponent: () => import('./features/create-stock/create-stock.component').
    then(m => m.CreateStockComponent)
  },
  { path: '', redirectTo: 'home', pathMatch: 'full'
  },
  { path: '**', loadComponent: () => import('./features/not-found/not-found.component').
    then(m => m.NotFoundComponent)
  }
];
