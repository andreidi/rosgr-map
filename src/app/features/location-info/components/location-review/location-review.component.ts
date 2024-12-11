import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { formatRelative } from 'date-fns';
import { ro } from 'date-fns/locale';

import { NgbRatingComponent } from '@shared/components/rating/rating.component';
import { ISGRLocationReview } from '@shared/types/location';

@Component({
  selector: 'app-location-review',
  standalone: true,
  imports: [NgbRatingComponent],
  templateUrl: './location-review.component.html',
  styleUrl: './location-review.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationReviewComponent {
  review = input.required<ISGRLocationReview>();

  getReviewDate(date: number) {
    return formatRelative(new Date(date), new Date(), {
      locale: ro,
    });
  }
}
