import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private snackBar = inject(MatSnackBar);

  // הגדרות ברירת מחדל
  private config: MatSnackBarConfig = {
    duration: 3000,           // ההודעה תיעלם אחרי 3 שניות
    horizontalPosition: 'center', // במרכז המסך
    verticalPosition: 'bottom'    // למטה
  };

  // פונקציה להודעת הצלחה (ירוק/חיובי)
  showSuccess(message: string) {
    this.snackBar.open(message, 'OK', {
      ...this.config,
      panelClass: ['success-snackbar'] // מחלקה לעיצוב ירוק
    });
  }

  // פונקציה להודעת שגיאה (אדום/שלילי)
  showError(message: string) {
    this.snackBar.open(message, 'Close', {
      ...this.config,
      duration: 5000, // שגיאות נשארות קצת יותר זמן
      panelClass: ['error-snackbar'] // מחלקה לעיצוב אדום
    });
  }

  // פונקציה להודעה כללית
  showInfo(message: string) {
    this.snackBar.open(message, 'Dismiss', {
      ...this.config
    });
  }
}