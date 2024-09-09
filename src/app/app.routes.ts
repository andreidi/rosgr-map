import { Routes } from '@angular/router';

import { MapboardComponent } from './mapboard/mapboard.component';
import { SuggestLocationComponent } from './suggest-location/suggest-location.component';

export const routes: Routes = [
  { path: '', component: MapboardComponent },
  { path: 'harta', redirectTo: '' },
  { path: 'sugestie-locatie', component: SuggestLocationComponent },
];
