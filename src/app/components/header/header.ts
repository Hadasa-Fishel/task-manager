import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  authService = inject(AuthService);
  
  // שליפת שם המשתמש מהסיגנל
  userName = computed(() => this.authService.currentUser()?.name || 'Guest');

  onLogout() {
    this.authService.logout();
  }
}