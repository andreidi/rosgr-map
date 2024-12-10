import { Component, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

import { MapComponent } from '@features/map/components/map/map.component';
import { LocationInfoComponent } from '@features/location-info/components/location-info-sidebar/location-info.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';

import { ISGRLocation } from '@shared/types/location';
import { SuggestLocationFABComponent } from "../../features/suggest-location/components/suggest-location-fab/suggest-location-fab.component";

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
    SuggestLocationFABComponent
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
