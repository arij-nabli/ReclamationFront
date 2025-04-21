import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ClaimType } from '../../../Models/ClaimType';

@Injectable({
  providedIn: 'root'
})
export class ClaimtypesService {



  private apiUrl = `${environment.baseUrl}/ClaimType`; // API base URL

  constructor(private http: HttpClient) {}

  // Récupérer tous les types de réclamation
  getClaimTypes(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  
  
    // Récupérer un type de réclamation par ID
    getClaimTypeById(id: string): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/${id}`);
    }
    
    
  
    // Ajouter un nouveau type de réclamation
    addClaimType(claimType: ClaimType): Observable<ClaimType> {
      return this.http.post<ClaimType>(this.apiUrl, claimType, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      });
    }
  
    // Mettre à jour un type de réclamation
    updateClaimType(id:string, claimType: ClaimType): Observable<ClaimType> {
      return this.http.put<ClaimType>(`${this.apiUrl}/${id}`, claimType, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      });
    }
    getClaimTypeDetails(claimTypeId: string): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/details/${claimTypeId}`);
    }
    // Supprimer un type de réclamation
    deleteClaimType(id: string): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
  }