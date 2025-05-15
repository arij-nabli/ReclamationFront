import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    
    if (!token) {
      this.router.navigate(['/auth/sign-in']);
      return false;
    }

    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      
      // Vérifie à la fois le rôle et l'expiration du token
      if (decodedPayload.role ) {
        return true;
      }
    } catch (error) {
      console.error('Erreur de décodage du token', error);
    }

    this.router.navigate(['/auth/sign-in']);
    return false;
  }

  private isTokenExpired(decodedToken: any): boolean {
    if (!decodedToken.exp) return false;
    return Date.now() >= decodedToken.exp * 1000;
  }
}