import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { tap, catchError, throwError, Observable } from 'rxjs';
import { AuthResponse, User, RegisterPayload } from '../models/types.model';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router); 
  private toastService = inject(ToastService);
  private platformId = inject(PLATFORM_ID); 

  private apiUrl = `${environment.apiUrl}/auth`;
  
  currentUser = signal<User | null>(null);
  isAuthenticated = computed(() => !!this.currentUser());

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.restoreUserFromStorage();
    }
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => {
        if (response.token && response.user) {
          this.handleAuthSuccess(response);
          this.toastService.showSuccess('Login successful! Welcome back.');
        }
      }),
      catchError((err) => {
        this.toastService.showError('Login failed: Incorrect email or password');
        return throwError(() => err);
      })
    );
  }

  register(payload: RegisterPayload) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload).pipe(
      tap((response) => {
        if (response.token && response.user) {
          this.handleAuthSuccess(response);
          this.toastService.showSuccess('Registration successful! Welcome aboard.');
        }
      }),
      catchError((err) => {
        this.toastService.showError('Registration failed. Email might already be in use.');
        return throwError(() => err);
      })
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem('token'); 
      sessionStorage.removeItem('user');
    }
    
    this.currentUser.set(null);
    this.router.navigate(['/login']); 
    this.toastService.showSuccess('Logged out successfully');
  }

  private handleAuthSuccess(response: AuthResponse) {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('token', response.token);
      sessionStorage.setItem('user', JSON.stringify(response.user));
    }
    this.currentUser.set(response.user);
  }

  private restoreUserFromStorage() {
    if (!isPlatformBrowser(this.platformId)) return;

    const token = sessionStorage.getItem('token');
    const userString = sessionStorage.getItem('user');

    if (token && userString) {
      try {
        const user = JSON.parse(userString) as User;
        this.currentUser.set(user);
      } catch (e) {
        this.logout();
      }
    }
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/users`).pipe(
      catchError((err) => {
        console.error('Error loading users:', err);
        return throwError(() => err);
      })
    );
  }
  
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return sessionStorage.getItem('token');
    }
    return null;
  }
}