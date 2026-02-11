import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service'; // ודאי שהנתיב נכון

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // בודקים את הסיגנל ע"י הפעלה שלו כפונקציה
  if (authService.isAuthenticated()) {
    return true;
  }

  // אם לא מחובר - זורקים ללוגין
  router.navigate(['/login']);
  return false;
};