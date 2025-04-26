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
      const token = localStorage.getItem('token');
      
      if (token) {
        const role = this.decodeToken(token)?.role; // <-- Assure-toi que le token contient bien "role"
        
        if (role === 'Client') {
          this.router.navigate(['/claim/add']);
        } else if (role === 'Admin') {
          this.router.navigate(['/admin/AdminDashbord']);
        } else {
          this.router.navigate(['/']); // fallback
        }
      }
      return false; // On bloque l’accès à /auth
    }
    return true; // Non authentifié → accès à /auth autorisé
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