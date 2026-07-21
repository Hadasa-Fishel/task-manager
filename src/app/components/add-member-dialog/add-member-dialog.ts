import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-member-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <h2>Add New Member</h2>
        <p>Enter the User ID to invite a user to your team.</p>
      </div>

      <div class="dialog-content">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Member User ID</mat-label>
          <!-- שדה קלט המבקש ID במקום אימייל -->
          <input matInput [formControl]="userIdControl" placeholder="Enter User ID (e.g., 5)">
          @if (userIdControl.hasError('required')) {
            <mat-error>User ID is required</mat-error>
          }
        </mat-form-field>
      </div>

      <div class="dialog-actions">
        <button class="action-btn secondary" (click)="close()">Cancel</button>
        <button class="action-btn primary" 
                (click)="add()" 
                [disabled]="userIdControl.invalid">
          Add Member
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./add-member-dialog.css']
})
export class AddMemberDialogComponent {
  private dialogRef = inject(MatDialogRef<AddMemberDialogComponent>);
  
  // הגדרת שדה עם ולידציה ל-ID חובה
  userIdControl = new FormControl('', [Validators.required]);

  add() {
    if (this.userIdControl.valid) {
      // מחזיר את ה-ID שהוקלד כדי שהשירות ישלח אותו לשרת
      this.dialogRef.close(this.userIdControl.value);
    }
  }

  close() {
    this.dialogRef.close();
  }
}