import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { NEW_LOCATION_FORM_URL } from '@shared/utils/constants';

@Component({
  selector: 'app-suggest-location-fab',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './suggest-location-fab.component.html',
  styleUrl: './suggest-location-fab.component.scss',
})
export class SuggestLocationFABComponent {
  locationSuggestionURL = NEW_LOCATION_FORM_URL;
}
