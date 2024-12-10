import { Routes } from '@angular/router';

import { MapboardComponent } from './pages/mapboard/mapboard.component';

export const routes: Routes = [
  { path: '', component: MapboardComponent },
  { path: 'harta', redirectTo: '' },
  {
    path: 'sugestie-locatie',
    loadComponent: () =>
      import('./pages/suggest-location/suggest-location.component').then(
        (c) => c.SuggestLocationComponent,
      ),
  },
];
