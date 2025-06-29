
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
  const token = localStorage.getItem('token'); 
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.post(`${this.baseApiUrl}/create-user`, userData, { headers });
}

 // Modifier un utilisateur
modifyUser(userId: string, userData: any): Observable<any> {
  const token = localStorage.getItem('token'); 
  console.log(token)
const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
return this.http.put(`${this.baseApiUrl}/modify-user/${userId}`, userData, { headers });

}

  getAgents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  // Récupérer les clients
  getClients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/users-by-role/Client`);
  }


  // Supprimer un utilisateur
deleteUser(userId: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.delete(`${this.baseApiUrl}/delete-user/${userId}`, { headers });
}

  getUserById(userId: string): Observable<any> {
    return this.http.get<any>(`${this.baseApiUrl}/user/${userId}`);
  }

}
