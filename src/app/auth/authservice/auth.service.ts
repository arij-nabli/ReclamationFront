import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private _httpClient: HttpClient,
 
)
{
}

  set accessToken(token: string)
  {
      localStorage.setItem('accessToken', token);
  }

  get accessToken(): string
  {
      return localStorage.getItem('accessToken') ?? '';
  }
  private _authenticated: boolean = false;
   /**
     * Sign in
     *
     * @param credentials
     */
   signIn(credentials: { email: string; password: string }): Observable<any> {
    // Vérifier si l'utilisateur est déjà connecté
    if (this._authenticated) {
        return throwError('User is already logged in.');
    }

    // Utiliser l'URL de l'API depuis l'environnement
    const loginUrl = `${environment.baseUrl}/users/login`;

    return this._httpClient.post(loginUrl, credentials).pipe(
        switchMap((response: any) => {
            if (response && response.token) {
                // Stocker le token d'accès dans le local storage
                this.accessToken = response.token;

                // Marquer l'utilisateur comme authentifié
                this._authenticated = true;
console.log(this._authenticated)
                // Retourner une nouvelle observable avec la réponse
                return of(response);
            } else {
                return throwError('Login failed: Invalid response structure.');
            }
        }),
        catchError((error) => {
            // Gestion des erreurs
            return throwError(error);
        })
    );
}



}