import { Component, effect, inject, input, OnInit } from '@angular/core';
import { from, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SGRLocationService } from '../../services/supabase/locations.service';
import { ISGRLocationSchedule } from '../../types/location';

@Component({
  selector: 'app-location-schedule',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './location-schedule.component.html',
  styleUrl: './location-schedule.component.scss'
})
export class LocationScheduleComponent {
  locationId = input.required<string>();
  schedules$!: Observable<ISGRLocationSchedule[]>;

  private _locations = inject(SGRLocationService);

  constructor() {
    effect(() => {
      this.schedules$ = from(this._locations.getLocationSchedule(this.locationId()));
    });
  }
}
