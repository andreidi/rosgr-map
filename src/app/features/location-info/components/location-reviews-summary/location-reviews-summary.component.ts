import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  input,
} from '@angular/core';

@Component({
  selector: 'app-location-reviews-summary',
  standalone: true,
  imports: [],
  templateUrl: './location-reviews-summary.component.html',
  styleUrl: './location-reviews-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationReviewsSummaryComponent {
  @HostBinding('style.width') width = '70%';

  starCounts = input.required<number[][]>();

  getScoreRowTooltip(label: number, count: number) {
    return `${label} stele: ${count} recenzii`;
  }
}
