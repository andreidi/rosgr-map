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

export enum ELocationSuggestionType {
  NEW = 'new',
  EDIT = 'edit',
}

export interface IGMapsLocationSuggestion {
  gMapsURL: string;
  schedule?: string;
  rvmCount?: number;
}

export interface IManualLocationSuggestion
  extends Omit<ISGRLocation, 'verified' | 'id'> {
  locationId?: string;
  schedule?: string;
  suggestionType: ELocationSuggestionType;
}
