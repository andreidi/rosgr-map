import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { from, Observable, of, tap } from 'rxjs';

import { CacheService } from '../cache/cache.service';
import { ASSETS_CONFIG } from '../../utils/constants';
import { ISGRLocation } from '../../types/location';
import { SGRLocationService } from '../supabase/locations.service';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private _http = inject(HttpClient);
  private _cache = inject(CacheService);
  private _locations = inject(SGRLocationService);

  private _assetsConfig = ASSETS_CONFIG();

  getCountryGeoJSONData(): Observable<Object> {
    const cachedData = this._cache.getData(this._assetsConfig.geoJSONCacheKey, this._assetsConfig.geoJSONCacheTTL);

    if (cachedData) {
      return of(cachedData);
    }

    return this._http.get(this._assetsConfig.geoJSON, { responseType: 'json' }).pipe(
      tap(data => {
        const cachedData = {
          timestamp: new Date().getTime(),
          data
        };
        this._cache.setData(this._assetsConfig.geoJSONCacheKey, cachedData);
      })
    );
  }

  getSGRLocationsData(): Observable<ISGRLocation[]> {
    const cachedData = this._cache.getData(this._assetsConfig.locationsCacheKey, this._assetsConfig.locationsCacheTTL);

    if (cachedData) {
      return of(cachedData);
    }

    return from(this._locations.getAllLocations()).pipe(
      tap((data: ISGRLocation[]) => {
        if (data?.length) {
          const cachedData = {
            timestamp: new Date().getTime(),
            data
          };
          this._cache.setData(this._assetsConfig.locationsCacheKey, cachedData);
        }
      })
    );
  }
}
