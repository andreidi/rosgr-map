import { AfterViewInit, Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import 'leaflet.markercluster';

import { BASE_GMAPS_URL, TILE_LAYER_ATTRIBUTION, TILE_LAYER_MAX_ZOOM, TILE_LAYER_URL } from '../../utils/constants';
import { ISGRLocation } from '../../types/location';


@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements AfterViewInit {
  private _httpClient = inject(HttpClient);

  private _map!: L.Map;

  private _initMap(): void {
    const defaultLatLng: L.LatLngExpression = [45.9432, 24.9668];

    // Define Romania's bounding box
    const southWest = L.latLng(43.5, 20.2);
    const northEast = L.latLng(48.3, 30.0);
    const romaniaBounds = L.latLngBounds(southWest, northEast);

    // Initialize the map with restricted bounds
    this._map = L.map('map', {
      center: defaultLatLng,
      zoom: 8,
      zoomControl: false,
      maxBounds: romaniaBounds,
      maxBoundsViscosity: 1.0
    });

    // Add tile layer
    L.tileLayer(TILE_LAYER_URL, {
      maxZoom: TILE_LAYER_MAX_ZOOM,
      attribution: TILE_LAYER_ATTRIBUTION
    }).addTo(this._map);

    // Set minimum zoom level
    this._map.setMinZoom(this._map.getBoundsZoom(romaniaBounds));

    this._httpClient.get('assets/romania.geojson', { responseType: 'json' })
      .subscribe((romaniaData: any) => {
        if (romaniaData) {
          const romaniaLayer = L.geoJSON(romaniaData, {
            style: {
              color: '#2e7d32',
              weight: 2,
              opacity: 0.8,
              fillOpacity: 0
            }
          }).addTo(this._map);

          // Fit the map to the bounds of Romania
          this._map.fitBounds(romaniaLayer.getBounds());
        }
      });


    this._addLocationMarkers();
    this._setMapControls();
    this._centerMapOnUserLocation();
  }

  private _addLocationMarkers(): void {
    const icon = L.icon({
      iconUrl: 'map_marker.svg',
      iconSize: [40, 80]
    });

    const markers = window.L.markerClusterGroup();

    this._httpClient.get('assets/locations.json', { responseType: 'json' })
      .subscribe((locations: any) => {
        if (locations) {
          locations.forEach((location: ISGRLocation) => {
            const marker = L.marker([location.lat, location.lng], { icon });
            const popupContent = this._createPopupContent(location);

            marker.bindPopup(popupContent);

            markers.addLayer(marker);
          });
        }
      });

    this._map.addLayer(markers);
  }

  private _setMapControls(): void {
    const position = 'bottomright';

    // Reposition Zoom controls
    L.control.zoom({ position }).addTo(this._map);

    // Declare Locate control
    const locateControl = L.Control.extend({
      options: { position },
      onAdd: () => {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
        const containerStyles: {
          [key: string]: string;
        } = {
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
        }

        for (const [styleKey, styleValue] of Object.entries(containerStyles)) {
          (container.style as any)[styleKey] = styleValue;
        }

        container.onclick = () => {
          this._centerMapOnUserLocation();
        };

        return container;
      }
    });

    // Add Locate control to map
    this._map.addControl(new locateControl());
  }

  private _createPopupContent({ name, lat, lng, address, rvmCount = 1 }: Partial<ISGRLocation>): string {
    const googleMapsUrl = `${BASE_GMAPS_URL}${lat},${lng}`;

    return `
     <div>
      <h2>${name}</h2>
      <p>${address}</p>

      <h3>Automate disponibile: <strong>${rvmCount}</strong></h3>
      <p>
        <a href="${googleMapsUrl}" target="_blank">Navighează la adresă</a>
      </p>
    </div>
    `;
  }

  private _centerMapOnUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const userLatLng: L.LatLngExpression = [position.coords.latitude, position.coords.longitude];
        const icon = L.icon({
          iconUrl: 'map_user.svg',
          iconSize: [20, 20]
        });

        this._map.setView(userLatLng, 13);

        L.marker(userLatLng, { icon }).addTo(this._map).bindPopup('Locația ta');
      }, () => {
        console.warn('Geolocation not supported or permission denied');
      });
    } else {
      console.warn('Geolocation not supported by this browser.');
    }
  }

  ngAfterViewInit(): void {
    this._initMap();
  }
}
