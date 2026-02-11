import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // הגדרת Zone.js בצורה תקינה
    provideZoneChangeDetection({ eventCoalescing: true }), 
    
    provideRouter(routes),
    provideAnimationsAsync(),
    
    // הגדרת ה-HTTP עם האינטרספטור (מהשלב הקודם)
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    )
  ]
};