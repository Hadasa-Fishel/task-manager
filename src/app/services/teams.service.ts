import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, throwError, Observable } from 'rxjs';
import { Team } from '../models/types.model';
import { ToastService } from './toast.service';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  
  // הכתובת הבסיסית: http://localhost:3000/api/teams
  private apiUrl = `${environment.apiUrl}/teams`;

  // הסיגנלים לניהול המצב (State)
  myTeams = signal<Team[]>([]);
  isLoading = signal<boolean>(false);

  // 1. טעינת צוותים
  loadTeams(): Observable<Team[]> {
    this.isLoading.set(true);
    return this.http.get<Team[]>(this.apiUrl).pipe(
      tap((teams) => {
        // מעדכן את הסיגנל עם הרשימה שחזרה מהשרת
        this.myTeams.set(teams);
        this.isLoading.set(false);
      }),
      catchError((err) => {
        this.isLoading.set(false);
        console.error('Error loading teams:', err);
        return throwError(() => err);
      })
    );
  }

  // 2. יצירת צוות חדש
  createTeam(name: string): Observable<Team> {
    // שליחת שם הצוות כאובייקט JSON
    return this.http.post<Team>(this.apiUrl, { name }).pipe(
      tap((newTeam) => {
        // עדכון אופטימי של הרשימה (מוסיף את הצוות החדש מיד)
        this.myTeams.update(teams => [...teams, newTeam]);
        this.toastService.showSuccess('Team created successfully');
      }),
      catchError((err) => {
        this.toastService.showError('Could not create team');
        return throwError(() => err);
      })
    );
  }

  // 3. הוספת חבר לצוות (התיקון החשוב!)
  addMember(teamId: string, email: string): Observable<any> {
    const url = `${this.apiUrl}/${teamId}/members`;
    
    // חובה לשלוח אובייקט, לא סתם מחרוזת! השרת מצפה ל- body.email
    const body = { email: email }; 

    return this.http.post(url, body).pipe(
      tap(() => {
        this.toastService.showSuccess('Member invite sent successfully');
        
        // טעינה מחדש של הצוותים כדי לעדכן את מונה החברים בכרטיס
        this.loadTeams().subscribe(); 
      }),
      catchError((err) => {
        // טיפול בשגיאות נפוצות (למשל: משתמש לא קיים)
        const errorMsg = err.error?.message || 'Failed to add member. Please check the email.';
        this.toastService.showError(errorMsg);
        return throwError(() => err);
      })
    );
  }
}