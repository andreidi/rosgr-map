import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationDialogComponent } from './notification-dialog.component';

interface INotificationDialogOptions {
  message: string;
  title?: string;
  icon?: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private _dialog = inject(MatDialog);
  private _snackBar = inject(MatSnackBar);

  dialog({ title, message, icon }: INotificationDialogOptions) {
    this._dialog.open(NotificationDialogComponent, {
      data: {
        title,
        message,
        icon,
      },
    });
  }

  toast(message: string) {
    this._snackBar.open(message, 'Close', { duration: 5000 });
  }
}
