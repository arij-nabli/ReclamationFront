import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth/authservice/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthRedirectGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      this.redirectBasedOnRole();
      return false; // Bloque l'accès à /auth pour les utilisateurs connectés
    }
    return true; // Autorise l'accès à /auth pour les non-authentifiés
  }

  private redirectBasedOnRole(): void {
    const token = localStorage.getItem('token');
    
    if (!token) {
      this.router.navigate(['/']);
      return;
    }

    const role = this.decodeToken(token)?.role;
    
    switch(role) {
      case 'Client':
        this.router.navigate(['/claim/add']);
        break;
      case 'Admin':
        this.router.navigate(['/admin/AdminDashbord']);
        break;
      case 'Agent':
        this.router.navigate(['/agent/decision']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Token invalide', error);
      return null;
    }
  }
}