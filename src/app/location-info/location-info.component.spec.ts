import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationInfoComponent } from './location-info.component';
import { BASE_GMAPS_URL } from '../../utils/constants';
import { ComponentRef } from '@angular/core';

describe('LocationInfoComponent', () => {
  let component: LocationInfoComponent;
  let componentRef: ComponentRef<LocationInfoComponent>;
  let fixture: ComponentFixture<LocationInfoComponent>;

  const mockLocation = {
    lat: 123,
    lng: 456,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LocationInfoComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    componentRef.setInput('location', mockLocation);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute google maps url if location lat and lng are present', () => {
    expect(component.googleMapsUrl()).toBe(
      `${BASE_GMAPS_URL}${mockLocation.lat},${mockLocation.lng}`,
    );
  });

  it('should not compute google maps url if location lat or lng are not present', () => {
    componentRef.setInput('location', {});
    fixture.detectChanges();

    expect(component.googleMapsUrl()).toBeNull();
  });
});
