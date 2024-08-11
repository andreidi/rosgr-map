import { Injectable } from '@angular/core';
import {
  createClient,
  SupabaseClient,
} from '@supabase/supabase-js'

import { environment } from '../../environments/environment';
import { SUPABASE_TABLES } from '../../utils/constants';
import { ISGRLocation, ISGRLocationReview, ISGRLocationSchedule } from '../../types/location';

const { locations, locationSchedules, locationReviews } = SUPABASE_TABLES();

@Injectable({
  providedIn: 'root'
})
export class SGRLocationService {
  private _supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = environment.production ? process.env['SUPABASE_URL'] : environment.supabase.url;
    const supabaseKey = environment.production ? process.env['SUPABASE_KEY'] : environment.supabase.key;

    this._supabase = createClient(supabaseUrl as string, supabaseKey as string);
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

  async getLocationReviews(locationId: string): Promise<ISGRLocationReview[]> {
    const { data, error } = await this._supabase.from(locationReviews).select('*').filter('locationId', 'eq', locationId);

    if (error) {
      console.error('Failed to retrieve location reviews', error);
      return [];
    }

    return data as ISGRLocationReview[];
  }
}
