import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { NgbRatingComponent } from '@shared/components/rating/rating.component';
import { SGRLocationService } from '../../../../shared/services/locations/locations.service';

@Component({
  selector: 'app-location-review-dialog',
  standalone: true,
  templateUrl: './location-review-dialog.component.html',
  styleUrl: './location-review-dialog.component.scss',
  imports: [
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatButtonModule,
    MatProgressSpinnerModule,
    NgbRatingComponent,
  ],
})
export class LocationReviewDialogComponent {
  ratingStars = 0;
  ratingDetails = '';

  isLoading = false;
  isComplete = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { locationId: string },
    private _locations: SGRLocationService,
  ) {}

  postNewReview() {
    const locationId = this.data.locationId;

    if (!locationId || this.ratingStars === 0) {
      return;
    }

    this.isLoading = true;

    this._locations
      .postLocationReview({
        locationId,
        stars: this.ratingStars,
        details: this.ratingDetails,
      })
      .then(() => {
        this.isComplete = true;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
