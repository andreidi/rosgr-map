import { Component, effect, inject, input, OnDestroy } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { from, Subscription } from 'rxjs';

import { ISGRLocationReview } from '../../types/location';
import { SGRLocationService } from '../../services/supabase/locations.service';
import { LocationReviewDialogComponent } from '../location-review-dialog/location-review-dialog.component';
import { NgbRatingComponent } from '../../components/rating/rating.component';
import { DEFAULT_STAR_COUNTS } from '../../utils/constants';
import { LocationReviewComponent } from '../location-review/location-review.component';
import { LocationReviewsSummaryComponent } from '../location-reviews-summary/location-reviews-summary.component';

@Component({
  selector: 'app-location-reviews',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
    NgbRatingComponent,
    DecimalPipe,
    LocationReviewComponent,
    LocationReviewsSummaryComponent,
  ],
  templateUrl: './location-reviews.component.html',
  styleUrl: './location-reviews.component.scss',
})
export class LocationReviewsComponent implements OnDestroy {
  readonly dialog = inject(MatDialog);

  locationId = input.required<string>();
  reviews: ISGRLocationReview[] = [];
  locationScore = 0;
  starCounts: number[][] = DEFAULT_STAR_COUNTS;

  isLoading = true;

  private _locations = inject(SGRLocationService);
  private _subscription$!: Subscription;

  constructor() {
    effect(() => {
      if (this.locationId()) {
        this._retrieveLocationReviews();
      }
    });
  }

  ngOnDestroy(): void {
    this._subscription$?.unsubscribe();
  }

  openNewReviewDialog() {
    this.dialog.open(LocationReviewDialogComponent, {
      data: { locationId: this.locationId() },
      width: '600px',
    });
  }

  private _calculateLocationRating() {
    const totalStars = this.reviews.reduce((sum, obj) => sum + obj.stars, 0);

    this.locationScore = totalStars / this.reviews.length;

    const starCountsObj = {
      '5': 0,
      '4': 0,
      '3': 0,
      '2': 0,
      '1': 0,
      // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
    } as { [key: string]: number };

    this.reviews.forEach(({ stars }) => {
      const starLabel = String(stars);

      if (starLabel in starCountsObj) {
        starCountsObj[starLabel]++;
      }
    });

    this.starCounts = Object.entries(starCountsObj)
      .map(([stars, count]) => [
        parseInt(stars),
        count,
        (count / this.reviews.length) * 100,
      ])
      .sort((a, b) => b[0] - a[0]);
  }

  private _retrieveLocationReviews() {
    this.isLoading = true;
    this.locationScore = 0;
    this.starCounts = DEFAULT_STAR_COUNTS;

    this._subscription$ = from(
      this._locations.getLocationReviews(this.locationId()),
    ).subscribe({
      next: (value) => {
        this.reviews = value;

        if (value.length) {
          this._calculateLocationRating();
        }
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
