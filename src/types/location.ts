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

export enum ESGRLocationType {
  AUTOMATIC = 'Automat',
  MANUAL = 'Manual'
}
