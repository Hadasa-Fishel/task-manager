import { Routes } from '@angular/router';

// Auth Components
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register';

// Main Components
import { Teams } from './components/teams/teams'; // ודאי שזה השם אצלך
import { ProjectsComponent } from './components/projects/projects';
import { TaskBoard } from './components/task-board/task-board'; // ודאי שזה השם אצלך

// Guards
import { authGuard } from './core/interceptors/guards/auth.guard';

export const routes: Routes = [
  // --- Public Routes (פתוח לכולם) ---
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // --- Protected Routes (דורש התחברות) ---
  {
    path: '',
    canActivate: [authGuard], // השומר שבודק אם יש טוקן
    children: [
      { path: 'teams', component: Teams },
      
      // עמוד הפרויקטים (יכול לקבל ?teamId=... דרך ה-URL)
      { path: 'projects', component: ProjectsComponent },
      
      // עמוד המשימות (דורש ID של פרויקט)
      { path: 'tasks/:projectId', component: TaskBoard },
      
      // ברירת מחדל למחוברים: הולך לצוותים
      { path: '', redirectTo: 'teams', pathMatch: 'full' }
    ]
  },

  // --- Wildcard (כל כתובת לא מוכרת זורקת ללוגין) ---
  { path: '**', redirectTo: 'login' }
];