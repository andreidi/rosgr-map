import {
  AfterViewInit,
  Component,
  inject,
  NgZone,
  OnDestroy,
  output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import * as L from 'leaflet';
import 'leaflet.markercluster';

import { MapService } from '../../services/map/map.service';
import {
  ROMANIA_LATLNG,
  TILE_LAYER_ATTRIBUTION,
  TILE_LAYER_MAX_ZOOM,
  TILE_LAYER_URL,
} from '@shared/utils/constants';

import { ISGRLocation } from '@shared/types/location';
import { SuggestLocationFABComponent } from '@features/suggest-location/components/suggest-location-fab/suggest-location-fab.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [SuggestLocationFABComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements AfterViewInit, OnDestroy {
  locationSelected = output<ISGRLocation>();
  closeSideNav = output<void>();

  private _mapService = inject(MapService);
  private _ngZone = inject(NgZone);

  private _map!: L.Map;
  private _userLocation!: L.LatLngExpression;
  private _romaniaBounds!: L.LatLngBounds;

  private _subscriptions$: Subscription[] = [];

  ngAfterViewInit(): void {
    this._ngZone.runOutsideAngular(() => {
      this._initMap();
    });
    this._setUserLocation();
  }

  ngOnDestroy(): void {
    this._subscriptions$.forEach((subscription$) =>
      subscription$.unsubscribe(),
    );
    this._map.remove();
  }

  private _initMap(): void {
    const romaniaLatLng = ROMANIA_LATLNG as L.LatLngExpression;

    // Define Romania's bounding box
    const southWest = L.latLng(43.5, 20.2);
    const northEast = L.latLng(48.3, 30.0);
    const romaniaBounds = L.latLngBounds(southWest, northEast);

    this._romaniaBounds = romaniaBounds;

    // Initialize the map with restricted bounds
    this._map = L.map('map', {
      center: romaniaLatLng,
      zoom: 8,
      zoomControl: false,
      maxBounds: romaniaBounds,
      maxBoundsViscosity: 1.0,
    });

    // Add tile layer
    L.tileLayer(TILE_LAYER_URL, {
      maxZoom: TILE_LAYER_MAX_ZOOM,
      attribution: TILE_LAYER_ATTRIBUTION,
    }).addTo(this._map);

    // Set minimum zoom level
    this._map.setMinZoom(this._map.getBoundsZoom(romaniaBounds));

    const subscription = this._mapService
      .getCountryGeoJSONData()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .subscribe((romaniaData: any) => {
        if (romaniaData) {
          L.geoJSON(romaniaData, {
            style: {
              color: '#2e7d32',
              weight: 2,
              opacity: 0.8,
              fillOpacity: 0,
            },
            onEachFeature: (_feature, layer) => {
              layer.on('click', () => {
                this.closeSideNav.emit();
              });
            },
          }).addTo(this._map);

          // Fit the map to the bounds of Romania
          this._map.fitBounds(romaniaBounds);
        }
      });
    this._subscriptions$.push(subscription);

    this._addLocationMarkers();
    this._setMapControls();
  }

  private _addLocationMarkers(): void {
    const icon = L.icon({
      iconSize: [40, 80],
      iconUrl: 'map_marker.svg',
    });

    const markers = window.L.markerClusterGroup({
      chunkedLoading: true,
      disableClusteringAtZoom: TILE_LAYER_MAX_ZOOM - 1,
      animate: false,
    });

    const subscription = this._mapService
      .getSGRLocationsData()
      .subscribe((locations: ISGRLocation[]) => {
        if (locations) {
          locations.forEach((location: ISGRLocation) => {
            const marker = L.marker([location.lat, location.lng], { icon });

            marker.bindPopup(location.name);

            marker.on('popupopen', () => {
              this.locationSelected.emit(location);
            });
            marker.on('popupclose', () => {
              this.closeSideNav.emit();
            });

            markers.addLayer(marker);
          });
        }
      });
    this._subscriptions$.push(subscription);

    markers.addTo(this._map);
  }

  private _setMapControls(): void {
    const position = 'bottomright';

    // Reposition Zoom controls
    L.control.zoom({ position }).addTo(this._map);

    // Declare Locate control
    const locateControl = L.Control.extend({
      options: { position },
      onAdd: () => {
        const container = L.DomUtil.create(
          'div',
          'leaflet-bar leaflet-control leaflet-control-custom',
        );
        const containerStyles: Record<string, string> = {
          backgroundColor: 'white',
          backgroundImage: 'url("/map_crosshairs.svg")',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: '20px 20px',
          cursor: 'pointer',
          height: '20px',
          opacity: '0.7',
          padding: '5px',
          width: '20px',
        };

        for (const [styleKey, styleValue] of Object.entries(containerStyles)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (container.style as any)[styleKey] = styleValue;
        }

        container.onclick = () => {
          this._centerMapOnUserLocation();
        };

        return container;
      },
    });

    // Add Locate control to map
    this._map.addControl(new locateControl());
  }

  private _centerMapOnUserLocation(): void {
    if (this._userLocation) {
      this._map.setView(this._userLocation, 14, { animate: false });
    } else {
      this._centerMap();
    }
  }

  private _centerMap(): void {
    this._map.fitBounds(this._romaniaBounds, { animate: false });
  }

  private _setUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const userLatLng: L.LatLngExpression = [
          coords.latitude,
          coords.longitude,
        ];
        const icon = L.icon({
          iconUrl: 'map_user.svg',
          iconSize: [20, 20],
        });

        this._userLocation = userLatLng;

        L.marker(userLatLng, { icon }).addTo(this._map).bindPopup('Locația ta');
      });
    }
  }
}
