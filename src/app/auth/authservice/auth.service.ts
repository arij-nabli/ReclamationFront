import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, Observable, of, switchMap, throwError, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _authenticated = new BehaviorSubject<boolean>(false);

  constructor(
    private _httpClient: HttpClient,
    private _router: Router
  ) {
    // Initialiser l'état d'authentification
    this._authenticated.next(this.isAuthenticated());
  }

  getCurrentUser() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  getUserId(): string {
    const token = this.accessToken;
    if (!token) throw new Error('No token found');
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id || 
             payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || 
             payload.sub;
    } catch (error) {
      console.error('Token decoding error:', error);
      throw new Error('Invalid token');
    }
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  get authState$(): Observable<boolean> {
    return this._authenticated.asObservable();
  }

  logout(): void {
    // Supprimer toutes les données d'authentification
    localStorage.removeItem('accessToken');
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    
    // Mettre à jour l'état d'authentification
    this._authenticated.next(false);
    
    // Rediriger vers la page de login
    this._router.navigate(['/auth/sign-in']);
  }

  set accessToken(token: string) {
    localStorage.setItem('accessToken', token);
    this._authenticated.next(true);
  }

  get accessToken(): string {
    return localStorage.getItem('accessToken') ?? '';
  }

  signIn(credentials: { email: string; password: string }): Observable<any> {
    if (this._authenticated.value) {
      return throwError(() => new Error('User is already logged in.'));
    }

    const loginUrl = `${environment.baseUrl}/users/login`;

    return this._httpClient.post(loginUrl, credentials).pipe(
      switchMap((response: any) => {
        if (response?.token) {
          // Stocker le token
          this.accessToken = response.token;
          
          // Stocker les données utilisateur si disponibles
          if (response.user) {
            localStorage.setItem('userData', JSON.stringify(response.user));
          }
          
          return of(response);
        }
        return throwError(() => new Error('Login failed: Invalid response structure.'));
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}