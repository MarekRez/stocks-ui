import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'home', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },

  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: '**', loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent) }
];
