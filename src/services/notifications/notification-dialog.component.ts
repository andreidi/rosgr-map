import { Component, Inject } from '@angular/core';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogTitle,
  MatDialogClose,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-notification-dialog',
  template: `
    @if (data.icon) {
      <div
        [style]="{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '1.25rem',
          fontSize: '3rem',
        }"
      >
        <mat-icon [inline]="true">{{ data.icon }}</mat-icon>
      </div>
    }

    @if (data.title) {
      <h2 mat-dialog-title>{{ data.title }}</h2>
    }

    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Închide</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatIconModule,
  ],
})
export class NotificationDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string; message: string; icon: string },
  ) {}
}
