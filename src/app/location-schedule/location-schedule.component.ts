import { Component, effect, inject, input, OnDestroy, OnInit } from '@angular/core';
import { from, Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { SGRLocationService } from '../../services/supabase/locations.service';
import { ISGRLocationSchedule } from '../../types/location';

@Component({
  selector: 'app-location-schedule',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressBarModule],
  templateUrl: './location-schedule.component.html',
  styleUrl: './location-schedule.component.scss'
})
export class LocationScheduleComponent implements OnDestroy {
  locationId = input.required<string>();
  schedules: ISGRLocationSchedule[] = [];
  isLoading = true;

  private _locations = inject(SGRLocationService);
  private _subscription$!: Subscription;

  constructor() {
    effect(() => {
      this.isLoading = true;
      this._subscription$ = from(this._locations.getLocationSchedule(this.locationId())).subscribe({
        next: (value) => {
          this.schedules = value;
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    });
  }

  ngOnDestroy(): void {
    this._subscription$.unsubscribe();
  }
}
