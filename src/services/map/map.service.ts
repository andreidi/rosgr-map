import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

import { CacheService } from '../cache/cache.service';
import { ASSETS_CONFIG } from '../../utils/constants';
import { ISGRLocation } from '../../types/location';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private _http = inject(HttpClient);
  private _cache = inject(CacheService);

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

    return this._http.get(this._assetsConfig.locations, { responseType: 'json' }).pipe(
      tap((data: any) => {
        const cachedData = {
          timestamp: new Date().getTime(),
          data
        };
        this._cache.setData(this._assetsConfig.locationsCacheKey, cachedData);
      })
    );
  }
}
