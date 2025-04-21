import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Severity } from 'src/app/Models/Severity';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SeverityService {

  private apiUrl = `${environment.baseUrl}/Severity`;

  constructor(private http: HttpClient) { }

  // Récupérer tous les niveaux de gravité
  getAllSeverities(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Récupérer un niveau de gravité par ID
  getSeverityById(id: string): Observable<Severity> {
    return this.http.get<Severity>(`${this.apiUrl}/${id}`);
  }

  // Ajouter un nouveau niveau de gravité
  addSeverity(severity: Severity): Observable<Severity> {
    return this.http.post<Severity>(this.apiUrl, severity);
  }

  // Mettre à jour un niveau de gravité
  updateSeverity(id: string, severity: Severity): Observable<Severity> {
    return this.http.put<Severity>(`${this.apiUrl}/${id}`, severity);
  }

  // Supprimer un niveau de gravité
  deleteSeverity(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
