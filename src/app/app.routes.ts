import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'register-person',
    loadComponent: () => import('./pages/register-person/register-person.page').then((m) => m.RegisterPersonPage),
  },
  {
  path: 'personas-registradas',
  loadComponent: () =>
    import('./pages/personas-registradas/personas-registradas.page')
      .then(m => m.PersonasRegistradasPage)
  },
  {
    path: 'personas-registradas',
    loadComponent: () =>
      import('./pages/personas-registradas/personas-registradas.page').then((m) => m.PersonasRegistradasPage),
  },
];
