import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token');
    
    if (!token) {
      this.router.navigate(['/auth/sign-in']);
      return false;
    }

    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      const userRole = decodedPayload.role;
      
      // Vérifie si la route nécessite un rôle spécifique
      const requiredRoles = route.data['roles'] as Array<string>;
      
      if (!requiredRoles || requiredRoles.includes(userRole)) {
        return true;
      }
      
      // Redirige vers la page d'accueil appropriée selon le rôle
      switch(userRole) {
        case 'Admin':
          this.router.navigate(['/admin/AdminDashbord']);
          break;
        case 'Agent':
          this.router.navigate(['/agent/decision']);
          break;
        case 'Client':
          this.router.navigate(['/claim/add']);
          break;
        default:
          this.router.navigate(['/auth/sign-in']);
      }
      
      return false;
    } catch (error) {
      console.error('Erreur de décodage du token', error);
      this.router.navigate(['/auth/sign-in']);
      return false;
    }
  }
}