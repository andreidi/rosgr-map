export interface ISGRLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  city: string;
  county: string;
  rvmCount: number;
  type: ESGRLocationType;
  verified: boolean;
}

export interface ISGRLocationSchedule {
  day: string;
  hoursInterval: string;
}

export interface ISGRLocationReview {
  id: number;
  createdAt: number;
  locationId: string;
  stars: number;
  details: string;
}

export interface ISGRLocationReviewCreate
  extends Omit<ISGRLocationReview, 'id' | 'createdAt'> {}

export enum ESGRLocationType {
  AUTOMATIC = 'Automat',
  MANUAL = 'Manual',
}
