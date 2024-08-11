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
}

export interface ISGRLocationSchedule {
  day: string;
  hoursInterval: string;
}

export interface ISGRLocationReview {
  id: number;
  locationId: string;
  stars: number;
  details: string;
  created_at: number;
}

export enum ESGRLocationType {
  AUTOMATIC = 'Automat',
  MANUAL = 'Manual'
}
