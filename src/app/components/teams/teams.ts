import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router'; 
import { TeamsService } from '../../services/teams.service';
import { AddMemberDialogComponent } from '../add-member-dialog/add-member-dialog';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatDialogModule,
    MatIconModule
  ],
  templateUrl: './teams.html',
  styleUrl: './teams.css'
})
export class Teams implements OnInit {
  // Services Injection
  teamsService = inject(TeamsService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  // State
  showCreateForm = false;

  // Form
  createTeamForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]]
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.teamsService.loadTeams().subscribe();
  }

  onSubmit() {
    if (this.createTeamForm.invalid) return;
    
    const name = this.createTeamForm.value.name!;
    
    this.teamsService.createTeam(name).subscribe({
      next: () => {
        this.createTeamForm.reset();
        this.showCreateForm = false;
        // טעינה מחדש של הנתונים כדי לראות את הצוות החדש
        this.loadData(); 
      }
    });
  }

  enterProjects(teamId: number) {
    this.router.navigate(['/projects'], { queryParams: { teamId: teamId } });
  }

  /**
   * Opens a dialog to add a member via email.
   * If successful, it triggers the user's email client.
   */
  addMember(teamId: number) {
    const dialogRef = this.dialog.open(AddMemberDialogComponent, {
      width: '400px',
      panelClass: 'custom-dialog-wrapper' // אופציונלי לעיצוב נוסף
    });

    dialogRef.afterClosed().subscribe(emailResult => {
      if (emailResult) {
        this.processAddMember(teamId, emailResult);
      }
    });
  }

  private processAddMember(teamId: number, email: string) {
    this.teamsService.addMember(teamId.toString(), email).subscribe({
      next: () => {
        this.openEmailClient(email);
        this.loadData(); // עדכון מונה החברים בכרטיס
      },
      error: (err) => {
        console.error('Failed to add member', err);
        // כאן מומלץ להוסיף סנאקבר או הודעת שגיאה למשתמש
        alert('Could not add member. Please try again.');
      }
    });
  }

  private openEmailClient(email: string) {
    const subject = encodeURIComponent('Join me on WolfTasks');
    const body = encodeURIComponent(
      `Hi!\n\nI've invited you to join my team on WolfTasks workspace.\nPlease log in to collaborate.\n\nBest regards.`
    );
    // פתיחת חלון האימייל
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_self');
  }
}