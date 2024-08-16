import { NgModule } from '@angular/core';

import { NgbRating } from './rating.component';

export { NgbRating } from './rating.component';
export { NgbRatingConfig } from './rating-config';

@NgModule({
  imports: [NgbRating],
  exports: [NgbRating],
})
export class NgbRatingModule {}
