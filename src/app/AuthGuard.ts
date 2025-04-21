import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
  
    if (token) {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      console.log(decodedPayload);
      if (decodedPayload.role === 'Admin') {
        return true; // autorisé
      }
    }

    this.router.navigate(['/auth/sign-in']); // sinon redirige vers login
    return false;
  }
}
