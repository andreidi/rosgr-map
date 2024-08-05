import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private _localStorage = inject(LocalStorageService);

  getData(key: string, ttl: number): any {
    const cachedData = this._localStorage.getItem(key);

    if (cachedData) {
      const now = new Date().getTime();
      const parsedData = JSON.parse(cachedData);

      if (now - parsedData.timestamp < ttl) {
        return parsedData.data;
      } else {
        this._localStorage.removeItem(key);
      }
    }
  }

  setData(key: string, data: any) {
    this._localStorage.setItem(key, JSON.stringify(data));
  }
}
