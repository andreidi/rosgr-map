export interface ISGRLocation {
  name: string;
  lat: number;
  lng: number;
  address: string;
  city: string;
  county: string;
  rvmCount: number;
  type: ESGRLocationType;
  schedules: ISGRLocationSchedule[];
}

export interface ISGRLocationSchedule {
  day: string;
  hoursInterval: string;
}

export enum ESGRLocationType {
  AUTOMATIC = 'Automat',
  MANUAL = 'Manual'
}
