import { Injectable } from '@angular/core';
import {
  createClient,
  SupabaseClient,
} from '@supabase/supabase-js'

import { environment } from '../../environments/environment';
import { SUPABASE_TABLES } from '../../utils/constants';
import { ISGRLocation, ISGRLocationSchedule } from '../../types/location';

const { locations, locationSchedules } = SUPABASE_TABLES();

@Injectable({
  providedIn: 'root'
})
export class SGRLocationService {
  private _supabase: SupabaseClient;

  constructor() {
    this._supabase = createClient(environment.supabase.url, environment.supabase.key)
  }

  async getAllLocations(): Promise<ISGRLocation[]> {
    const { data, error } = await this._supabase.from(locations).select('id, name, lat, lng, address, rvmCount');

    if (error) {
      console.error('Failed to retrieve location data', error);
      return [];
    }

    return data as ISGRLocation[];
  }

  async getLocationSchedule(locationId: string): Promise<ISGRLocationSchedule[]> {
    const { data, error } = await this._supabase.from(locationSchedules).select('day, hoursInterval').filter('locationId', 'eq', locationId);

    if (error) {
      console.error('Failed to retrieve location schedule', error);
      return [];
    }

    return data as ISGRLocationSchedule[];
  }
}