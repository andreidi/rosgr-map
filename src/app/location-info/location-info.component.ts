import { Component, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ISGRLocation } from '../../types/location';
import { BASE_GMAPS_URL } from '../../utils/constants';
import { LocationScheduleComponent } from '../location-schedule/location-schedule.component';

const LOCATION_CHANGES_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeyL2ktD-liSX6xDRI44ZO3TWdQJMajpkltliQeS8T1ohCYzQ/viewform?usp=pp_url&entry.1657893088=Modificare+detalii+locatie:+';

@Component({
  selector: 'app-location-info',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule, LocationScheduleComponent],
  templateUrl: './location-info.component.html',
  styleUrl: './location-info.component.scss'
})
export class LocationInfoComponent {
  location = input<ISGRLocation>();

  googleMapsUrl = computed(() => {
    if (!this.location()?.lat || !this.location()?.lng) {
      return null;
    }

    return `${BASE_GMAPS_URL}${this.location()?.lat},${this.location()?.lng}`;
  });

  feedbackFormUrl = computed(() => {
    const locationDetails = `${this.location()?.name} (${this.location()?.address})`;

    return `${LOCATION_CHANGES_FORM_URL}${encodeURI(locationDetails)}`;
  });
}
