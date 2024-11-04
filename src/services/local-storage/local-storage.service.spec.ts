import { TestBed } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;
  let mockStorage: Record<string, string> = {};

  beforeEach(() => {
    mockStorage = {};

    spyOn(window.localStorage, 'setItem').and.callFake(
      (key: string, value: string) => (mockStorage[key] = value + ''),
    );
    spyOn(window.localStorage, 'getItem').and.callFake((key: string) =>
      key in mockStorage ? mockStorage[key] : null,
    );
    spyOn(window.localStorage, 'removeItem').and.callFake(
      (key) => delete mockStorage[key],
    );
    spyOn(window.localStorage, 'clear').and.callFake(() => (mockStorage = {}));

    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set item in storage', () => {
    const expected = JSON.stringify({ value: 'value' });

    service.setItem('key', { value: 'value' });
    expect(window.localStorage.setItem).toHaveBeenCalledWith('key', expected);
  });

  it('should get item from storage', () => {
    const expected = { value: 'value' };

    service.setItem('key', expected);

    expect(service.getItem('key')).toEqual(expected);
  });

  it('should remove item from storage', () => {
    service.setItem('key', { value: 'value' });
    service.removeItem('key');

    expect(window.localStorage.removeItem).toHaveBeenCalledWith('key');
    expect(service.getItem('key')).toBeUndefined();
  });

  it('should clear storage', () => {
    service.setItem('key', { value: 'value' });
    service.clear();

    expect(window.localStorage.clear).toHaveBeenCalled();
    expect(service.getItem('key')).toBeUndefined();
  });
});
