import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';

import { SGRLocationService } from '@shared/services/locations/locations.service';
import { NotificationsService } from '@shared/services/notifications/notifications.service';

import {
  ELocationSuggestionType,
  IGMapsLocationSuggestion,
  IManualLocationSuggestion,
} from '../../shared/types/location';

@Component({
  selector: 'app-suggest-location',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatIconModule,
    MatStepperModule,
    RouterLink,
  ],
  templateUrl: './suggest-location.component.html',
  styleUrl: './suggest-location.component.scss',
})
export class SuggestLocationComponent {
  private _locations = inject(SGRLocationService);
  private _notification = inject(NotificationsService);

  firstGMapsForm = new FormGroup({
    url: new FormControl('', Validators.required),
  });
  secondGMapsForm = new FormGroup({
    schedule: new FormControl(''),
    rvmCount: new FormControl(1, Validators.min(1)),
  });

  manualLocationForm = new FormGroup({
    name: new FormControl('', Validators.required),
    lat: new FormControl('', Validators.required),
    lng: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    city: new FormControl(''),
    county: new FormControl(''),
    schedule: new FormControl(''),
    rvmCount: new FormControl(1, Validators.min(1)),
  });

  saveUsingGoogleMapsLink() {
    if (this.firstGMapsForm.invalid || this.secondGMapsForm.invalid) {
      return;
    }

    this.firstGMapsForm.disable();
    this.secondGMapsForm.disable();

    const gMapsURL = this.firstGMapsForm.getRawValue().url as string;
    const schedule = this.secondGMapsForm.getRawValue().schedule as string;
    const rvmCount = this.secondGMapsForm.getRawValue().rvmCount as number;

    const locationSuggestion: IGMapsLocationSuggestion = {
      gMapsURL,
      schedule,
      rvmCount,
    };

    this._locations
      .createLocationSuggestion(locationSuggestion)
      .then(() => {
        this._notifySuccess();
        this.firstGMapsForm.reset();
        this.secondGMapsForm.reset();
      })
      .catch((error) => {
        console.error('Failed to create location suggestion', error);
        this._notifyError();
      })
      .finally(() => {
        this.firstGMapsForm.enable();
        this.secondGMapsForm.enable();
      });
  }

  saveManually() {
    this.manualLocationForm.markAllAsTouched();

    if (this.manualLocationForm.invalid) {
      return;
    }

    this.manualLocationForm.disable();

    const lat = parseFloat(this.manualLocationForm.getRawValue().lat as string);
    const lng = parseFloat(this.manualLocationForm.getRawValue().lng as string);

    const locationSuggestion = {
      ...this.manualLocationForm.getRawValue(),
      lat,
      lng,
      suggestionType: ELocationSuggestionType.NEW,
    };

    this._locations
      .createLocationSuggestion(locationSuggestion as IManualLocationSuggestion)
      .then(() => {
        this._notifySuccess();
        this.manualLocationForm.reset();
      })
      .catch((error) => {
        console.error('Failed to create location suggestion', error);
        this._notifyError();
      })
      .finally(() => {
        this.manualLocationForm.enable();
      });
  }

  private _notifySuccess() {
    this._notification.dialog({
      title: 'Mulțumim pentru contribuție!',
      message:
        'Locația sugerată va fi verificată de echipa noastră și, dacă îndeplinește criteriile, o vom adăuga pe hartă în scurt timp.',
      icon: 'check_circle_outline',
    });
  }

  private _notifyError() {
    this._notification.dialog({
      title: 'A apărut o problemă...',
      message:
        'Ne pare rău, a apărut o problemă și sugestia ta nu a fost salvata. Te rugăm să încerci din nou.',
      icon: 'error_outline',
    });
  }
}
