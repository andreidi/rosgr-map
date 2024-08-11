import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

import { MapComponent } from './map/map.component';
import { LoadingComponent } from './loading/loading.component';
import { LocationInfoComponent } from './location-info/location-info.component';
import { ISGRLocation } from '../types/location';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatSidenavModule, MatIconModule, MatButtonModule, MatTooltipModule, MapComponent, LocationInfoComponent, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  @ViewChild('sidenav') private _sidenav!: MatSidenav;

  selectedLocation!: ISGRLocation;

  onLocationSelected(location: ISGRLocation) {
    this.selectedLocation = location;
    this._sidenav.open();
  }
}
