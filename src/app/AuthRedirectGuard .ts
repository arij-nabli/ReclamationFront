import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth/authservice/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthRedirectGuard {
  
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      // Si l'utilisateur est déjà connecté → on le redirige vers /admin/dashboard (ou autre)
      this.router.navigate(['/admin/dashboard']);
      return false;
    }
    return true;
  }
}
