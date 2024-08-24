export interface ISGRLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  city: string;
  county: string;
  rvmCount: number;
  verified: boolean;
}

export interface ISGRLocationSchedule {
  day: string;
  hoursInterval: string;
}

export interface ISGRLocationReviewCreate {
  locationId: string;
  stars: number;
  details: string;
}

export interface ISGRLocationReview extends ISGRLocationReviewCreate {
  id: number;
  createdAt: number;
}
