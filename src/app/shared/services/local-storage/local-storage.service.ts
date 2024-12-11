import { Injectable } from '@angular/core';

const localStorage = window.localStorage;

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  setItem(key: string, value: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  }

  getItem(key: string) {
    try {
      const item = localStorage.getItem(key);

      if (item) {
        return JSON.parse(item);
      }
    } catch (error) {
      console.error(error);
    }
  }

  removeItem(key: string) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(error);
    }
  }

  clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error(error);
    }
  }
}
