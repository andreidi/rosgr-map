import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISGRLocation } from '../../types/location';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private _http = inject(HttpClient);

  getCountryGeoJSONData(): Observable<Object> {
    return this._http.get('assets/romania.geojson', { responseType: 'json' });
  }

  getSGRLocationsData(): Observable<ISGRLocation[]> {
    return this._http.get('assets/locations.json', { responseType: 'json' }) as Observable<ISGRLocation[]>;
  }
}
