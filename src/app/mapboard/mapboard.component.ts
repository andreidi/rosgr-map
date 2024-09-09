import { Component, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

import { MapComponent } from '../map/map.component';
import { LoadingComponent } from '../loading/loading.component';
import { LocationInfoComponent } from '../location-info/location-info.component';
import { ISGRLocation } from '../../types/location';

@Component({
  selector: 'app-mapboard',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MapComponent,
    LocationInfoComponent,
    LoadingComponent,
  ],
  templateUrl: './mapboard.component.html',
  styleUrl: './mapboard.component.scss',
})
export class MapboardComponent {
  @ViewChild('sidenav') private _sidenav!: MatSidenav;

  selectedLocation!: ISGRLocation;

  onLocationSelected(location: ISGRLocation) {
    this.selectedLocation = location;
    this._sidenav.open();
  }
}
