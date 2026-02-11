import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '../models/types.model';
import { ToastService } from './toast.service';
import { tap, catchError, throwError } from 'rxjs';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  private apiUrl = `${environment.apiUrl}/projects`;

  projects = signal<Project[]>([]);
  isLoading = signal<boolean>(false);

  // שינוי: teamId הוא מספר (או undefined)
  loadProjects(teamId?: number) {
    this.isLoading.set(true);
    
    const url = teamId 
      ? `${this.apiUrl}?teamId=${teamId}` 
      : this.apiUrl;

    return this.http.get<Project[]>(url).pipe(
      tap((data) => {
        this.projects.set(data);
        this.isLoading.set(false);
      }),
      catchError((err) => {
        this.isLoading.set(false);
        this.toastService.showError('Could not load projects');
        return throwError(() => err);
      })
    ).subscribe();
  }

  // שינוי: teamId הוא מספר
  createProject(teamId: number, name: string, description: string) {
    return this.http.post<Project>(this.apiUrl, { teamId, name, description }).pipe(
      tap((newProject) => {
        this.projects.update(list => [...list, newProject]);
        this.toastService.showSuccess('Project created successfully');
      }),
      catchError((err) => {
        this.toastService.showError('Failed to create project');
        return throwError(() => err);
      })
    );
  }

  // שינוי: projectId הוא מספר
  deleteProject(projectId: number) {
    return this.http.delete(`${this.apiUrl}/${projectId}`).pipe(
      tap(() => {
        // שינוי: סינון לפי id ולא _id
        this.projects.update(list => list.filter(p => p.id !== projectId));
        this.toastService.showSuccess('Project deleted');
      }),
      catchError((err) => {
        this.toastService.showError('Could not delete project');
        return throwError(() => err);
      })
    );
  }
}