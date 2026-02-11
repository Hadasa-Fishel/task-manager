import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // מנסים לשלוף את הטוקן מהזיכרון
  const token = sessionStorage.getItem('token');

  // אם יש טוקן, משכפלים את הבקשה ומוסיפים לה את הכותרת Authorization
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  // אם אין טוקן, ממשיכים כרגיל (ואז השרת יחזיר שגיאה אם צריך)
  return next(req);
};