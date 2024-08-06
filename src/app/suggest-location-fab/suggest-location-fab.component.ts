import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { NEW_LOCATION_FORM_URL } from '../../utils/constants';

@Component({
  selector: 'app-suggest-location-fab',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './suggest-location-fab.component.html',
  styleUrl: './suggest-location-fab.component.scss'
})

export class SuggestLocationFABComponent {
  newLocationFormURL = NEW_LOCATION_FORM_URL;
}
