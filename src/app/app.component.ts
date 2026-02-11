import { Component, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './components/header/header'; // ודאי את שם הקובץ
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    @if (showNavbar) {
      <app-header></app-header>
    }
    <main>
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {
  showNavbar = false;
  private router = inject(Router);

  constructor() {
    // מאזין לשינויי דפים כדי להחליט מתי להחביא את ההידר
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const hiddenRoutes = ['/login', '/register'];
      this.showNavbar = !hiddenRoutes.includes(event.urlAfterRedirects);
    });
  }
}