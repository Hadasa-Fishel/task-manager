import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../models/types.model';
import { ToastService } from './toast.service';
import { tap, catchError, throwError } from 'rxjs';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  private apiUrl = `${environment.apiUrl}/tasks`;

  // הסיגנל שמחזיק את כל המשימות של הפרויקט הנוכחי
  projectTasks = signal<Task[]>([]);
  isLoading = signal<boolean>(false);

  loadTasks(projectId: number) {
    this.isLoading.set(true);
    return this.http.get<Task[]>(`${this.apiUrl}?projectId=${projectId}`).pipe(
      tap((tasks) => {
        this.projectTasks.set(tasks);
        this.isLoading.set(false);
      }),
      catchError((err) => {
        this.isLoading.set(false);
        return throwError(() => err);
      })
    );
  }

  createTask(task: Partial<Task>) {
    return this.http.post<Task>(this.apiUrl, task).pipe(
      tap((newTask) => {
        this.projectTasks.update(tasks => [...tasks, newTask]);
        this.toastService.showSuccess('Task added');
      })
    );
  }

  updateTask(taskId: number, updates: Partial<Task>) {
    return this.http.put<Task>(`${this.apiUrl}/${taskId}`, updates).pipe(
      tap((updatedTask) => {
        this.projectTasks.update(tasks => 
          tasks.map(t => t.id === taskId ? updatedTask : t)
        );
        this.toastService.showSuccess('Task updated');
      })
    );
  }

  deleteTask(taskId: number) {
    return this.http.delete(`${this.apiUrl}/${taskId}`).pipe(
      tap(() => {
        this.projectTasks.update(tasks => tasks.filter(t => t.id !== taskId));
        this.toastService.showSuccess('Task deleted');
      })
    );
  }
}