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
        <p>Enter the email address to invite a user to your team.</p>
      </div>

      <div class="dialog-content">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Member Email</mat-label>
          <input matInput [formControl]="emailControl" placeholder="name@example.com">
          @if (emailControl.hasError('email') && !emailControl.hasError('required')) {
            <mat-error>Please enter a valid email address</mat-error>
          }
          @if (emailControl.hasError('required')) {
            <mat-error>Email is required</mat-error>
          }
        </mat-form-field>
      </div>

      <div class="dialog-actions">
        <button class="action-btn secondary" (click)="close()">Cancel</button>
        <button class="action-btn primary" 
                (click)="add()" 
                [disabled]="emailControl.invalid">
          Add Member
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./add-member-dialog.css']
})
export class AddMemberDialogComponent {
  private dialogRef = inject(MatDialogRef<AddMemberDialogComponent>);
  
  // הגדרת שדה עם ולידציה לאימייל חובה
  emailControl = new FormControl('', [Validators.required, Validators.email]);

  add() {
    if (this.emailControl.valid) {
      this.dialogRef.close(this.emailControl.value);
    }
  }

  close() {
    this.dialogRef.close();
  }
}