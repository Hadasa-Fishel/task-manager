import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectsService } from '../../services/projects.service';
import { TeamsService } from '../../services/teams.service';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, DatePipe,
    MatButtonModule, MatInputModule, MatFormFieldModule, MatIconModule,
    MatProgressBarModule, MatTooltipModule
  ],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class ProjectsComponent implements OnInit {
  projectsService = inject(ProjectsService);
  teamsService = inject(TeamsService);
  
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // שינוי: המזהה הוא מספר או null
  currentTeamId: number | null = null;
  showCreateForm = false;

  projectForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(5)]]
  });

  ngOnInit() {
    if (this.teamsService.myTeams().length === 0) {
      this.teamsService.loadTeams().subscribe();
    }

    this.route.queryParams.subscribe(params => {
      const idParam = params['teamId'];
      // המרה למספר: אם יש פרמטר, נהפוך אותו ל-Number
      this.currentTeamId = idParam ? Number(idParam) : null;
      
      this.projectsService.loadProjects(this.currentTeamId || undefined);
    });
  }

  // פונקציית העזר שתקעה אותך - תוקנה!
  getTeamName(teamId: number): string {
    // כאן היה ה-_id שהוחלף ל-id
    const team = this.teamsService.myTeams().find(t => t.id === teamId);
    return team ? team.name : 'Unknown Team';
  }

  onSubmit() {
    if (this.projectForm.invalid || !this.currentTeamId) return;

    const { name, description } = this.projectForm.value;

    this.projectsService.createProject(this.currentTeamId, name!, description!)
      .subscribe({
        next: () => {
          this.projectForm.reset();
          this.showCreateForm = false;
        }
      });
  }

  // מקבל מספר
  deleteProject(projectId: number) {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectsService.deleteProject(projectId).subscribe();
    }
  }

  // מקבל מספר
  goToTasks(projectId: number) {
    this.router.navigate(['/tasks', projectId]);
  }
}