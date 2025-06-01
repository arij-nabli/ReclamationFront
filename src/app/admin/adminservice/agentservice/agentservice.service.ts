
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgentserviceService {
private apiUrl = `${environment.baseUrl}/admin/users-by-role/Agent`; // API base URL
private baseApiUrl = `${environment.baseUrl}/admin`;
  constructor(private http: HttpClient) {
    
  }
    // Récupérer les agents et clients seulement
  getAgentsAndClients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/agents-and-clients`);
  }
    registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.baseApiUrl}/create-user`, userData);
  }
 // Modifier un utilisateur
  modifyUser(userId: string, userData: any): Observable<any> {
    return this.http.put(`${this.baseApiUrl}/modify-user/${userId}`, userData);
  }

  // Supprimer un utilisateur
  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.baseApiUrl}/delete-user/${userId}`);
  }
  getUserById(userId: string): Observable<any> {
    return this.http.get<any>(`${this.baseApiUrl}/user/${userId}`);
  }
  getAgents(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
